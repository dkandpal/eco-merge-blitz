export interface ScoreEntry {
  name: string;
  score: number;
  date: string;
}

export const MAX_LEADERBOARD_ENTRIES = 10;

export const getLeaderboard = (): ScoreEntry[] => {
  const stored = localStorage.getItem('ecoMergeLeaderboard');
  return stored ? JSON.parse(stored) : [];
};

export const saveToLeaderboard = (entry: ScoreEntry): ScoreEntry[] => {
  const leaderboard = getLeaderboard();
  leaderboard.push(entry);
  leaderboard.sort((a, b) => b.score - a.score);
  const topScores = leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES);
  localStorage.setItem('ecoMergeLeaderboard', JSON.stringify(topScores));
  return topScores;
}; 