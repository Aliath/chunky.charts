import { FlaskConical, Upload } from 'lucide-react';
import { DataChart } from '@/components/compounds/data-chart';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SAMPLE_FILE_SIZE_IN_MB, useGenerateSampleFile } from '@/hooks/use-generate-sample-file';
import { useUploadedFile } from '@/hooks/use-uploaded-file';

export function VisualizerSection() {
  const { uploadFile, uploadedFileStatus } = useUploadedFile();
  const generateSampleFile = useGenerateSampleFile();

  return (
    <div className="h-[max(400px,60vh)] bg-white rounded-md border border-input overflow-hidden p-4 flex flex-col">
      {uploadedFileStatus.status === 'idle' && (
        <div className="flex flex-auto items-center justify-center flex-col gap-4">
          <div className="text-sm text-neutral-500 mb-8">
            Upload your file to check out the chart with your data! 🚀
          </div>
          <Button onClick={uploadFile}>
            <Upload /> Upload
          </Button>
          <div className="w-[30%] flex text-neutral-500 text-sm items-center gap-2 my-2 before:h-px before:flex-1 before:bg-neutral-200 after:h-px after:flex-1 after:bg-neutral-200">
            OR
          </div>
          <Button variant="outline" onClick={generateSampleFile}>
            <FlaskConical /> Generate Sample File [{SAMPLE_FILE_SIZE_IN_MB}mb]
          </Button>
        </div>
      )}

      {(uploadedFileStatus.status === 'generating' || uploadedFileStatus.status === 'reading') &&
        (() => {
          // not a IIFE fan while rendering components, but needed to quickly tweak it, duh
          const progressValue = uploadedFileStatus.progressFraction;

          return (
            <div className="flex flex-auto items-center justify-center flex-col gap-4 text-sm text-neutral-500 capitalize">
              <Progress className="max-w-[200px]" value={progressValue * 100} />
              {uploadedFileStatus.status} ({Math.round(progressValue * 100)}%)...
            </div>
          );
        })()}

      {uploadedFileStatus.status === 'loaded' && <DataChart />}
    </div>
  );
}
