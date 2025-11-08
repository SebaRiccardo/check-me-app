import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type VerificationStepProps = {
  number: number;
  title: string;
  description: string;
};

function VerificationStep({
  number,
  title,
  description,
}: VerificationStepProps) {
  return (
    <View className="mb-2">
      <View className="flex-row items-start">
        {/* Number Badge */}
        <View className="mr-4 mt-1 size-6 items-center justify-center rounded-full bg-primary">
          <Text className="text-base font-bold text-white">{number}</Text>
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text className="mb-2 text-base font-bold uppercase text-primary">
            {title}
          </Text>
          <Text className="text-sm leading-6 text-foreground">
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function VerifyScreen() {
  const insets = useSafeAreaInsets();

  const verificationSteps = [
    {
      number: 1,
      title: "Lee más allá del titular",
      description:
        "No compartas contenido que solo abre el titular. Muchos titulares están diseñados para generar impacto, presentan una información distinto o incompleto.",
    },
    {
      number: 2,
      title: "Revisa la fuente original",
      description:
        "Pregúntate: ¿quién lo publicó? Busca el medio, autor o sitio web. Si es una página desconocida o que genera desconfianza. Prefiere medios reconocidos o agencias de verificación.",
    },
    {
      number: 3,
      title: "Contrasta con otras fuentes",
      description:
        "Verifica si la misma noticia aparece en varios medios confiables. Si nadie más la menciona, o si la información varía mucho entre fuentes, genera dudas únicos",
    },
    {
      number: 4,
      title: "Analiza la fecha y las imágenes",
      description:
        "Muchas noticias falsas reutilizan fotos o titulares de hechos antiguos. Usa herramientas de búsqueda inversa (ej. Google Imágenes) para comprobar si la imagen es de otro contexto o evento.",
    },
  ];

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pb-0" style={{ paddingTop: insets.top + 16 }}>
        <Text className="text-3xl font-bold text-foreground">Guía Rápida</Text>
        <Text className="mt-1 text-base text-muted-foreground">
          ¿Cómo verificar una noticia?
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View className="px-6">
          {/* Verification Steps */}
          {verificationSteps.map((step) => (
            <VerificationStep
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}

          {/* Additional Tips */}
          <Card className="mt-4 bg-muted">
            <CardContent className="p-4">
              <Text className="mb-2 text-sm font-semibold text-foreground">
                💡 Consejo Extra
              </Text>
              <Text className="text-sm leading-6 text-muted-foreground">
                Si tienes dudas sobre una noticia, no la compartas. Es mejor
                tomarse un momento para verificar que contribuir a la
                desinformación.
              </Text>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
