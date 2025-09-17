import { IconSymbol } from '@/components/ui/icon-symbol';
import type { NotificationType } from '@/components/ui/notification';
import { CustomNotification } from '@/components/ui/notification';
import { Colors, Fonts, PrimaryColor } from '@/constants/theme';
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
import AuthService from '../service/AuthService';

const { width } = Dimensions.get('window');

export default function SignUpPage() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  
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
  const firstNameBorderAnim = useRef(new Animated.Value(0)).current;
  const lastNameBorderAnim = useRef(new Animated.Value(0)).current;
  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const passwordBorderAnim = useRef(new Animated.Value(0)).current;
  const confirmPasswordBorderAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const checkboxScaleAnim = useRef(new Animated.Value(1)).current;

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

  const animateFocus = (animRef: Animated.Value, focused: boolean, setFocused: (focused: boolean) => void) => {
    setFocused(focused);
    Animated.spring(animRef, {
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

  const handleSignUp = async () => {
    animateButtonPress();
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showNotification('error', 'Missing Information', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      showNotification('error', 'Invalid Email', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      showNotification('error', 'Weak Password', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      showNotification('error', 'Password Mismatch', 'Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      showNotification('error', 'Terms Required', 'Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await AuthService.signUp({
        firstName,
        lastName,
        email,
        password
      });
      
      if (response.success) {
        showNotification('success', 'Account Created!', response.message || 'Your account has been created successfully. Welcome to Fit Buddy!');
        
        // Auto-navigate to email confirmation after 2 seconds
        setTimeout(() => {
          hideNotification();
          router.push('/email-confirmation' as any);
        }, 2000);
      } else {
        showNotification('error', 'Signup Failed', response.message || 'Failed to create account. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      showNotification('error', 'Connection Error', 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = (platform: string) => {
    showNotification(
      'info',
      'Coming Soon',
      `${platform} sign up will be implemented soon.`
    );
  };

  const handleTermsToggle = () => {
    animateCheckbox();
    setAgreeToTerms(!agreeToTerms);
  };

  const renderAnimatedInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    icon: string,
    borderAnim: Animated.Value,
    focused: boolean,
    onFocus: () => void,
    onBlur: () => void,
    keyboardType: any = 'default',
    secureTextEntry: boolean = false,
    showPasswordToggle: boolean = false,
    showPassword?: boolean,
    setShowPassword?: (show: boolean) => void,
    autoCapitalize: any = 'none',
    autoCorrect: boolean = false,
    flex?: number
  ) => (
    <View style={[styles.inputGroup, flex ? { flex } : null]}>
      <Text style={[styles.inputLabel, { color: colors.text }]}>
        {label}
      </Text>
      <Animated.View style={[
        styles.inputContainer,
        { 
          backgroundColor: colors.surface,
          borderColor: borderAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [colors.border, PrimaryColor],
          }),
          borderWidth: borderAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 2],
          }),
          shadowColor: PrimaryColor,
          shadowOpacity: borderAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.2],
          }),
          shadowRadius: 8,
          elevation: focused ? 8 : 2,
          transform: [{
            scale: borderAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.02],
            })
          }]
        }
      ]}>
        <Animated.View style={{
          transform: [{
            scale: borderAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.1],
            })
          }]
        }}>
          <IconSymbol
            name={icon}
            size={20}
            color={focused ? PrimaryColor : colors.icon}
            style={styles.inputIcon}
          />
        </Animated.View>
        <TextInput
          style={[styles.textInput, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.icon}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setShowPassword && setShowPassword(!showPassword)}
            style={styles.passwordToggle}
          >
            <IconSymbol
              name={showPassword ? "eye.slash.fill" : "eye.fill"}
              size={20}
              color={focused ? PrimaryColor : colors.icon}
            />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );

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
            Join Fit Buddy
          </Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Create your account and start your fitness journey
          </Text>
        </Animated.View>

        {/* Sign Up Form */}
        <Animated.View 
          style={[
            styles.form,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Name Inputs */}
          <View style={styles.nameRow}>
            {renderAnimatedInput(
              'First Name',
              firstName,
              setFirstName,
              'First name',
              'person.fill',
              firstNameBorderAnim,
              firstNameFocused,
              () => animateFocus(firstNameBorderAnim, true, setFirstNameFocused),
              () => animateFocus(firstNameBorderAnim, false, setFirstNameFocused),
              'default',
              false,
              false,
              undefined,
              undefined,
              'words',
              false,
              1
            )}
            <View style={{ width: 16 }} />
            {renderAnimatedInput(
              'Last Name',
              lastName,
              setLastName,
              'Last name',
              'person.fill',
              lastNameBorderAnim,
              lastNameFocused,
              () => animateFocus(lastNameBorderAnim, true, setLastNameFocused),
              () => animateFocus(lastNameBorderAnim, false, setLastNameFocused),
              'default',
              false,
              false,
              undefined,
              undefined,
              'words',
              false,
              1
            )}
          </View>

          {/* Email Input */}
          {renderAnimatedInput(
            'Email Address',
            email,
            setEmail,
            'Enter your email',
            'envelope.fill',
            emailBorderAnim,
            emailFocused,
            () => animateFocus(emailBorderAnim, true, setEmailFocused),
            () => animateFocus(emailBorderAnim, false, setEmailFocused),
            'email-address'
          )}

          {/* Password Input */}
          {renderAnimatedInput(
            'Password',
            password,
            setPassword,
            'Create a password',
            'lock.fill',
            passwordBorderAnim,
            passwordFocused,
            () => animateFocus(passwordBorderAnim, true, setPasswordFocused),
            () => animateFocus(passwordBorderAnim, false, setPasswordFocused),
            'default',
            !showPassword,
            true,
            showPassword,
            setShowPassword
          )}

          {/* Confirm Password Input */}
          {renderAnimatedInput(
            'Confirm Password',
            confirmPassword,
            setConfirmPassword,
            'Confirm your password',
            'lock.fill',
            confirmPasswordBorderAnim,
            confirmPasswordFocused,
            () => animateFocus(confirmPasswordBorderAnim, true, setConfirmPasswordFocused),
            () => animateFocus(confirmPasswordBorderAnim, false, setConfirmPasswordFocused),
            'default',
            !showConfirmPassword,
            true,
            showConfirmPassword,
            setShowConfirmPassword
          )}

          {/* Terms Agreement */}
          <TouchableOpacity
            style={styles.termsContainer}
            onPress={handleTermsToggle}
            activeOpacity={0.7}
          >
            <Animated.View style={[
              styles.checkbox,
              {
                backgroundColor: agreeToTerms ? PrimaryColor : colors.surface,
                borderColor: agreeToTerms ? PrimaryColor : colors.border,
                transform: [{ scale: checkboxScaleAnim }]
              }
            ]}>
              {agreeToTerms && (
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
            <Text style={[styles.termsText, { color: colors.text }]}>
              I agree to the{' '}
              <Text style={{ color: PrimaryColor, fontWeight: '600' }}>
                Terms of Service
              </Text>
              {' '}and{' '}
              <Text style={{ color: PrimaryColor, fontWeight: '600' }}>
                Privacy Policy
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <Animated.View style={{
            transform: [{ scale: buttonScaleAnim }]
          }}>
            <TouchableOpacity
              style={[
                styles.signUpButton,
                { 
                  backgroundColor: PrimaryColor,
                  opacity: isLoading ? 0.7 : 1
                }
              ]}
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.signUpButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.icon }]}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Social Sign Up Buttons */}
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
              onPress={() => handleSocialSignUp('Google')}
              activeOpacity={0.7}
            >
              <IconSymbol name="ant.google" size={20} color={colors.icon} />
              <Text style={[styles.socialButtonText, { color: colors.text }]}>Google</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => handleSocialSignUp('Apple')}
                activeOpacity={0.7}
              >
                <IconSymbol name="ant.apple" size={20} color={colors.icon} />
                <Text style={[styles.socialButtonText, { color: colors.text }]}>Apple</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Sign In Link */}
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
            Already have an account?{' '}
          </Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text style={[styles.signInLink, { color: PrimaryColor }]}>
                Sign In
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
  nameRow: {
    flexDirection: 'row',
    marginBottom: 24,
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.sans,
    lineHeight: 22,
  },
  signUpButton: {
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
  signUpButtonText: {
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
  signInLink: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.sans,
  },
});