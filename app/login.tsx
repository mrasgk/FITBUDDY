import { IconSymbol } from '@/components/ui/icon-symbol';
import type { NotificationType } from '@/components/ui/notification';
import { CustomNotification } from '@/components/ui/notification';
import { Colors, Fonts, PrimaryColor } from '@/constants/theme';
import { Link, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
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
import AuthService from '../service/AuthService';

const { width } = Dimensions.get('window');

// Storage keys for remember me functionality
const REMEMBER_ME_KEY = 'rememberMe';
const SAVED_EMAIL_KEY = 'savedEmail';
const SAVED_PASSWORD_KEY = 'savedPassword';

export default function LoginPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
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
  const passwordBorderAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const checkboxScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Check for saved credentials and auto-login
    const checkRememberMe = async () => {
      try {
        const isRemembered = await SecureStore.getItemAsync(REMEMBER_ME_KEY);
        const savedEmail = await SecureStore.getItemAsync(SAVED_EMAIL_KEY);
        const savedPassword = await SecureStore.getItemAsync(SAVED_PASSWORD_KEY);
        
        if (isRemembered === 'true' && savedEmail && savedPassword) {
          // Auto-login user
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
          
          // Perform automatic login
          const response = await AuthService.login({
            email: savedEmail,
            password: savedPassword
          });
          
          if (response.success) {
            // Navigate directly to home without showing notification
            router.replace('/home' as any);
            return;
          }
        } else if (savedEmail && isRemembered === 'true') {
          // Load saved email if remember me was checked
          setEmail(savedEmail);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error checking remember me:', error);
      }
    };

    checkRememberMe();

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

  const animateEmailFocus = (focused: boolean) => {
    setEmailFocused(focused);
    Animated.spring(emailBorderAnim, {
      toValue: focused ? 1 : 0,
      tension: 100,
      friction: 8,
      useNativeDriver: false,
    }).start();
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

  const animateCheckbox = () => {
    Animated.sequence([
      Animated.timing(checkboxScaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(checkboxScaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

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

  const handleLogin = async () => {
    animateButtonPress();
    
    if (!email || !password) {
      showNotification('error', 'Missing Information', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      showNotification('error', 'Invalid Email', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await AuthService.login({
        email,
        password
      });
      
      if (response.success) {
        // Save credentials if remember me is checked
        try {
          if (rememberMe) {
            await SecureStore.setItemAsync(REMEMBER_ME_KEY, 'true');
            await SecureStore.setItemAsync(SAVED_EMAIL_KEY, email);
            await SecureStore.setItemAsync(SAVED_PASSWORD_KEY, password);
          } else {
            // Clear saved credentials if remember me is unchecked
            await SecureStore.deleteItemAsync(REMEMBER_ME_KEY);
            await SecureStore.deleteItemAsync(SAVED_EMAIL_KEY);
            await SecureStore.deleteItemAsync(SAVED_PASSWORD_KEY);
          }
        } catch (storageError) {
          console.error('Error saving/clearing credentials:', storageError);
        }

        showNotification('success', 'Login Successful', 'Welcome back to Fit Buddy!', [{
          text: 'Continue',
          onPress: () => {
            hideNotification();
            router.replace('/home' as any);
          },
          style: 'primary'
        }]);
      } else {
        showNotification('error', 'Login Failed', response.message || 'Failed to login. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      showNotification('error', 'Connection Error', 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (platform: string) => {
    showNotification(
      'info',
      'Coming Soon',
      `${platform} login will be implemented soon.`
    );
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
          <View style={styles.backgroundDecoration}>
            <View style={[styles.decorativeCircle, styles.circle1, { backgroundColor: `${PrimaryColor}20` }]} />
            <View style={[styles.decorativeCircle, styles.circle2, { backgroundColor: `${PrimaryColor}15` }]} />
            <View style={[styles.decorativeCircle, styles.circle3, { backgroundColor: `${PrimaryColor}10` }]} />
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Sign in to continue your fitness journey
          </Text>
        </Animated.View>

        {/* Login Form */}
        <Animated.View 
          style={[
            styles.form,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
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
                placeholder="Enter your email"
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

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Password
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
                placeholder="Enter your password"
                placeholderTextColor={colors.icon}
                value={password}
                onChangeText={setPassword}
                onFocus={() => animatePasswordFocus(true)}
                onBlur={() => animatePasswordFocus(false)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                <IconSymbol
                  name={showPassword ? "eye.slash.fill" : "eye.fill"}
                  size={20}
                  color={passwordFocused ? PrimaryColor : colors.icon}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Remember Me and Forgot Password Row */}
          <View style={styles.rememberForgotRow}>
            {/* Remember Me */}
            <TouchableOpacity
              style={styles.rememberContainer}
              onPress={() => {
                animateCheckbox();
                setRememberMe(!rememberMe);
              }}
              activeOpacity={0.7}
            >
              <Animated.View style={[
                styles.checkbox,
                {
                  backgroundColor: rememberMe ? PrimaryColor : colors.surface,
                  borderColor: rememberMe ? PrimaryColor : colors.border,
                  transform: [{ scale: checkboxScaleAnim }]
                }
              ]}>
                {rememberMe && (
                  <Animated.View style={{
                    transform: [{ scale: checkboxScaleAnim }]
                  }}>
                    <IconSymbol
                      name="checkmark"
                      size={16}
                      color="white"
                    />
                  </Animated.View>
                )}
              </Animated.View>
              <Text style={[styles.rememberText, { color: colors.text }]}>
                Remember me
              </Text>
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => router.push('/forgot-password' as any)}
              style={styles.forgotPassword}
            >
              <Text style={[styles.forgotPasswordText, { color: PrimaryColor }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <Animated.View style={{
            transform: [{ scale: buttonScaleAnim }]
          }}>
            <TouchableOpacity
              style={[
                styles.loginButton,
                { 
                  backgroundColor: PrimaryColor,
                  opacity: isLoading ? 0.7 : 1
                }
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.icon }]}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[
                styles.socialButton, 
                { 
                  backgroundColor: colors.surface, 
                  borderColor: colors.border,
                  flex: Platform.OS === 'ios' ? 1 : undefined,
                  minWidth: Platform.OS === 'ios' ? undefined : '100%'
                }
              ]}
              onPress={() => handleSocialLogin('Google')}
              activeOpacity={0.7}
            >
              <IconSymbol name="ant.google" size={20} color={colors.icon} />
              <Text style={[styles.socialButtonText, { color: colors.text }]}>Google</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => handleSocialLogin('Apple')}
                activeOpacity={0.7}
              >
                <IconSymbol name="ant.apple" size={20} color={colors.icon} />
                <Text style={[styles.socialButtonText, { color: colors.text }]}>Apple</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Sign Up Link */}
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
            Don't have an account?{' '}
          </Text>
          <Link href="/signup" asChild>
            <TouchableOpacity>
              <Text style={[styles.signUpLink, { color: PrimaryColor }]}>
                Sign Up
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
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: Fonts.rounded,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: Fonts.sans,
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.8,
  },
  form: {
    flex: 1,
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
  rememberForgotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  forgotPassword: {
    padding: 4,
  },
  forgotPasswordText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rememberText: {
    fontSize: 16,
    fontFamily: Fonts.sans,
  },
  loginButton: {
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    marginBottom: 28,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Fonts.sans,
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 20,
    fontSize: 14,
    fontFamily: Fonts.sans,
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: Platform.OS === 'ios' ? 'space-between' : 'center',
    marginBottom: 40,
  },
  socialButton: {
    flex: Platform.OS === 'ios' ? 1 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: Platform.OS === 'ios' ? 0 : 60,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
    marginLeft: 8,
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
  signUpLink: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
});