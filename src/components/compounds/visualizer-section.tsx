import { FlaskConical, Upload } from 'lucide-react';
import { DataChart } from '@/components/compounds/data-chart';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUploadSampleFile } from '@/hooks/use-upload-sample-file';
import { useUploadedFile } from '@/hooks/use-uploaded-file';

export function VisualizerSection() {
  const { uploadFile, uploadedFileStatus } = useUploadedFile();
  const uploadSampleFile = useUploadSampleFile();

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
          <Button variant="outline" onClick={uploadSampleFile}>
            <FlaskConical /> Use Sample File [256mb]
          </Button>
        </div>
      )}

      {(uploadedFileStatus.status === 'downloading' || uploadedFileStatus.status === 'reading') && (
        <div className="flex flex-auto items-center justify-center flex-col gap-4 text-sm text-neutral-500 capitalize">
          <Progress className="max-w-[200px]" value={uploadedFileStatus.progressFraction * 100} />
          {uploadedFileStatus.status} ({Math.round(uploadedFileStatus.progressFraction * 100)}%)...
        </div>
      )}

      {uploadedFileStatus.status === 'loaded' && <DataChart />}
    </div>
  );
}
