export type Settings = {
  playbackRate: number;
  feedDirection: number;
};

export function makeSettings(): Settings {
  return {
    playbackRate: 1,
    feedDirection: 1,
  };
}
