import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts, PrimaryColor } from '@/constants/theme';
import { Link, router, useLocalSearchParams } from 'expo-router';
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
import { emailService } from '../service';

const { width } = Dimensions.get('window');

export default function ResetPasswordPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const params = useLocalSearchParams();
  const email = params.email as string || '';
  const token = params.token as string || '';
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(true);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const passwordBorderAnim = useRef(new Animated.Value(0)).current;
  const confirmPasswordBorderAnim = useRef(new Animated.Value(0)).current;
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
    ]).start();

    // Verify token if provided
    if (email && token) {
      verifyResetToken();
    } else {
      setIsVerifyingToken(false);
    }
  }, []);

  const verifyResetToken = async () => {
    try {
      const response = await emailService.verifyPasswordResetToken(email, token);
      setTokenVerified(response.success);
      
      if (!response.success) {
        Alert.alert(
          'Invalid Reset Link',
          response.message || 'The password reset link is invalid or has expired.',
          [
            {
              text: 'Request New Link',
              onPress: () => router.replace('/forgot-password' as any)
            }
          ]
        );
      }
    } catch (error) {
      console.error('Token verification error:', error);
      Alert.alert(
        'Error',
        'Failed to verify reset token. Please try again.',
        [
          {
            text: 'Go Back',
            onPress: () => router.back()
          }
        ]
      );
    } finally {
      setIsVerifyingToken(false);
    }
  };

  const animatePasswordFocus = (focused: boolean) => {
    setPasswordFocused(focused);
    Animated.spring(passwordBorderAnim, {
      toValue: focused ? 1 : 0,
      tension: 100,
      friction: 8,
      useNativeDriver: false,
    }).start();
  };

  const animateConfirmPasswordFocus = (focused: boolean) => {
    setConfirmPasswordFocused(focused);
    Animated.spring(confirmPasswordBorderAnim, {
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

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleResetPassword = async () => {
    animateButtonPress();
    
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      Alert.alert('Error', passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      // In a real app, this would call a password reset API
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Success!',
        'Your password has been reset successfully. You can now login with your new password.'
      );
      
      // Auto-navigate to login after 2 seconds
      setTimeout(() => {
        router.replace('/login' as any);
      }, 2000);
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace('/login' as any);
  };

  if (isVerifyingToken) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={PrimaryColor} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Verifying reset link...
        </Text>
      </View>
    );
  }

  if (!tokenVerified && email && token) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <IconSymbol
          name="exclamationmark.triangle.fill"
          size={60}
          color={colors.icon}
          style={{ marginBottom: 20 }}
        />
        <Text style={[styles.errorTitle, { color: colors.text }]}>
          Invalid Reset Link
        </Text>
        <Text style={[styles.errorMessage, { color: colors.icon }]}>
          The password reset link is invalid or has expired.
        </Text>
        <TouchableOpacity
          style={[styles.errorButton, { backgroundColor: PrimaryColor }]}
          onPress={() => router.replace('/forgot-password' as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.errorButtonText}>Request New Link</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            name="key.fill"
            size={80}
            color={PrimaryColor}
            style={styles.headerIcon}
          />
          
          <Text style={[styles.title, { color: colors.text }]}>
            Reset Password
          </Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Enter your new password below
          </Text>
          {email && (
            <Text style={[styles.emailText, { color: PrimaryColor }]}>
              for {email}
            </Text>
          )}
        </Animated.View>

        {/* Reset Form */}
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* New Password Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              New Password
            </Text>
            <Animated.View style={[
              styles.inputContainer,
              { 
                backgroundColor: colors.surface,
                borderColor: passwordBorderAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.border, PrimaryColor],
                }),
                borderWidth: passwordBorderAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 2],
                }),
                shadowColor: PrimaryColor,
                shadowOpacity: passwordBorderAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.2],
                }),
                shadowRadius: 8,
                elevation: passwordFocused ? 8 : 2,
                transform: [{
                  scale: passwordBorderAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.02],
                  })
                }]
              }
            ]}>
              <Animated.View style={{
                transform: [{
                  scale: passwordBorderAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1],
                  })
                }]
              }}>
                <IconSymbol
                  name="lock.fill"
                  size={20}
                  color={passwordFocused ? PrimaryColor : colors.icon}
                  style={styles.inputIcon}
                />
              </Animated.View>
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                placeholder="Enter new password"
                placeholderTextColor={colors.icon}
                value={newPassword}
                onChangeText={setNewPassword}
                onFocus={() => animatePasswordFocus(true)}
                onBlur={() => animatePasswordFocus(false)}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.passwordToggle}
              >
                <IconSymbol
                  name={showNewPassword ? "eye.slash.fill" : "eye.fill"}
                  size={20}
                  color={passwordFocused ? PrimaryColor : colors.icon}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Confirm Password
            </Text>
            <Animated.View style={[
              styles.inputContainer,
              { 
                backgroundColor: colors.surface,
                borderColor: confirmPasswordBorderAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.border, PrimaryColor],
                }),
                borderWidth: confirmPasswordBorderAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 2],
                }),
                shadowColor: PrimaryColor,
                shadowOpacity: confirmPasswordBorderAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.2],
                }),
                shadowRadius: 8,
                elevation: confirmPasswordFocused ? 8 : 2,
                transform: [{
                  scale: confirmPasswordBorderAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.02],
                  })
                }]
              }
            ]}>
              <Animated.View style={{
                transform: [{
                  scale: confirmPasswordBorderAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1],
                  })
                }]
              }}>
                <IconSymbol
                  name="lock.fill"
                  size={20}
                  color={confirmPasswordFocused ? PrimaryColor : colors.icon}
                  style={styles.inputIcon}
                />
              </Animated.View>
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                placeholder="Confirm new password"
                placeholderTextColor={colors.icon}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => animateConfirmPasswordFocus(true)}
                onBlur={() => animateConfirmPasswordFocus(false)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.passwordToggle}
              >
                <IconSymbol
                  name={showConfirmPassword ? "eye.slash.fill" : "eye.fill"}
                  size={20}
                  color={confirmPasswordFocused ? PrimaryColor : colors.icon}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Password Requirements */}
          <View style={[styles.requirementsContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.requirementsTitle, { color: colors.text }]}>
              Password Requirements:
            </Text>
            <Text style={[styles.requirement, { color: colors.icon }]}>
              • At least 8 characters long
            </Text>
            <Text style={[styles.requirement, { color: colors.icon }]}>
              • Contains uppercase and lowercase letters
            </Text>
            <Text style={[styles.requirement, { color: colors.icon }]}>
              • Contains at least one number
            </Text>
          </View>

          {/* Reset Button */}
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
              onPress={handleResetPassword}
              disabled={isLoading}
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
                  <Text style={styles.resetButtonText}>Reset Password</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
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
  loadingText: {
    fontSize: 16,
    fontFamily: Fonts.sans,
    marginTop: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: Fonts.rounded,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    fontFamily: Fonts.sans,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 40,
  },
  errorButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
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
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
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
  passwordToggle: {
    padding: 4,
  },
  requirementsContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
    marginBottom: 12,
  },
  requirement: {
    fontSize: 14,
    fontFamily: Fonts.sans,
    marginBottom: 4,
    lineHeight: 20,
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