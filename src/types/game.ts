export type TileValue = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024;

export interface Tile {
  value: TileValue;
  id: string;
  mergedFrom?: string[];
}

export interface GameState {
  grid: (Tile | null)[][];
  score: number;
  gameOver: boolean;
  timeLeft: number;
  isPlaying: boolean;
}

export const TILE_EMOJIS: Record<TileValue, string> = {
  2: '🌿',
  4: '🪴',
  8: '💡',
  16: '🚲',
  32: '🌞',
  64: '🌬️',
  128: '🌊',
  256: '🏙️',
  512: '🌍',
  1024: '🛸'
};

export const TILE_NAMES: Record<TileValue, string> = {
  2: 'Compost Bin',
  4: 'Urban Garden',
  8: 'LED Lightbulb',
  16: 'Bike Share Program',
  32: 'Rooftop Solar',
  64: 'Wind Turbine',
  128: 'Tidal Energy',
  256: 'Green Smart City',
  512: 'Planet in Balance',
  1024: 'Utopian Eco Future'
}; 