import { useAtom } from 'jotai';
import { leftEdgeIndexAtom, windowSizeAtom } from '@/state/atoms';

export const useChartSettings = () => {
  const [windowSize, setWindowSize] = useAtom(windowSizeAtom);
  const [leftEdgeIndex, setLeftEdgeIndex] = useAtom(leftEdgeIndexAtom);

  return { windowSize, leftEdgeIndex, onWindowSizeChange: setWindowSize, onLeftEdgeIndexChange: setLeftEdgeIndex };
};
