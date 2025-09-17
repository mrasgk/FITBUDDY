import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts, PrimaryColor } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { authService, emailService } from '../service';

const { width } = Dimensions.get('window');

export default function EmailConfirmationPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState('user@example.com'); // This would come from navigation params or auth state
  const inputRefs = useRef<TextInput[]>([]);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const codeContainerAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(codeContainerAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Get email from auth service
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setEmail(currentUser.email);
    }

    // Start countdown timer
    startTimer();
  }, []);

  const startTimer = () => {
    setCanResend(false);
    setTimer(60);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...verificationCode];
    newCode[index] = text;
    setVerificationCode(newCode);

    // Auto focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto verify when all digits are entered
    if (text && index === 5 && newCode.every(digit => digit !== '')) {
      handleVerifyCode();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    animateButtonPress();
    
    const code = verificationCode.join('');
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit verification code');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await emailService.verifyEmail(email, code);
      
      if (response.success) {
        // Auto-navigate to home after successful verification
        setTimeout(() => {
          router.replace('/(tabs)' as any);
        }, 1500);
        
        Alert.alert(
          'Success!',
          'Your email has been verified successfully!'
        );
      } else {
        Alert.alert('Error', response.message || 'Invalid verification code. Please try again.');
        // Clear the code on error
        setVerificationCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Email verification error:', error);
      Alert.alert('Error', 'Failed to verify email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsResending(true);
    
    try {
      const response = await emailService.resendVerificationCode(email);
      
      if (response.success) {
        Alert.alert('Success', 'A new verification code has been sent to your email.');
        setVerificationCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        startTimer();
      } else {
        Alert.alert('Error', response.message || 'Failed to resend verification code. Please try again.');
      }
    } catch (error) {
      console.error('Resend code error:', error);
      Alert.alert('Error', 'Failed to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeEmail = () => {
    Alert.alert(
      'Change Email',
      'To change your email address, please go back to the signup page.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Go Back', onPress: () => router.back() }
      ]
    );
  };

  const handleBackToSignup = () => {
    router.back();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToSignup}
            activeOpacity={0.7}
          >
            <IconSymbol
              name="chevron.left"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>

          <View style={styles.backgroundDecoration}>
            <View style={[styles.decorativeCircle, styles.circle1, { backgroundColor: `${PrimaryColor}20` }]} />
            <View style={[styles.decorativeCircle, styles.circle2, { backgroundColor: `${PrimaryColor}15` }]} />
            <View style={[styles.decorativeCircle, styles.circle3, { backgroundColor: `${PrimaryColor}10` }]} />
          </View>
          
          <View style={[styles.headerIconContainer, { backgroundColor: `${PrimaryColor}20` }]}>
            <IconSymbol
              name="envelope.circle.fill"
              size={60}
              color={PrimaryColor}
            />
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>
            Verify Your Email
          </Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            We've sent a 6-digit verification code to
          </Text>
          <TouchableOpacity onPress={handleChangeEmail} activeOpacity={0.7}>
            <Text style={[styles.emailText, { color: PrimaryColor }]}>
              {email}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Verification Code Input */}
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: codeContainerAnim }
              ]
            }
          ]}
        >
          <Text style={[styles.instructionText, { color: colors.text }]}>
            Enter the 6-digit code
          </Text>
          
          <View style={styles.codeContainer}>
            {verificationCode.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={[
                  styles.codeInput,
                  {
                    backgroundColor: colors.surface,
                    borderColor: digit ? PrimaryColor : colors.border,
                    color: colors.text,
                    borderWidth: digit ? 2 : 1,
                  }
                ]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                selectTextOnFocus
                autoFocus={index === 0}
              />
            ))}
          </View>

          {/* Verify Button */}
          <Animated.View style={{
            transform: [{ scale: buttonScaleAnim }]
          }}>
            <TouchableOpacity
              style={[
                styles.verifyButton,
                { 
                  backgroundColor: PrimaryColor,
                  opacity: (isLoading || verificationCode.join('').length !== 6) ? 0.5 : 1
                }
              ]}
              onPress={handleVerifyCode}
              disabled={isLoading || verificationCode.join('').length !== 6}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <IconSymbol
                    name="checkmark.shield.fill"
                    size={20}
                    color="white"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.verifyButtonText}>Verify Email</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Resend Code */}
          <View style={styles.resendContainer}>
            <Text style={[styles.resendText, { color: colors.icon }]}>
              Didn't receive the code?{' '}
            </Text>
            {canResend ? (
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={isResending}
                activeOpacity={0.7}
              >
                {isResending ? (
                  <ActivityIndicator size="small" color={PrimaryColor} />
                ) : (
                  <Text style={[styles.resendLink, { color: PrimaryColor }]}>
                    Resend Code
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <Text style={[styles.timerText, { color: colors.icon }]}>
                Resend in {formatTime(timer)}
              </Text>
            )}
          </View>

          {/* Security Note */}
          <View style={[styles.securityNote, { backgroundColor: colors.surface }]}>
            <IconSymbol
              name="info.circle.fill"
              size={16}
              color={colors.icon}
              style={styles.securityIcon}
            />
            <Text style={[styles.securityText, { color: colors.icon }]}>
              For your security, this code will expire in 15 minutes.
            </Text>
          </View>
        </Animated.View>

        {/* Footer */}
        <Animated.View 
          style={[
            styles.footer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={[styles.footerText, { color: colors.icon }]}>
            Need help?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => Alert.alert('Contact Support', 'Support feature will be available soon.')}
            activeOpacity={0.7}
          >
            <Text style={[styles.supportLink, { color: PrimaryColor }]}>
              Contact Support
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  backButton: {
    position: 'absolute',
    top: 80,
    left: 0,
    zIndex: 10,
    padding: 8,
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.6,
  },
  circle1: {
    width: 120,
    height: 120,
    top: -20,
    right: -40,
  },
  circle2: {
    width: 80,
    height: 80,
    top: 40,
    left: -20,
  },
  circle3: {
    width: 60,
    height: 60,
    bottom: -10,
    right: 20,
  },
  headerIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: Fonts.rounded,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.sans,
    textAlign: 'center',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 40,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Fonts.sans,
    marginBottom: 32,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  codeInput: {
    width: 50,
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: Fonts.rounded,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    marginBottom: 32,
    minWidth: 200,
  },
  buttonIcon: {
    marginRight: 8,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Fonts.sans,
    letterSpacing: 0.5,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  resendText: {
    fontSize: 16,
    fontFamily: Fonts.sans,
  },
  resendLink: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
    textDecorationLine: 'underline',
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  securityIcon: {
    marginRight: 8,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.sans,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 16,
    fontFamily: Fonts.sans,
  },
  supportLink: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
    textDecorationLine: 'underline',
  },
});