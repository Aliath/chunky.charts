import { useAtom, useSetAtom } from 'jotai';
import { readCsvFile } from '@/lib/csv-utils';
import { clearBucketCache } from '@/lib/downsampling';
import { fileStatusAtom, windowSizeAtom } from '@/state/atoms';

export const useUploadedFile = () => {
  const [uploadedFileStatus, setUploadedFileStatus] = useAtom(fileStatusAtom);
  const setWindowSize = useSetAtom(windowSizeAtom);

  const processFile = async (file: File | null) => {
    if (!file) {
      setUploadedFileStatus({ status: 'idle' });
      return;
    }

    setUploadedFileStatus({ status: 'reading', progressFraction: 0, file: file });

    const data = await readCsvFile(file, (progressFraction) => {
      setUploadedFileStatus({ status: 'reading', progressFraction, file: file });
    });

    setUploadedFileStatus({ status: 'loaded', file: file, data });
    setWindowSize((previousValue) => Math.min(previousValue, data.length / 2));
  };

  const uploadFile = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';

    fileInput.addEventListener('change', () => {
      clearBucketCache();
      const uploadedFile = fileInput.files?.item(0) || null;

      processFile(uploadedFile);
    });

    fileInput.click();
  };

  const file = 'file' in uploadedFileStatus ? uploadedFileStatus.file : null;
  const isDataReady = uploadedFileStatus.status === 'loaded';
  const totalRecords = uploadedFileStatus.status === 'loaded' ? uploadedFileStatus.data.length / 2 : 0;

  return { file, uploadFile, processFile, uploadedFileStatus, isDataReady, totalRecords };
};
