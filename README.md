# FITBUDDY 🏃‍♂️📱

**Connect with fellow fitness enthusiasts and never work out alone again!**

FITBUDDY is a modern mobile fitness application built with Expo that helps users track activities, connect with friends, and manage personal fitness goals. Whether you're looking for a running partner or want to join a local basketball game, FITBUDDY makes it easy to find and connect with like-minded fitness enthusiasts in your area.

## 🌟 Key Features

- **Social Fitness Connection**: Find and connect with friends who share your fitness interests
- **Activity Tracking**: Log and monitor your workouts and activities
- **Sport Preferences**: Customize your profile with preferred sports and activities
- **Personalized Feed**: Discover activities and events based on your interests
- **Smart Notifications**: Stay updated with activity reminders and friend requests
- **Themed UI**: Beautiful dark/light mode support for comfortable viewing
- **Secure Authentication**: Safe login and signup with email verification

## 🏗️ Architecture & Tech Stack

### Frontend
- **React Native** via [Expo](https://expo.dev) v54.0.7
- **React** 19.1.0 with concurrent features
- **TypeScript** ~5.9.2 for type safety
- **Expo Router** ~6.0.5 for file-based navigation
- **React Navigation** for tab navigation

### UI/UX Components
- Custom themed components (`ThemedView`, `ThemedText`)
- Animated UI with `react-native-reanimated`
- Gesture handling with `react-native-gesture-handler`
- Vector graphics with `react-native-svg`
- Lottie animations for engaging illustrations
- iOS-native symbols via `expo-symbols`

### Data & Storage
- **Async Storage** for local persistence
- **Secure Store** for sensitive data (credentials, tokens)
- Service layer architecture for API interactions
- Mock data services for development

### Development Tools
- ESLint with Expo configuration
- TypeScript strict mode
- Hot reloading development server

## 📁 Project Structure

```
app/                    # Application screens and routing
├── (tabs)/            # Main tab navigation screens
├── auth/              # Authentication flow screens
├── profile/           # User profile management
├── settings/          # App settings and preferences
components/            # Reusable UI components
constants/             # Theme, images, and configuration
hooks/                 # Custom React hooks
scripts/               # Utility scripts
service/               # Business logic and data services
```

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd FITBUDDY
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

### Running the App

After starting the development server, you can:

- **Scan QR Code**: Use the Expo Go app to scan the QR code and run on your physical device
- **Run on Simulator**: 
  ```bash
  # Android
  npm run android
  
  # iOS (macOS only)
  npm run ios
  ```
- **Run on Web**:
  ```bash
  npm run web
  ```

## 🎯 Core Functionality

### Authentication Flow
1. Onboarding experience introducing the app's value proposition
2. Email/password signup with validation
3. Email verification process
4. Secure login with token management
5. Password reset functionality

### Main Features
- **Home Feed**: Personalized activity feed based on preferences
- **Explore**: Discover friends and activities in your area
- **Create**: Organize new fitness activities and events
- **Notifications**: Activity updates and social interactions
- **Profile**: Personal information, sport preferences, and activity history

### User Management
- Edit profile information
- Customize sport preferences
- View activity history
- Manage friend connections
- Account settings and preferences

### Settings & Preferences
- Account information management
- Privacy and security controls
- Notification preferences
- Help and support center

## 🛠️ Development Scripts

```bash
# Start development server
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator
npm run ios

# Run in web browser
npm run web

# Reset project to blank state
npm run reset-project

# Run ESLint
npm run lint
```

## 🧪 Testing

The project currently uses mock data services for development. For production, these would connect to a backend API.

## 📱 Platform Support

- **iOS**: Fully supported
- **Android**: Fully supported  
- **Web**: Experimental support (some native features may not work)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev)
- UI components inspired by modern design principles
- Icons from [Ionicons](https://ionic.io/ionicons)
- Animations powered by [Lottie](https://lottiefiles.com/)

---

*Made with ❤️ for fitness enthusiasts everywhere*