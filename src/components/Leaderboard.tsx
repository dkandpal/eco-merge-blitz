import React from 'react';
import styled from 'styled-components';
import { getLeaderboard } from '../types/leaderboard';

const LeaderboardContainer = styled.div`
  background-color: #bbada0;
  padding: 20px;
  border-radius: 6px;
  margin-top: 20px;
  width: 100%;
  max-width: 440px;
`;

const Title = styled.h2`
  color: white;
  margin: 0 0 15px 0;
  text-align: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: white;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 8px;
  border-bottom: 2px solid white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const TableCell = styled.td`
  padding: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const DateCell = styled(TableCell)`
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.8);
`;

const Leaderboard: React.FC = () => {
  const scores = getLeaderboard();

  return (
    <LeaderboardContainer>
      <Title>Top Scores</Title>
      <Table>
        <thead>
          <tr>
            <TableHeader>Rank</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Score</TableHeader>
            <TableHeader>Date</TableHeader>
          </tr>
        </thead>
        <tbody>
          {scores.map((entry, index) => (
            <TableRow key={`${entry.name}-${entry.date}`}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{entry.name}</TableCell>
              <TableCell>{entry.score}</TableCell>
              <DateCell>{new Date(entry.date).toLocaleDateString()}</DateCell>
            </TableRow>
          ))}
          {scores.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                No scores yet. Be the first to play!
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </Table>
    </LeaderboardContainer>
  );
};

export default Leaderboard; 