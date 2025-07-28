import { useSetAtom } from 'jotai';
import { fileStatusAtom } from '@/state/atoms';

export const SAMPLE_FILE_SIZE_IN_MB = 100;
const ROWS_PER_MB = 38363;
const RECORDS_PER_CHUNK = 50_000;

export const useGenerateSampleFile = () => {
  const setUploadedFileStatus = useSetAtom(fileStatusAtom);

  const generateSampleFile = async () => {
    let nextIndex = 0;

    setUploadedFileStatus({ status: 'generating', progressFraction: 0 });
    const itemsToGenerate = ROWS_PER_MB * SAMPLE_FILE_SIZE_IN_MB;
    const data = new Float64Array(itemsToGenerate);

    const generateChunk = () => {
      for (let index = 0; index < RECORDS_PER_CHUNK && nextIndex < itemsToGenerate; index++) {
        const randomValue = -0.1 + Math.random() * 0.2;
        data[nextIndex * 2] = nextIndex;
        // generate 4 sine waves with random noise
        data[nextIndex * 2 + 1] = Math.sin((nextIndex / itemsToGenerate) * 4 * Math.PI * 4) + randomValue;
        nextIndex += 1;
      }

      setUploadedFileStatus({
        status: 'generating',
        progressFraction: nextIndex / itemsToGenerate,
      });

      if (nextIndex < itemsToGenerate) {
        requestAnimationFrame(generateChunk);
      } else {
        setUploadedFileStatus({ status: 'loaded', file: new File([], 'generated_sample.csv'), data });
      }
    };

    requestAnimationFrame(generateChunk);
  };

  return generateSampleFile;
};
