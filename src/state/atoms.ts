// for the sake of this app, I think it's easier to just create a single file containing
// all the atomic states rather than multiple ones with a line of code each

import { atom } from 'jotai';

const DEFAULT_WINDOW_SIZE = 10_000;
const DEFAULT_LEFT_EDGE_INDEX = 0;
const DEFAULT_INCREASE_INTERVAL = 16;
const DEFAULT_INCREASE_VALUE = 100;
const DEFAULT_IS_PLAYING = false;

export const windowSizeAtom = atom(DEFAULT_WINDOW_SIZE);
export const leftEdgeIndexAtom = atom(DEFAULT_LEFT_EDGE_INDEX);
export const increaseIntervalAtom = atom(DEFAULT_INCREASE_INTERVAL);
export const increaseValueAtom = atom(DEFAULT_INCREASE_VALUE);
export const isPlayingAtom = atom(DEFAULT_IS_PLAYING);
export const fileStatusAtom = atom<
  | { status: 'idle' }
  | { status: 'generating'; progressFraction: number }
  | { status: 'reading'; file: File; progressFraction: number }
  | { status: 'loaded'; file: File; data: Float64Array }
>({ status: 'idle' });
