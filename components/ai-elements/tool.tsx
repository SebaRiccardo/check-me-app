import type { ToolUIPart } from "ai";
import {
  CheckCircle,
  ChevronDown,
  Circle,
  Clock,
  Wrench,
  XCircle,
} from "lucide-react-native";
import type { ComponentProps, ReactNode } from "react";
import { isValidElement } from "react";
import { View, ScrollView } from "react-native";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { cn } from "@/lib/utils";
import { Text } from "../ui/text";
import { Icon } from "../ui/icon";

export type ToolProps = ComponentProps<typeof Collapsible>;

export const Tool = ({ className, ...props }: ToolProps) => (
  <Collapsible
    className={cn(
      "mb-4 w-full overflow-hidden rounded-md border border-border",
      className,
    )}
    {...props}
  />
);

export type ToolHeaderProps = {
  title?: string;
  type: ToolUIPart["type"];
  state: ToolUIPart["state"];
  className?: string;
};

const getStatusInfo = (status: ToolUIPart["state"]) => {
  const labels: Partial<Record<ToolUIPart["state"] | string, string>> = {
    "input-streaming": "Pendiente",
    "input-available": "Ejecutando",
    "approval-requested": "Esperando Aprobación",
    "approval-responded": "Respondido",
    "output-available": "Completado",
    "output-error": "Error",
    "output-denied": "Denegado",
  };

  const iconConfigs: Partial<
    Record<ToolUIPart["state"] | string, { Icon: typeof Circle; color: string }>
  > = {
    "input-streaming": { Icon: Circle, color: "text-muted-foreground" },
    "input-available": { Icon: Clock, color: "text-blue-600" },
    "approval-requested": { Icon: Clock, color: "text-yellow-600" },
    "approval-responded": { Icon: CheckCircle, color: "text-blue-600" },
    "output-available": { Icon: CheckCircle, color: "text-green-600" },
    "output-error": { Icon: XCircle, color: "text-red-600" },
    "output-denied": { Icon: XCircle, color: "text-orange-600" },
  };

  return {
    label: labels[status] ?? status,
    Icon: iconConfigs[status]?.Icon ?? Circle,
    color: iconConfigs[status]?.color ?? "text-muted-foreground",
  };
};

export const ToolHeader = ({
  className,
  title,
  type,
  state,
  ...props
}: ToolHeaderProps) => {
  const statusInfo = getStatusInfo(state);

  return (
    <CollapsibleTrigger
      className={cn(
        "flex w-full flex-row items-center justify-between gap-4 p-3",
        className,
      )}
      {...props}
    >
      <View className="flex-1 flex-row items-center gap-2">
        <Icon as={Wrench} size={16} className="text-muted-foreground" />
        <Text className="flex-1 text-sm font-medium">
          {title ?? type.split("-").slice(1).join("-")}
        </Text>
        <View className="flex-row items-center gap-1.5 rounded-full bg-muted/20 px-2 py-1">
          <Icon as={statusInfo.Icon} size={14} className={statusInfo.color} />
          <Text className="text-xs">{statusInfo.label}</Text>
        </View>
      </View>
      <Icon as={ChevronDown} size={16} className="text-muted-foreground" />
    </CollapsibleTrigger>
  );
};

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>;

export const ToolContent = ({ className, ...props }: ToolContentProps) => (
  <CollapsibleContent
    className={cn("border-t border-border", className)}
    {...props}
  />
);

export type ToolInputProps = Omit<ComponentProps<typeof View>, "children"> & {
  input: ToolUIPart["input"];
};

export const ToolInput = ({ className, input, ...props }: ToolInputProps) => (
  <View className={cn("gap-2 p-4", className)} {...props}>
    <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
      Parámetros
    </Text>
    <ScrollView
      horizontal
      className="overflow-hidden rounded-md bg-muted/50 p-3"
    >
      <Text className="font-mono text-xs text-foreground">
        {JSON.stringify(input, null, 2)}
      </Text>
    </ScrollView>
  </View>
);

export type ToolOutputProps = Omit<ComponentProps<typeof View>, "children"> & {
  output: ToolUIPart["output"];
  errorText?: ToolUIPart["errorText"];
};

export const ToolOutput = ({
  className,
  output,
  errorText,
  ...props
}: ToolOutputProps) => {
  if (!(output || errorText)) {
    return null;
  }

  let OutputComponent: ReactNode = null;

  if (
    typeof output === "object" &&
    !isValidElement(output) &&
    output !== null
  ) {
    OutputComponent = (
      <ScrollView horizontal className="p-3">
        <Text className="font-mono text-xs text-foreground">
          {JSON.stringify(output, null, 2)}
        </Text>
      </ScrollView>
    );
  } else if (typeof output === "string") {
    OutputComponent = (
      <ScrollView horizontal className="p-3">
        <Text className="font-mono text-xs text-foreground">{output}</Text>
      </ScrollView>
    );
  } else {
    OutputComponent = (
      <View className="p-3">
        <Text className="text-sm">{String(output)}</Text>
      </View>
    );
  }

  return (
    <View className={cn("gap-2 p-4", className)} {...props}>
      <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {errorText ? "Error" : "Resultado"}
      </Text>
      <View
        className={cn(
          "overflow-hidden rounded-md",
          errorText ? "bg-destructive/10" : "bg-muted/50",
        )}
      >
        {errorText ? (
          <View className="p-3">
            <Text className="text-sm text-destructive">{errorText}</Text>
          </View>
        ) : (
          OutputComponent
        )}
      </View>
    </View>
  );
};
