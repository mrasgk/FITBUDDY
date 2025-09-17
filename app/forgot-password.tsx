import { IconSymbol } from '@/components/ui/icon-symbol';
import { CustomNotification, NotificationType } from '@/components/ui/notification';
import { Colors, Fonts, PrimaryColor } from '@/constants/theme';
import { authService } from '@/service';
import { Link, router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
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

const { width } = Dimensions.get('window');

export default function ForgotPasswordPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{
    visible: boolean;
    type: NotificationType;
    title: string;
    message: string;
    actions?: Array<{
      text: string;
      onPress: () => void;
      style?: 'default' | 'destructive' | 'primary';
    }>;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

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
    ]).start();
  }, []);

  useEffect(() => {
    if (emailSent) {
      Animated.spring(successAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [emailSent]);

  const showNotification = (type: NotificationType, title: string, message: string, actions?: Array<{
    text: string;
    onPress: () => void;
    style?: 'default' | 'destructive' | 'primary';
  }>) => {
    setNotification({
      visible: true,
      type,
      title,
      message,
      actions,
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  const animateEmailFocus = (focused: boolean) => {
    setEmailFocused(focused);
    Animated.spring(emailBorderAnim, {
      toValue: focused ? 1 : 0,
      tension: 100,
      friction: 8,
      useNativeDriver: false,
    }).start();
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

  const handleSendResetEmail = async () => {
    animateButtonPress();
    
    if (!email) {
      showNotification('error', 'Email Required', 'Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      showNotification('error', 'Invalid Email', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authService.resetPassword(email);
      
      if (response.success) {
        setEmailSent(true);
      } else {
        showNotification('error', 'Reset Failed', response.message || 'Failed to send reset email. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      showNotification('error', 'Connection Error', 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  const handleResendEmail = async () => {
    setEmailSent(false);
    successAnim.setValue(0);
    await handleSendResetEmail();
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
            onPress={handleBackToLogin}
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
          
          <IconSymbol
            name="lock.rotation"
            size={80}
            color={PrimaryColor}
            style={styles.headerIcon}
          />
          
          <Text style={[styles.title, { color: colors.text }]}>
            {emailSent ? 'Check Your Email' : 'Forgot Password?'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            {emailSent 
              ? 'We\'ve sent password reset instructions to your email address'
              : 'Don\'t worry! Enter your email and we\'ll send you reset instructions'
            }
          </Text>
        </Animated.View>

        {/* Content */}
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {!emailSent ? (
            // Reset Form
            <>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Email Address
                </Text>
                <Animated.View style={[
                  styles.inputContainer,
                  { 
                    backgroundColor: colors.surface,
                    borderColor: emailBorderAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [colors.border, PrimaryColor],
                    }),
                    borderWidth: emailBorderAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 2],
                    }),
                    shadowColor: PrimaryColor,
                    shadowOpacity: emailBorderAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.2],
                    }),
                    shadowRadius: 8,
                    elevation: emailFocused ? 8 : 2,
                    transform: [{
                      scale: emailBorderAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.02],
                      })
                    }]
                  }
                ]}>
                  <Animated.View style={{
                    transform: [{
                      scale: emailBorderAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.1],
                      })
                    }]
                  }}>
                    <IconSymbol
                      name="envelope.fill"
                      size={20}
                      color={emailFocused ? PrimaryColor : colors.icon}
                      style={styles.inputIcon}
                    />
                  </Animated.View>
                  <TextInput
                    style={[styles.textInput, { color: colors.text }]}
                    placeholder="Enter your email address"
                    placeholderTextColor={colors.icon}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => animateEmailFocus(true)}
                    onBlur={() => animateEmailFocus(false)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </Animated.View>
              </View>

              {/* Send Reset Button */}
              <Animated.View style={{
                transform: [{ scale: buttonScaleAnim }]
              }}>
                <TouchableOpacity
                  style={[
                    styles.resetButton,
                    { 
                      backgroundColor: PrimaryColor,
                      opacity: isLoading ? 0.7 : 1
                    }
                  ]}
                  onPress={handleSendResetEmail}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <IconSymbol
                        name="paperplane.fill"
                        size={20}
                        color="white"
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.resetButtonText}>Send Reset Email</Text>
                    </>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </>
          ) : (
            // Success State
            <Animated.View style={[
              styles.successContainer,
              {
                opacity: successAnim,
                transform: [{
                  translateY: successAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  })
                }]
              }
            ]}>
              <View style={[styles.successIcon, { backgroundColor: `${PrimaryColor}20` }]}>
                <IconSymbol
                  name="checkmark.circle.fill"
                  size={60}
                  color={PrimaryColor}
                />
              </View>
              
              <Text style={[styles.successTitle, { color: colors.text }]}>
                Email Sent Successfully!
              </Text>
              
              <Text style={[styles.successMessage, { color: colors.icon }]}>
                We've sent password reset instructions to{'\n'}
                <Text style={{ color: PrimaryColor, fontWeight: '600' }}>
                  {email}
                </Text>
              </Text>

              <Text style={[styles.instructionText, { color: colors.icon }]}>
                Please check your email and follow the instructions to reset your password.
                The link will expire in 15 minutes.
              </Text>

              <TouchableOpacity
                style={[styles.resendButton, { borderColor: PrimaryColor }]}
                onPress={handleResendEmail}
                activeOpacity={0.7}
              >
                <IconSymbol
                  name="arrow.clockwise"
                  size={18}
                  color={PrimaryColor}
                  style={styles.buttonIcon}
                />
                <Text style={[styles.resendButtonText, { color: PrimaryColor }]}>
                  Resend Email
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
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
            Remember your password?{' '}
          </Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text style={[styles.loginLink, { color: PrimaryColor }]}>
                Back to Login
              </Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      </ScrollView>

      {/* Custom Notification */}
      <CustomNotification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        visible={notification.visible}
        onHide={hideNotification}
        actions={notification.actions}
      />
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
  headerIcon: {
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
    lineHeight: 24,
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.sans,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Fonts.sans,
    letterSpacing: 0.5,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: Fonts.rounded,
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    fontFamily: Fonts.sans,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: Fonts.sans,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
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
  loginLink: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
});