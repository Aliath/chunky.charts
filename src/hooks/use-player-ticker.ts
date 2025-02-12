import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import {
  fileStatusAtom,
  increaseIntervalAtom,
  increaseValueAtom,
  isPlayingAtom,
  leftEdgeIndexAtom,
} from '@/state/atoms';

export const usePlayerTicker = () => {
  const [playing] = useAtom(isPlayingAtom);
  const setLeftEdgeIndex = useSetAtom(leftEdgeIndexAtom);
  const [increaseValue] = useAtom(increaseValueAtom);
  const [increaseInterval] = useAtom(increaseIntervalAtom);
  const [uploadedFileStatus] = useAtom(fileStatusAtom);

  if (uploadedFileStatus.status !== 'loaded') {
    throw new Error('expected loaded data');
  }

  const maxLeftIndex = uploadedFileStatus.data.length / 2 - 1;
  const minLeftIndex = 0;

  useEffect(() => {
    if (!playing) {
      return;
    }

    const timerId = setInterval(() => {
      setLeftEdgeIndex((currentValue) => Math.max(minLeftIndex, Math.min(maxLeftIndex, currentValue + increaseValue)));
    }, increaseInterval);

    return () => {
      clearInterval(timerId);
    };
  }, [increaseInterval, increaseValue, maxLeftIndex, playing, setLeftEdgeIndex]);
};
