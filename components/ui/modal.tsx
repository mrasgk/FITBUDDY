import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, PrimaryColor } from '@/constants/theme';
import React, { ReactNode, useEffect, useRef } from 'react';
import {
    Animated,
    BackHandler,
    Dimensions,
    Platform,
    Modal as RNModal,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useColorScheme,
    View,
    ViewStyle
} from 'react-native';

const { width, height } = Dimensions.get('window');

export type ModalType = 'center' | 'bottom' | 'fullscreen' | 'alert' | 'confirmation';
export type ModalSize = 'small' | 'medium' | 'large' | 'auto';

export interface ModalAction {
  text: string;
  onPress: () => void;
  style?: 'default' | 'primary' | 'destructive' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
}

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  type?: ModalType;
  size?: ModalSize;
  
  // Content
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  icon?: string;
  iconColor?: string;
  
  // Actions
  actions?: ModalAction[];
  
  // Behavior
  dismissible?: boolean;
  animationType?: 'slide' | 'fade' | 'scale';
  persistent?: boolean;
  
  // Styling
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
  
  // Events
  onShow?: () => void;
  onDismiss?: () => void;
}

export function Modal({
  visible,
  onClose,
  type = 'center',
  size = 'medium',
  title,
  subtitle,
  children,
  icon,
  iconColor,
  actions = [],
  dismissible = true,
  animationType = 'scale',
  persistent = false,
  containerStyle,
  contentStyle,
  titleStyle,
  onShow,
  onDismiss,
}: ModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  
  // Animation refs
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.9)).current;
  const contentTranslateY = useRef(new Animated.Value(type === 'bottom' ? height : 0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      onShow?.();
      showModal();
    } else {
      hideModal();
    }
  }, [visible]);

  // Handle Android back button
  useEffect(() => {
    if (Platform.OS === 'android' && visible) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (dismissible && !persistent) {
          onClose();
          return true;
        }
        return true; // Prevent default behavior
      });

      return () => backHandler.remove();
    }
  }, [visible, dismissible, persistent, onClose]);

  const showModal = () => {
    const animations: Animated.CompositeAnimation[] = [
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ];

    if (animationType === 'scale') {
      animations.push(
        Animated.spring(contentScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      );
    } else if (animationType === 'slide' && type === 'bottom') {
      animations.push(
        Animated.spring(contentTranslateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      );
    } else {
      animations.push(
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start();
  };

  const hideModal = () => {
    const animations: Animated.CompositeAnimation[] = [
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ];

    if (animationType === 'scale') {
      animations.push(
        Animated.timing(contentScale, {
          toValue: 0.9,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      );
    } else if (animationType === 'slide' && type === 'bottom') {
      animations.push(
        Animated.timing(contentTranslateY, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        })
      );
    } else {
      animations.push(
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start(() => {
      onDismiss?.();
    });
  };

  const handleOverlayPress = () => {
    if (dismissible && !persistent) {
      onClose();
    }
  };

  const getModalStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.surface,
      borderRadius: type === 'fullscreen' ? 0 : type === 'bottom' ? 24 : 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 16,
    };

    switch (type) {
      case 'fullscreen':
        return {
          ...baseStyle,
          width: width,
          height: height,
          borderRadius: 0,
        };
      case 'bottom':
        return {
          ...baseStyle,
          width: width,
          maxHeight: height * 0.9,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        };
      case 'alert':
        return {
          ...baseStyle,
          width: Math.min(width - 64, 320),
          maxWidth: width - 64,
        };
      default:
        const sizeMap = {
          small: Math.min(width - 80, 280),
          medium: Math.min(width - 48, 400),
          large: Math.min(width - 32, 520),
          auto: 'auto' as const,
        };
        return {
          ...baseStyle,
          width: sizeMap[size],
          maxWidth: width - 32,
          maxHeight: height - 100,
        };
    }
  };

  const getContainerStyle = (): ViewStyle => {
    switch (type) {
      case 'bottom':
        return styles.bottomContainer;
      case 'fullscreen':
        return styles.fullscreenContainer;
      default:
        return styles.centerContainer;
    }
  };

  const getAnimatedStyle = () => {
    const baseStyle = {
      opacity: animationType === 'fade' ? contentOpacity : 1,
    };

    if (animationType === 'scale') {
      return {
        ...baseStyle,
        opacity: contentOpacity,
        transform: [{ scale: contentScale }],
      };
    }

    if (animationType === 'slide' && type === 'bottom') {
      return {
        ...baseStyle,
        transform: [{ translateY: contentTranslateY }],
      };
    }

    return baseStyle;
  };

  const renderActions = () => {
    if (actions.length === 0) return null;

    return (
      <View style={[styles.actionsContainer, actions.length === 1 && styles.singleAction]}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.actionButton,
              {
                backgroundColor: action.style === 'primary' 
                  ? PrimaryColor 
                  : action.style === 'destructive'
                  ? '#ef4444'
                  : action.style === 'secondary'
                  ? colors.surface
                  : 'transparent',
                borderColor: action.style === 'primary' 
                  ? PrimaryColor 
                  : action.style === 'destructive'
                  ? '#ef4444'
                  : colors.border,
                borderWidth: action.style === 'default' || action.style === 'secondary' ? 1 : 0,
                opacity: action.disabled ? 0.5 : 1,
              },
              actions.length === 1 && styles.singleActionButton,
            ]}
            onPress={action.onPress}
            disabled={action.disabled || action.loading}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.actionText,
              {
                color: action.style === 'primary' || action.style === 'destructive'
                  ? 'white'
                  : action.style === 'secondary'
                  ? colors.icon
                  : colors.text,
                fontWeight: action.style === 'primary' ? '700' : '600',
              }
            ]}>
              {action.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (!visible) return null;

  return (
    <RNModal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={dismissible ? onClose : undefined}
    >
      <Animated.View 
        style={[
          styles.overlay,
          { opacity: overlayOpacity }
        ]}
      >
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View style={[styles.overlay, getContainerStyle(), containerStyle]}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  getModalStyle(),
                  getAnimatedStyle(),
                  contentStyle,
                ]}
              >
                {/* Header */}
                {(title || subtitle || dismissible) && (
                  <View style={styles.header}>
                    <View style={styles.headerContent}>
                      {icon && (
                        <View style={[styles.iconContainer, { backgroundColor: iconColor ? `${iconColor}20` : `${PrimaryColor}20` }]}>
                          <IconSymbol 
                            name={icon as any} 
                            size={32} 
                            color={iconColor || PrimaryColor} 
                          />
                        </View>
                      )}
                      {title && (
                        <Text style={[
                          styles.title, 
                          { color: colors.text },
                          titleStyle,
                          icon && styles.titleWithIcon
                        ]}>
                          {title}
                        </Text>
                      )}
                      {subtitle && (
                        <Text style={[styles.subtitle, { color: colors.icon }]}>
                          {subtitle}
                        </Text>
                      )}
                    </View>
                    {dismissible && !persistent && (
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                        activeOpacity={0.7}
                      >
                        <IconSymbol name="xmark" size={20} color={colors.icon} />
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {/* Content */}
                {children && (
                  <View style={styles.content}>
                    {children}
                  </View>
                )}

                {/* Actions */}
                {renderActions()}
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  bottomContainer: {
    justifyContent: 'flex-end',
  },
  fullscreenContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleWithIcon: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  closeButton: {
    padding: 8,
    marginTop: -8,
    marginRight: -8,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  singleAction: {
    justifyContent: 'center',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  singleActionButton: {
    flex: 0,
    minWidth: 120,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

// Convenience functions for common modal types
export const showAlert = (
  title: string,
  message: string,
  actions: ModalAction[] = [{ text: 'OK', onPress: () => {} }]
) => {
  // This would be implemented with a global modal context
  console.log('Alert:', { title, message, actions });
};

export const showConfirmation = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  // This would be implemented with a global modal context
  console.log('Confirmation:', { title, message, onConfirm, onCancel });
};

export default Modal;