import type { ReactNode } from "react";
import type { TextInputProps } from "react-native";
import { TextInput, View } from "react-native";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PromptInputMessage {
  text?: string;
}

interface PromptInputProps {
  children: ReactNode;
  className?: string;
}

export function PromptInput({ children, className }: PromptInputProps) {
  return <View className={cn("w-full p-4", className)}>{children}</View>;
}

interface PromptInputSectionProps {
  children: ReactNode;
  className?: string;
}

export function PromptInputHeader({
  children,
  className,
}: PromptInputSectionProps) {
  if (!children) return null;
  return <View className={cn("mb-3", className)}>{children}</View>;
}

export function PromptInputBody({
  children,
  className,
}: PromptInputSectionProps) {
  return <View className={cn("mb-3", className)}>{children}</View>;
}

export function PromptInputFooter({
  children,
  className,
}: PromptInputSectionProps) {
  return (
    <View className={cn("flex-row items-center justify-between", className)}>
      {children}
    </View>
  );
}

export function PromptInputTools({
  children,
  className,
}: PromptInputSectionProps) {
  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      {children}
    </View>
  );
}

interface PromptInputTextareaProps extends TextInputProps {
  className?: string;
}

export function PromptInputTextarea({
  className,
  ...props
}: PromptInputTextareaProps) {
  return (
    <TextInput
      multiline
      placeholderTextColor="rgba(148, 163, 184, 0.9)"
      className={cn(
        "min-h-[56px] flex-1 rounded-2xl border-2 border-border bg-background px-4 py-3 text-base text-foreground",
        className,
      )}
      {...props}
    />
  );
}

interface PromptInputSubmitProps extends ButtonProps {
  status?: "ready" | "streaming" | "submitted" | "idle";
}

export function PromptInputSubmit({
  status = "idle",
  children,
  ...props
}: PromptInputSubmitProps) {
  const label =
    children ??
    {
      idle: "Enviar",
      ready: "Enviar",
      submitted: "Enviando...",
      streaming: "Enviando...",
    }[status];

  return (
    <Button size="sm" className="rounded-full px-6" {...props}>
      {label}
    </Button>
  );
}

interface PromptInputButtonProps extends ButtonProps {
  active?: boolean;
}

export function PromptInputButton({
  active = false,
  className,
  ...props
}: PromptInputButtonProps) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      className={cn("rounded-full", className)}
      {...props}
    />
  );
}
