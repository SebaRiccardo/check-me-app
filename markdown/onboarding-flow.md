OnboardingProps
introPanel
Type: OnboardingIntroPanel
Required - The welcome screen that users see at the start of the onboarding

The intro panel can be either:

Default panel: Pass an object with title, subtitle, button, image
Custom component: Pass a render function that receives onPressStart callback
// Default intro panel
introPanel={{
  title: "Welcome to MyApp",
  subtitle: "Let's get you started",
  button: "Get Started",
  image: require('./assets/welcome.png')
}}

// Custom intro panel
introPanel={({ onPressStart }) => (
  <CustomWelcomeScreen onStart={onPressStart} />
)}


Each step can be either a default text-based step or a fully custom component:

// Default step
{
  label: "Step 1",
  title: "Connect Your Account",
  description: "Link your account to get started",
  buttonLabel: "Connect",
  image: require('./assets/step1.png'),
  position: 'top'
}

// Custom step component
{
  component: ({ onNext, onBack, isLast }) => (
    <CustomStepComponent 
      onNext={onNext} 
      onBack={onBack} 
      isLast={isLast} 
      ... other props ...
    />
  ),
  image: require('./assets/step2.png'),
  position: 'bottom'
}
onComplete
Type: () => void
Required - Callback fired when user completes the final step, usually used to save the completion state to the local storage and navigate to the main app.

onComplete={() => {
  // Navigate to main app
  navigation.navigate('Home');
  // Or save completion state
  AsyncStorage.setItem('onboarding_completed', 'true');
}}
onSkip
Type: () => void
Optional - Callback fired when user skips onboarding, usually used to track the skip event and navigate away from the onboarding.

onSkip={() => {
  // Track skip event
  analytics.track('onboarding_skipped');
  // Navigate away
  navigation.goBack();
}}
onStepChange
Type: (stepIndex: number) => void
Default: undefined - Callback fired when the active step changes

onStepChange={(stepIndex) => {
  // Track progress
  analytics.track('onboarding_step', { step: stepIndex });
}}
showCloseButton
Type: boolean
Default: true - Whether to show the close button in the header

showCloseButton={false} // Hide close button
showBackButton
Type: boolean
Default: true - Whether to show back button on steps (except first step)

showBackButton={false} // Disable back navigation

wrapInModalOnWeb
Type: boolean
Default: true - Whether to wrap the onboarding in a modal on web

wrapInModalOnWeb={false} // Disable modal wrapping
animationDuration
Type: number
Default: 500 - Animation duration in milliseconds for step transitions

animationDuration={300} // Faster animations
animationDuration={800} // Slower if app is for seniors 👴🏽👵🏼
colors
Type: OnboardingColors
Default:

colors={{
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    label: '#E9ECEF',
    accent: '#007AFF'
  },
  text: {
    primary: '#1C1C1E',
    secondary: '#8E8E93',
    contrast: '#FFFFFF'
  }
}}
fonts
Type: OnboardingFonts | string
Default: 'System' - Custom font configuration

// Single font for all text
fonts="Inter"

// Detailed font configuration
fonts={{
  introTitle: 'Inter-Bold',
  introSubtitle: 'Inter-Medium',
  stepTitle: 'Inter-SemiBold',
  stepDescription: 'Inter-Regular',
  primaryButton: 'Inter-Medium'
}}
background
Type: () => ReactNode
Default: undefined - Custom background element rendered behind content

background={() => (
  <Image 
    source={require('./assets/background.png')} 
    style={StyleSheet.absoluteFillObject}
  />
)}
skipButton
Type: ({ onPress }: { onPress: () => void }) => ReactNode
Default: X icon - Custom close button renderer

Skip Button

skipButton={({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.customClose}>✕</Text>
  </TouchableOpacity>
)}
💡 Best Practices
Image Consistency
Use images with the same dimensions for the best visual effect. This prevents layout shifts and creates smooth transitions between steps.

Image creator: Use this Figma Community template to design consistent onboarding illustrations and export assets with the recommended dimensions.

Persistent Storage
Save onboarding completion state to persistent storage (MMKV, AsyncStorage) to prevent users from seeing the onboarding again after completion.

Navigation
On completion, navigate users to the main app to provide a smooth transition from onboarding to the core experience.