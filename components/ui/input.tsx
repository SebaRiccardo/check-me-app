import { cn } from '@/lib/utils';
import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

export interface InputProps extends TextInputProps {
  className?: string;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, placeholderClassName, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          'web:flex h-12 native:h-14 web:w-full rounded-lg border border-input bg-input px-4 py-3 text-base native:text-base text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
