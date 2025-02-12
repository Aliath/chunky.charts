import { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function HeaderCard(props: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn('p-3 rounded-md bg-white border border-input flex items-center gap-2', props.className)}
    />
  );
}
