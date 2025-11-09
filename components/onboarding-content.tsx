import { Redirect, router } from "expo-router";
import { useState } from "react";
import { Image, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, X } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ONBOARDING_COMPLETED_KEY,
  useOnboarding,
} from "@/hooks/use-onboarding";
import { useAuth } from "@/hooks/use-auth-context";

// Onboarding steps
const onboardingSteps = [
  {
    id: 1,
    image: require("../assets/images/wordmark.png"),
    title: "Bienvenido a checkme",
    subtitle: "Tu aliado en la verificación de información",
  },
  {
    id: 2,
    image: require("../assets/images/onboarding/onboarding-1.png"),
    title: "Las noticias pueden ser confusas",
    subtitle:
      "En un mundo lleno de información, no siempre es fácil distinguir qué es real y qué no. Por eso existimos.",
  },
  {
    id: 3,
    image: require("../assets/images/onboarding/onboarding-2.png"),
    title: "Vos sos parte de la solución",
    subtitle:
      "Compartí tus verificaciones y ayudanos a construir una comunidad más informada.",
  },
  {
    id: 4,
    image: require("../assets/images/onboarding/onboarding-3.png"),
    title: "Verificamos cada detalle",
    subtitle:
      "Nuestro equipo de expertos y tecnología de IA revisan minuciosamente cada verificación antes de publicarla.",
  },
  {
    id: 5,
    image: require("../assets/images/onboarding/onboarding-4.png"),
    title: "Tu aporte suma",
    subtitle:
      "Una vez verificada, tu contribución estará disponible para que toda la comunidad pueda acceder a información confiable.",
  },
  {
    id: 6,
    image: require("../assets/images/onboarding/onboarding-5.png"),
    title: "¡Empecemos juntos!",
    subtitle:
      "Unite a una comunidad comprometida con la verdad y empezá a verificar noticias hoy mismo.",
  },
];

export default function OnboardingContent() {
  const {session} =useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const insets = useSafeAreaInsets();
  const isLastStep = currentStep === onboardingSteps.length - 1;
  const step = onboardingSteps[currentStep];

  const navigateToRoute = ()=>{
    //@ts-ignore
    router.replace(session?.user ? "(tabs)" : "/welcome");
  }

  const handleComplete = async () => {
    try {
  
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
      
      navigateToRoute()
    } catch (error) {   
      console.error("Error saving onboarding state:", error);
     navigateToRoute()
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
     navigateToRoute()
    } catch (error) {
     console.error("Error saving onboarding state:", error);
     navigateToRoute()
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleSkip}>
        <Icon as={X} size={24} className="text-gray-600" />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        {/* Image */}
        {step.id === 1 ? (
          <View className="mb-5">
            <Image
              source={step.image}
              className="w-96 h-20"
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image
              source={step.image}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Title */}
        {!!(step.id > 1) && <Text style={styles.title}>{step.title}</Text>}

        {/* Subtitle */}
        <Text style={styles.subtitle}>{step.subtitle}</Text>
      </View>

      {/* Bottom Section */}
      <View
        style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}
      >
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              className={cn(
                "h-2 rounded-md transition-all duration-200",
                index === currentStep ? "w-6 bg-primary" : "w-2 bg-muted",
              )}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {currentStep > 0 && (
            <Button
              variant="outline"
              size="lg"
              onPress={handleBack}
              className=" h-14"
            >
              <Text>
                <ArrowLeft size={15} />
              </Text>
            </Button>
          )}

          <Button
            variant="default"
            size="lg"
            onPress={handleNext}
            className={currentStep === 0 ? "flex-1 h-14" : "flex-[2] h-14"}
          >
            <Text className="text-white font-bold text-base">
              {isLastStep ? "Finalizar" : "Continuar"}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  imageContainer: {
    marginBottom: 40,
  },
  image: {
    width: 280,
    height: 280,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#8E8E93",
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    //backgroundColor: "#E9ECEF",
  },
  activeDot: {
    //backgroundColor: "#007AFF",
    width: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    borderRadius: "100%",
    gap: 12,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  continueButton: {
    flex: 2,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  fullWidth: {
    flex: 1,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

