const MAX_RECORDS = 100_000_000;
const ONE_MB = 1024 * 1024;

const scheduleAsyncExecution = (fn: () => void) => {
  requestAnimationFrame(fn);
};

const parseCsvLines = (content: string, result: Float64Array, pointerIndex: number) => {
  const splittedContent = content.split('\n');
  let updatedPointer = pointerIndex;

  let lastX: number | null = null;

  for (const line of splittedContent) {
    const [x, y] = line.split(',');

    const numericX = +x;
    const numericY = +y;

    result[++updatedPointer] = numericX;
    result[++updatedPointer] = numericY;

    if (lastX !== null && lastX >= numericX) {
      alert('expected an ordered csv file : - (');
    }

    lastX = numericX;
  }

  return updatedPointer;
};

/**
 * Reads a CSV file asynchronously in chunks and processes it.
 * The function calls the provided `onProgress` callback after each chunk is processed,
 * passing the current progress as a fraction (0 to 1).
 * This allows for tracking the progress of the file reading process.
 */
export const readCsvFile = (file: File, onProgress: (progressFraction: number) => void) => {
  const CHUNK_SIZE = ONE_MB;

  return new Promise<Float64Array>((resolve, reject) => {
    const result = new Float64Array(MAX_RECORDS * 2);
    let totalContent = '';
    let totalBytesRead = 0;
    let lastPointerIndex = -1;

    const readNextChunk = () => {
      const slicedFile = file.slice(totalBytesRead, totalBytesRead + CHUNK_SIZE);

      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        if (typeof fileReader.result !== 'string') {
          reject(new Error('expected a string here'));
          return;
        }

        totalContent += fileReader.result;
        totalBytesRead += fileReader.result.length;

        const endIndex = totalContent.lastIndexOf('\n');
        const contentToProcess = totalContent.slice(0, endIndex).trim();
        lastPointerIndex = parseCsvLines(contentToProcess, result, lastPointerIndex);

        totalContent = totalContent.slice(endIndex);

        onProgress(Math.min(1, totalBytesRead / file.size));

        if (totalBytesRead >= file.size) {
          scheduleAsyncExecution(() => resolve(result.slice(0, lastPointerIndex + 1)));
        } else {
          scheduleAsyncExecution(readNextChunk);
        }
      });

      fileReader.readAsText(slicedFile);
    };

    scheduleAsyncExecution(readNextChunk);
  });
};
