import { useSetAtom } from 'jotai';
import { useUploadedFile } from './use-uploaded-file';
import { fileStatusAtom } from '@/state/atoms';

const FILE_URL =
  'https://gist.githubusercontent.com/Aliath/d25ee989090b9c51d50e535d38f97152/raw/e591acd34c13d2d9099c321db8b6b11753b376c6/sample-data.csv';

export const useUploadSampleFile = () => {
  const setUploadedFileStatus = useSetAtom(fileStatusAtom);

  const { processFile } = useUploadedFile();

  const uploadSampleFile = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', FILE_URL, true);
    xhr.responseType = 'blob';

    xhr.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progressFraction = (event.loaded / event.total) * 100;
        setUploadedFileStatus({ status: 'downloading', progressFraction });
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const file = new File([xhr.response], 'sample_dataset.csv');
        processFile(file);
      } else {
        alert('Could not download file');
      }
    });

    xhr.addEventListener('error', () => {
      alert('Coult not download file');
    });

    xhr.send();
  };

  return uploadSampleFile;
};
