import { ComponentProps, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface LabeledInputProps extends Omit<ComponentProps<typeof Input>, 'value' | 'onChange'> {
  prefix: string;
  tooltip: string;
  value: number;
  onChange: (value: number) => void;
}

/**
 * Handling numbers and input elements is a total headache.
 * This component only triggers `onChange` when the number is valid
 * and meets all requirements (like min, max, etc.).
 */
export function LabeledInput({ prefix, tooltip, onChange, ...props }: LabeledInputProps) {
  const [value, setValue] = useState(`${props.value}`);

  useEffect(() => {
    setValue(`${props.value}`);
  }, [props.value]);

  const isNumberValid = (value: string) => {
    if (!value) {
      return false;
    }

    const isNumericValue = !Number.isNaN(+value);

    if (!isNumericValue) {
      return false;
    }

    const valueAsNumber = +value;

    if (props.max && valueAsNumber > +props.max) {
      return false;
    }

    if (props.min && valueAsNumber < +props.min) {
      return false;
    }

    return true;
  };

  return (
    <div className="flex items-stretch relative rounded-md overflow-hidden">
      <Tooltip>
        <TooltipTrigger>
          <div
            className={cn(
              'bg-neutral-800 text-white absolute left-0 top-0 h-full px-3 flex items-center justify-center font-medium w-9 text-center',
              props.disabled && 'opacity-50'
            )}
          >
            {prefix}
          </div>
        </TooltipTrigger>
        <TooltipContent align="start" className="bg-black/80">
          {tooltip}
        </TooltipContent>
      </Tooltip>
      <Input
        {...props}
        value={value}
        onChange={(event) => {
          const value = event.target.value;

          if (isNumberValid(value)) {
            onChange(+value);
          }

          setValue(value);
        }}
        className={cn(props.className, 'pl-10 flex-auto text-right', !isNumberValid(value) && 'border-red-600')}
      />
    </div>
  );
}
