import { HeaderCard } from '@/components/compounds/header-card';
import { useUploadedFile } from '@/hooks/use-uploaded-file';
import { cn } from '@/lib/utils';

export function FileSection() {
  const { file } = useUploadedFile();

  return (
    <HeaderCard className="flex items-center justify-between gap-4">
      <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
        File: <span className={cn('font-medium', !file && 'text-neutral-700')}>{file?.name || 'N/A'}</span>
      </div>
    </HeaderCard>
  );
}
