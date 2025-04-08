import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import type { Tile as TileType, TileValue } from '../types/game';
import { GameState, TILE_EMOJIS, TILE_NAMES } from '../types/game';
import { saveToLeaderboard } from '../types/leaderboard';
import Leaderboard from './Leaderboard';

const GRID_SIZE = 4;
const INITIAL_TIME = 60;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${GRID_SIZE}, 1fr);
  grid-gap: 10px;
  background-color: #bbada0;
  padding: 10px;
  border-radius: 6px;
  margin: 20px 0;
`;

const Cell = styled.div`
  width: 100px;
  height: 100px;
  background-color: rgba(238, 228, 218, 0.35);
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
`;

const TileComponent = styled.div<{ value: number }>`
  width: 100%;
  height: 100%;
  background-color: ${props => {
    const colors: Record<number, string> = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f'
    };
    return colors[props.value] || '#edc22e';
  }};
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: ${props => props.value <= 4 ? '#776e65' : '#f9f6f2'};
`;

const TileEmoji = styled.div`
  font-size: 2em;
  line-height: 1;
`;

const TileValue = styled.div`
  font-size: 0.8em;
  margin-top: 4px;
`;

const ScoreContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 440px;
  margin-bottom: 20px;
`;

const Score = styled.div`
  background-color: #bbada0;
  padding: 10px 20px;
  border-radius: 3px;
  color: white;
  font-weight: bold;
`;

const Timer = styled(Score)`
  background-color: #8f7a66;
`;

const GameOver = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(238, 228, 218, 0.73);
  padding: 20px;
  border-radius: 6px;
  text-align: center;
`;

const NameInput = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1.2em;
  border: 2px solid #bbada0;
  border-radius: 4px;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1.2em;
  background-color: #8f7a66;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #7f6a56;
  }
`;

const Game: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [gameState, setGameState] = useState<GameState>({
    grid: Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)),
    score: 0,
    gameOver: false,
    timeLeft: INITIAL_TIME,
    isPlaying: false
  });

  const generateNewTile = useCallback((): TileType => {
    const value: TileValue = Math.random() < 0.9 ? 2 : 4;
    return {
      value,
      id: Math.random().toString(36).substr(2, 9)
    };
  }, []);

  const addRandomTile = useCallback((grid: (TileType | null)[][]) => {
    const emptyCells: [number, number][] = [];
    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (!cell) emptyCells.push([i, j]);
      });
    });

    if (emptyCells.length > 0) {
      const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const newGrid = [...grid];
      newGrid[i] = [...newGrid[i]];
      newGrid[i][j] = generateNewTile();
      return newGrid;
    }
    return grid;
  }, [generateNewTile]);

  const initializeGame = useCallback(() => {
    let newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    
    setGameState({
      grid: newGrid,
      score: 0,
      gameOver: false,
      timeLeft: INITIAL_TIME,
      isPlaying: true
    });
  }, [addRandomTile]);

  const moveTiles = useCallback((grid: (TileType | null)[][], direction: 'up' | 'down' | 'left' | 'right') => {
    let newGrid = [...grid];
    let score = gameState.score;
    let moved = false;

    const rotateGrid = (grid: (TileType | null)[][], times: number) => {
      let rotated = [...grid];
      for (let i = 0; i < times; i++) {
        rotated = rotated[0].map((_, i) => rotated.map(row => row[i]).reverse());
      }
      return rotated;
    };

    // Rotate grid to handle all directions as left movement
    if (direction === 'right') newGrid = rotateGrid(newGrid, 2);
    else if (direction === 'down') newGrid = rotateGrid(newGrid, 1);
    else if (direction === 'up') newGrid = rotateGrid(newGrid, 3);

    // Move and merge tiles
    for (let i = 0; i < GRID_SIZE; i++) {
      let row: (TileType | null)[] = newGrid[i].filter(cell => cell !== null);
      for (let j = 0; j < row.length - 1; j++) {
        const currentTile = row[j];
        const nextTile = row[j + 1];
        if (currentTile && nextTile && currentTile.value === nextTile.value) {
          const newTile = {
            value: (currentTile.value * 2) as TileValue,
            id: Math.random().toString(36).substr(2, 9),
            mergedFrom: [currentTile.id, nextTile.id]
          };
          row[j] = newTile;
          score += newTile.value;
          row.splice(j + 1, 1);
          moved = true;
        }
      }
      while (row.length < GRID_SIZE) row.push(null);
      if (JSON.stringify(newGrid[i]) !== JSON.stringify(row)) moved = true;
      newGrid[i] = row;
    }

    // Rotate back
    if (direction === 'right') newGrid = rotateGrid(newGrid, 2);
    else if (direction === 'down') newGrid = rotateGrid(newGrid, 3);
    else if (direction === 'up') newGrid = rotateGrid(newGrid, 1);

    if (moved) {
      newGrid = addRandomTile(newGrid);
    }

    return { newGrid, score, moved };
  }, [gameState.score, addRandomTile]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!gameState.isPlaying) return;

    let direction: 'up' | 'down' | 'left' | 'right' | null = null;
    switch (e.key) {
      case 'ArrowUp': direction = 'up'; break;
      case 'ArrowDown': direction = 'down'; break;
      case 'ArrowLeft': direction = 'left'; break;
      case 'ArrowRight': direction = 'right'; break;
      default: return;
    }

    const { newGrid, score, moved } = moveTiles(gameState.grid, direction);
    if (moved) {
      setGameState(prev => ({
        ...prev,
        grid: newGrid,
        score
      }));
    }
  }, [gameState.grid, gameState.isPlaying, moveTiles]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      setShowNameInput(false);
      initializeGame();
    }
  };

  const handleGameOver = useCallback(() => {
    if (playerName && gameState.score > 0) {
      saveToLeaderboard({
        name: playerName,
        score: gameState.score,
        date: new Date().toISOString()
      });
    }
    setGameState(prev => ({
      ...prev,
      gameOver: true,
      isPlaying: false
    }));
  }, [playerName, gameState.score]);

  useEffect(() => {
    let timer: number;
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      timer = window.setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0) {
      handleGameOver();
    }
    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.timeLeft, handleGameOver]);

  if (showNameInput) {
    return (
      <GameContainer>
        <NameInput>
          <form onSubmit={handleNameSubmit}>
            <Input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
            />
            <Button type="submit" disabled={!playerName.trim()}>
              Start Game
            </Button>
          </form>
        </NameInput>
        <Leaderboard />
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <ScoreContainer>
        <Score>Score: {gameState.score}</Score>
        <Timer>Time: {gameState.timeLeft}s</Timer>
      </ScoreContainer>
      <Grid>
        {gameState.grid.map((row, i) =>
          row.map((cell, j) => (
            <Cell key={`${i}-${j}`}>
              {cell && (
                <TileComponent value={cell.value}>
                  <TileEmoji>{TILE_EMOJIS[cell.value]}</TileEmoji>
                  <TileValue>{cell.value}</TileValue>
                </TileComponent>
              )}
            </Cell>
          ))
        )}
      </Grid>
      {!gameState.isPlaying && (
        <Button onClick={() => {
          setShowNameInput(true);
          setPlayerName('');
        }}>
          {gameState.gameOver ? 'Play Again' : 'Start Game'}
        </Button>
      )}
      {gameState.gameOver && (
        <GameOver>
          <h2>Game Over!</h2>
          <p>Final Score: {gameState.score}</p>
        </GameOver>
      )}
      <Leaderboard />
    </GameContainer>
  );
};

export default Game; 