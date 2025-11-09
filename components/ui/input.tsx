import { cn } from "@/lib/utils";
import * as React from "react";
import { TextInput, type TextInputProps } from "react-native";

export interface InputProps extends TextInputProps {
  className?: string;
}

const Input = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  InputProps
>(({ className, placeholderClassName, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      className={cn(
        "native:h-14 native:text-base h-12 rounded-lg border border-input bg-input px-4 py-3 text-base text-foreground file:border-0 file:bg-transparent file:font-medium  disabled:cursor-not-allowed disabled:opacity-50 web:flex web:w-full web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
        className,
      )}
      placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
