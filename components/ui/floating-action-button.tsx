import { IconSymbol } from '@/components/ui/icon-symbol';
import { AccentColor, Colors } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    Vibration,
    View
} from 'react-native';

interface FABAction {
  icon: string;
  label?: string;
  onPress: () => void;
  color?: string;
  size?: number;
}

interface FloatingActionButtonProps {
  onPress?: () => void;
  icon?: string;
  actions?: FABAction[];
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  size?: 'small' | 'medium' | 'large';
  visible?: boolean;
  haptic?: boolean;
  expandable?: boolean;
}

export function FloatingActionButton({
  onPress,
  icon = 'plus',
  actions = [],
  position = 'bottom-right',
  size = 'medium',
  visible = true,
  haptic = true,
  expandable = false,
}: FloatingActionButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];
  
  const scaleAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = React.useState(false);
  
  const actionAnims = useRef(
    actions.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: visible ? 1 : 0,
      tension: 50,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handlePress = () => {
    if (haptic && Platform.OS === 'ios') {
      Vibration.vibrate(50);
    }

    if (expandable && actions.length > 0) {
      setExpanded(!expanded);
      
      // Rotate animation
      Animated.timing(rotateAnim, {
        toValue: expanded ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Actions animation
      if (!expanded) {
        // Show actions
        actionAnims.forEach((anim, index) => {
          Animated.timing(anim, {
            toValue: 1,
            duration: 200,
            delay: index * 50,
            useNativeDriver: true,
          }).start();
        });
      } else {
        // Hide actions
        actionAnims.forEach((anim, index) => {
          Animated.timing(anim, {
            toValue: 0,
            duration: 150,
            delay: (actionAnims.length - index - 1) * 25,
            useNativeDriver: true,
          }).start();
        });
      }
    } else {
      onPress?.();
    }
  };

  const handleActionPress = (action: FABAction) => {
    if (haptic && Platform.OS === 'ios') {
      Vibration.vibrate(30);
    }
    action.onPress();
    
    if (expandable) {
      setExpanded(false);
      rotateAnim.setValue(0);
      actionAnims.forEach(anim => anim.setValue(0));
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { width: 48, height: 48 };
      case 'large':
        return { width: 72, height: 72 };
      default:
        return { width: 60, height: 60 };
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 32;
      default:
        return 24;
    }
  };

  const getPositionStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      bottom: 100,
    };

    switch (position) {
      case 'bottom-left':
        return { ...baseStyle, left: 20 };
      case 'bottom-center':
        return { ...baseStyle, alignSelf: 'center' as const };
      default:
        return { ...baseStyle, right: 20 };
    }
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={[styles.container, getPositionStyle()]}>
      {/* Action buttons */}
      {expandable && actions.map((action, index) => (
        <Animated.View
          key={index}
          style={[
            styles.actionContainer,
            {
              opacity: actionAnims[index],
              transform: [
                {
                  translateY: actionAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, -(60 + index * 70)],
                  }),
                },
                {
                  scale: actionAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: action.color || colors.surface,
                shadowColor: action.color || colors.text,
              },
            ]}
            onPress={() => handleActionPress(action)}
            activeOpacity={0.8}
          >
            <IconSymbol
              name={action.icon as any}
              size={action.size || 20}
              color={action.color ? 'white' : colors.text}
            />
          </TouchableOpacity>
        </Animated.View>
      ))}

      {/* Main FAB */}
      <Animated.View
        style={[
          styles.fab,
          getSizeStyle(),
          {
            backgroundColor: AccentColor,
            transform: [
              { scale: scaleAnim },
              { rotate: rotation },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.fabButton, getSizeStyle()]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <IconSymbol
            name={icon as any}
            size={getIconSize()}
            color="white"
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    zIndex: 1000,
  },
  fab: {
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabButton: {
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default FloatingActionButton;