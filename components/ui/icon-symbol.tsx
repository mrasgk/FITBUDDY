// Enhanced icon component supporting MaterialIcons, FontAwesome, and AntDesign

import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconLibrary = 'MaterialIcons' | 'FontAwesome' | 'FontAwesome5' | 'AntDesign';

type IconMapping = Record<string, {
  library: IconLibrary;
  name: string;
}>;

type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation icons
  'house.fill': { library: 'MaterialIcons', name: 'home' },
  'magnifyingglass': { library: 'MaterialIcons', name: 'search' },
  'plus.circle.fill': { library: 'MaterialIcons', name: 'add-circle' },
  'bell.fill': { library: 'MaterialIcons', name: 'notifications' },
  'person.fill': { library: 'MaterialIcons', name: 'person' },
  'chevron.left': { library: 'MaterialIcons', name: 'chevron-left' },
  'chevron.right': { library: 'MaterialIcons', name: 'chevron-right' },
  'chevron.up': { library: 'MaterialIcons', name: 'keyboard-arrow-up' },
  'chevron.down': { library: 'MaterialIcons', name: 'keyboard-arrow-down' },
  'arrow.left': { library: 'MaterialIcons', name: 'arrow-back' },
  'arrow.right': { library: 'MaterialIcons', name: 'arrow-forward' },
  'xmark': { library: 'MaterialIcons', name: 'close' },
  'checkmark': { library: 'MaterialIcons', name: 'check' },
  
  // Sports & Fitness icons (Mix of MaterialIcons and FontAwesome)
  'figure.soccer': { library: 'MaterialIcons', name: 'sports-soccer' },
  'figure.basketball': { library: 'MaterialIcons', name: 'sports-basketball' },
  'figure.american.football': { library: 'MaterialIcons', name: 'sports-football' },
  'figure.tennis': { library: 'MaterialIcons', name: 'sports-tennis' },
  'figure.volleyball': { library: 'MaterialIcons', name: 'sports-volleyball' },
  'figure.baseball': { library: 'MaterialIcons', name: 'sports-baseball' },
  'figure.swimming': { library: 'MaterialIcons', name: 'pool' },
  'figure.running': { library: 'MaterialIcons', name: 'directions-run' },
  'figure.cycling': { library: 'MaterialIcons', name: 'directions-bike' },
  'figure.yoga': { library: 'MaterialIcons', name: 'self-improvement' },
  'figure.weightlifting': { library: 'MaterialIcons', name: 'fitness-center' },
  'figure.boxing': { library: 'MaterialIcons', name: 'sports-mma' },
  'figure.golf': { library: 'MaterialIcons', name: 'golf-course' },
  'figure.hockey': { library: 'MaterialIcons', name: 'sports-hockey' },
  'figure.skiing': { library: 'MaterialIcons', name: 'downhill-skiing' },
  'figure.surfing': { library: 'MaterialIcons', name: 'surfing' },
  'figure.climbing': { library: 'MaterialIcons', name: 'terrain' },
  'figure.walking': { library: 'MaterialIcons', name: 'directions-walk' },
  'figure.dance': { library: 'MaterialIcons', name: 'sports-kabaddi' },
  'figure.martial.arts': { library: 'MaterialIcons', name: 'sports-martial-arts' },
  'figure.wrestling': { library: 'MaterialIcons', name: 'sports' },
  'figure.table.tennis': { library: 'MaterialIcons', name: 'sports-tennis' },
  'figure.badminton': { library: 'MaterialIcons', name: 'sports-tennis' },
  
  // FontAwesome5 Sports icons
  'fa.dumbbell': { library: 'FontAwesome5', name: 'dumbbell' },
  'fa.swimmer': { library: 'FontAwesome5', name: 'swimmer' },
  'fa.running': { library: 'FontAwesome5', name: 'running' },
  'fa.biking': { library: 'FontAwesome5', name: 'biking' },
  'fa.walking': { library: 'FontAwesome5', name: 'walking' },
  'fa.skiing': { library: 'FontAwesome5', name: 'skiing' },
  'fa.skating': { library: 'FontAwesome5', name: 'skating' },
  
  // Fitness Equipment & Health
  'dumbbell.fill': { library: 'MaterialIcons', name: 'fitness-center' },
  'heart.pulse': { library: 'FontAwesome5', name: 'heartbeat' },
  'stopwatch.fill': { library: 'MaterialIcons', name: 'timer' },
  'flame.fill': { library: 'MaterialIcons', name: 'whatshot' },
  'drop.fill': { library: 'MaterialIcons', name: 'water-drop' },
  'bolt.energy': { library: 'MaterialIcons', name: 'flash-on' },
  'scale.3d': { library: 'MaterialIcons', name: 'scale' },
  'target': { library: 'MaterialIcons', name: 'gps-fixed' },
  'trophy.fill': { library: 'FontAwesome5', name: 'trophy' },
  'medal.fill': { library: 'FontAwesome5', name: 'medal' },
  'thermometer': { library: 'MaterialIcons', name: 'thermostat' },
  
  // FontAwesome Health icons
  'fa.heartbeat': { library: 'FontAwesome5', name: 'heartbeat' },
  'fa.weight': { library: 'FontAwesome5', name: 'weight' },
  'fa.pills': { library: 'FontAwesome5', name: 'pills' },
  'fa.stethoscope': { library: 'FontAwesome5', name: 'stethoscope' },
  'fa.user-md': { library: 'FontAwesome5', name: 'user-md' },
  
  // Social & Communication
  'paperplane.fill': { library: 'MaterialIcons', name: 'send' },
  'envelope.fill': { library: 'MaterialIcons', name: 'email' },
  'message.fill': { library: 'MaterialIcons', name: 'message' },
  'phone.fill': { library: 'MaterialIcons', name: 'phone' },
  'video.fill': { library: 'MaterialIcons', name: 'videocam' },
  'mic.fill': { library: 'MaterialIcons', name: 'mic' },
  'speaker.wave.2.fill': { library: 'MaterialIcons', name: 'volume-up' },
  'person.2.fill': { library: 'MaterialIcons', name: 'people' },
  'person.3.fill': { library: 'MaterialIcons', name: 'groups' },
  'share': { library: 'MaterialIcons', name: 'share' },
  'bookmark.fill': { library: 'MaterialIcons', name: 'bookmark' },
  'flag.fill': { library: 'MaterialIcons', name: 'flag' },
  
  // FontAwesome Social icons
  'fa.facebook': { library: 'FontAwesome', name: 'facebook' },
  'fa.twitter': { library: 'FontAwesome', name: 'twitter' },
  'fa.instagram': { library: 'FontAwesome', name: 'instagram' },
  'fa.linkedin': { library: 'FontAwesome', name: 'linkedin' },
  'fa.youtube': { library: 'FontAwesome', name: 'youtube' },
  'fa.whatsapp': { library: 'FontAwesome', name: 'whatsapp' },
  'fa.telegram': { library: 'FontAwesome', name: 'telegram' },
  'ant.apple': { library: 'FontAwesome', name: 'apple' },
  
  // UI & System icons
  'gear': { library: 'MaterialIcons', name: 'settings' },
  'info.circle.fill': { library: 'MaterialIcons', name: 'info' },
  'exclamationmark.triangle.fill': { library: 'MaterialIcons', name: 'warning' },
  'questionmark.circle.fill': { library: 'MaterialIcons', name: 'help' },
  'plus': { library: 'MaterialIcons', name: 'add' },
  'minus': { library: 'MaterialIcons', name: 'remove' },
  'multiply': { library: 'MaterialIcons', name: 'close' },
  'eye.fill': { library: 'MaterialIcons', name: 'visibility' },
  'eye.slash.fill': { library: 'MaterialIcons', name: 'visibility-off' },
  'lock.fill': { library: 'MaterialIcons', name: 'lock' },
  'lock.open.fill': { library: 'MaterialIcons', name: 'lock-open' },
  'lock.rotation': { library: 'MaterialIcons', name: 'lock-reset' },
  'key.fill': { library: 'MaterialIcons', name: 'vpn-key' },
  'shield.fill': { library: 'MaterialIcons', name: 'security' },
  'checkmark.shield.fill': { library: 'MaterialIcons', name: 'verified' },
  'envelope.circle.fill': { library: 'MaterialIcons', name: 'mark-email-read' },
  'wifi': { library: 'MaterialIcons', name: 'wifi' },
  'bluetooth': { library: 'MaterialIcons', name: 'bluetooth' },
  'battery.full': { library: 'MaterialIcons', name: 'battery-full' },
  'battery.half': { library: 'MaterialIcons', name: 'battery-std' },
  'battery.low': { library: 'MaterialIcons', name: 'battery-alert' },
  'signal.bars.4': { library: 'MaterialIcons', name: 'signal-cellular-4-bar' },
  
  // AntDesign UI icons
  'ant.user': { library: 'AntDesign', name: 'user' },
  'ant.setting': { library: 'AntDesign', name: 'setting' },
  'ant.heart': { library: 'AntDesign', name: 'heart' },
  'ant.star': { library: 'AntDesign', name: 'star' },
  'ant.like': { library: 'AntDesign', name: 'like1' },
  'ant.dislike': { library: 'AntDesign', name: 'dislike1' },
  'ant.home': { library: 'AntDesign', name: 'home' },
  'ant.search': { library: 'AntDesign', name: 'search1' },
  'ant.plus': { library: 'AntDesign', name: 'plus' },
  'ant.minus': { library: 'AntDesign', name: 'minus' },
  'ant.close': { library: 'AntDesign', name: 'close' },
  'ant.check': { library: 'AntDesign', name: 'check' },
  'ant.left': { library: 'AntDesign', name: 'left' },
  'ant.right': { library: 'AntDesign', name: 'right' },
  'ant.up': { library: 'AntDesign', name: 'up' },
  'ant.down': { library: 'AntDesign', name: 'down' },
  'ant.google': { library: 'AntDesign', name: 'google' },
  
  // Content & Media
  'photo.fill': { library: 'MaterialIcons', name: 'photo' },
  'camera.fill': { library: 'MaterialIcons', name: 'photo-camera' },
  'video.camera.fill': { library: 'MaterialIcons', name: 'videocam' },
  'music.note': { library: 'MaterialIcons', name: 'music-note' },
  'play.fill': { library: 'MaterialIcons', name: 'play-arrow' },
  'pause.fill': { library: 'MaterialIcons', name: 'pause' },
  'stop.fill': { library: 'MaterialIcons', name: 'stop' },
  'forward.fill': { library: 'MaterialIcons', name: 'fast-forward' },
  'backward.fill': { library: 'MaterialIcons', name: 'fast-rewind' },
  'volume.up.fill': { library: 'MaterialIcons', name: 'volume-up' },
  'volume.down.fill': { library: 'MaterialIcons', name: 'volume-down' },
  'volume.off.fill': { library: 'MaterialIcons', name: 'volume-off' },
  
  // FontAwesome Media icons
  'fa.play': { library: 'FontAwesome5', name: 'play' },
  'fa.pause': { library: 'FontAwesome5', name: 'pause' },
  'fa.stop': { library: 'FontAwesome5', name: 'stop' },
  'fa.music': { library: 'FontAwesome5', name: 'music' },
  'fa.video': { library: 'FontAwesome5', name: 'video' },
  'fa.camera': { library: 'FontAwesome5', name: 'camera' },
  
  // Time & Date
  'calendar': { library: 'MaterialIcons', name: 'event' },
  'clock.fill': { library: 'MaterialIcons', name: 'access-time' },
  'alarm.fill': { library: 'MaterialIcons', name: 'alarm' },
  'timer': { library: 'MaterialIcons', name: 'timer' },
  'hourglass': { library: 'MaterialIcons', name: 'hourglass-empty' },
  'sunrise.fill': { library: 'MaterialIcons', name: 'wb-sunny' },
  'sunset.fill': { library: 'MaterialIcons', name: 'brightness-3' },
  'arrow.clockwise': { library: 'MaterialIcons', name: 'refresh' },
  'checkmark.circle.fill': { library: 'MaterialIcons', name: 'check-circle' },
  
  // FontAwesome Time icons
  'fa.clock': { library: 'FontAwesome5', name: 'clock' },
  'fa.calendar': { library: 'FontAwesome5', name: 'calendar-alt' },
  'fa.stopwatch': { library: 'FontAwesome5', name: 'stopwatch' },
  
  // Location & Maps
  'location.fill': { library: 'MaterialIcons', name: 'location-on' },
  'map.fill': { library: 'MaterialIcons', name: 'map' },
  'compass.fill': { library: 'MaterialIcons', name: 'explore' },
  'car.fill': { library: 'MaterialIcons', name: 'directions-car' },
  'airplane': { library: 'MaterialIcons', name: 'flight' },
  'train.fill': { library: 'MaterialIcons', name: 'train' },
  'bus.fill': { library: 'MaterialIcons', name: 'directions-bus' },
  'bicycle': { library: 'MaterialIcons', name: 'directions-bike' },
  
  // General UI
  'heart.fill': { library: 'MaterialIcons', name: 'favorite' },
  'heart': { library: 'MaterialIcons', name: 'favorite-border' },
  'star.fill': { library: 'MaterialIcons', name: 'star' },
  'star': { library: 'MaterialIcons', name: 'star-border' },
  'filter': { library: 'MaterialIcons', name: 'filter-list' },
  'sort': { library: 'MaterialIcons', name: 'sort' },
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconConfig = MAPPING[name];
  
  // Handle undefined icon mapping with fallback
  if (!iconConfig) {
    console.warn(`Icon "${name}" not found in mapping. Using default lock icon.`);
    return <MaterialIcons color={color} size={size} name="lock" style={style} />;
  }
  
  const { library, name: iconName } = iconConfig;
  
  switch (library) {
    case 'FontAwesome':
      return <FontAwesome color={color} size={size} name={iconName as any} style={style} />;
    case 'FontAwesome5':
      return <FontAwesome5 color={color} size={size} name={iconName as any} style={style} />;
    case 'AntDesign':
      return <AntDesign color={color} size={size} name={iconName as any} style={style} />;
    case 'MaterialIcons':
    default:
      return <MaterialIcons color={color} size={size} name={iconName as any} style={style} />;
  }
}
