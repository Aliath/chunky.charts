import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { increaseIntervalAtom, increaseValueAtom, isPlayingAtom } from '@/state/atoms';

export const usePlayerOperations = () => {
  const [playing, setPlaying] = useAtom(isPlayingAtom);
  const [increaseValue, setIncreaseValue] = useAtom(increaseValueAtom);
  const [increaseInterval, setIncreaseInterval] = useAtom(increaseIntervalAtom);

  const toggle = useCallback(() => {
    setPlaying(!playing);
  }, [playing, setPlaying]);

  return {
    playing,
    toggle,
    increaseInterval,
    increaseValue,
    onIncreaseIntervalChange: setIncreaseInterval,
    onIncreaseValueChange: setIncreaseValue,
  };
};
