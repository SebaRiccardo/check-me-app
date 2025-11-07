import { cn } from '@/lib/utils';
import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

export interface TextAreaProps extends TextInputProps {
  className?: string;
}

const TextArea = React.forwardRef<React.ElementRef<typeof TextInput>, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        className={cn(
          'web:flex min-h-[100px] w-full rounded-lg border border-input bg-input px-4 py-3 text-base text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);

TextArea.displayName = 'TextArea';

export { TextArea };
