import { useSetAtom } from 'jotai';
import { useUploadedFile } from './use-uploaded-file';
import { fileStatusAtom } from '@/state/atoms';

const FILE_URL = './sample_dataset.csv?' + Math.random();

export const useUploadSampleFile = () => {
  const setUploadedFileStatus = useSetAtom(fileStatusAtom);

  const { processFile } = useUploadedFile();

  const uploadSampleFile = async () => {
    const startTime = performance.now();
    let frameId: number;

    setUploadedFileStatus({ status: 'downloading', progressFraction: 0 });

    // getting progress with XHR works only for the file metadata, we can fake it tho
    const update = () => {
      const elapsedTime = performance.now() - startTime;
      const progressFraction = 1 - Math.E ** (-2.5 * (elapsedTime / 1000));

      setUploadedFileStatus({ status: 'downloading', progressFraction: progressFraction });
      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);

    const response = await fetch(FILE_URL);
    const blob = await response.blob();
    const file = new File([blob], 'sample_dataset.csv');
    cancelAnimationFrame(frameId);

    return processFile(file);
  };

  return uploadSampleFile;
};
