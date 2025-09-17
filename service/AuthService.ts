import * as SecureStore from 'expo-secure-store';
import EmailService from './EmailService';

// Types for authentication
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  lastLoginAt?: string;
  emailVerified?: boolean;
  emailVerifiedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
  token?: string;
  requiresEmailVerification?: boolean;
}

class AuthService {
  private static instance: AuthService;
  private users: Map<string, { user: User; password: string }> = new Map();
  private currentUser: User | null = null;
  private authToken: string | null = null;

  private constructor() {
    this.initializeDefaultUsers();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Initialize with some default users for testing
  private initializeDefaultUsers(): void {
    const defaultUsers = [
      {
        user: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          createdAt: new Date().toISOString(),
          emailVerified: true,
          emailVerifiedAt: new Date().toISOString(),
        },
        password: 'password123'
      },
      {
        user: {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          createdAt: new Date().toISOString(),
          emailVerified: true,
          emailVerifiedAt: new Date().toISOString(),
        },
        password: 'password123'
      }
    ];

    defaultUsers.forEach(userData => {
      this.users.set(userData.user.email, userData);
    });
  }

  // Generate a simple token for authentication
  private generateToken(userId: string): string {
    return `token_${userId}_${Date.now()}`;
  }

  // Generate unique user ID
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  private isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  // Simulate API delay
  private async simulateNetworkDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  }

  // Sign up new user
  public async signUp(signUpData: SignUpData): Promise<AuthResponse> {
    try {
      await this.simulateNetworkDelay();

      const { firstName, lastName, email, password } = signUpData;

      // Validation
      if (!firstName.trim() || !lastName.trim()) {
        return {
          success: false,
          message: 'First name and last name are required'
        };
      }

      if (!this.isValidEmail(email)) {
        return {
          success: false,
          message: 'Please enter a valid email address'
        };
      }

      if (!this.isValidPassword(password)) {
        return {
          success: false,
          message: 'Password must be at least 6 characters long'
        };
      }

      // Check if user already exists
      if (this.users.has(email.toLowerCase())) {
        return {
          success: false,
          message: 'An account with this email already exists'
        };
      }

      // Create new user
      const newUser: User = {
        id: this.generateUserId(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase(),
        createdAt: new Date().toISOString(),
        emailVerified: false,
      };

      // Store user data
      this.users.set(email.toLowerCase(), {
        user: newUser,
        password: password
      });

      // Send verification email
      await EmailService.sendVerificationCode(email);

      // Generate token and set current user
      this.authToken = this.generateToken(newUser.id);
      this.currentUser = newUser;

      // Store in secure storage
      await this.storeAuthData(newUser, this.authToken);

      // Send welcome email
      await EmailService.sendWelcomeEmail(email, firstName);

      return {
        success: true,
        user: newUser,
        token: this.authToken,
        message: 'Account created successfully! Please check your email to verify your account.',
        requiresEmailVerification: true
      };

    } catch (error) {
      console.error('SignUp error:', error);
      return {
        success: false,
        message: 'Failed to create account. Please try again.'
      };
    }
  }

  // Login user
  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      await this.simulateNetworkDelay();

      const { email, password } = credentials;

      // Validation
      if (!email || !password) {
        return {
          success: false,
          message: 'Email and password are required'
        };
      }

      if (!this.isValidEmail(email)) {
        return {
          success: false,
          message: 'Please enter a valid email address'
        };
      }

      // Find user
      const userData = this.users.get(email.toLowerCase());
      if (!userData) {
        return {
          success: false,
          message: 'No account found with this email address'
        };
      }

      // Check password
      if (userData.password !== password) {
        return {
          success: false,
          message: 'Invalid password'
        };
      }

      // Update last login time
      const updatedUser: User = {
        ...userData.user,
        lastLoginAt: new Date().toISOString()
      };

      // Update stored user data
      this.users.set(email.toLowerCase(), {
        ...userData,
        user: updatedUser
      });

      // Generate token and set current user
      this.authToken = this.generateToken(updatedUser.id);
      this.currentUser = updatedUser;

      // Store in secure storage
      await this.storeAuthData(updatedUser, this.authToken);

      return {
        success: true,
        user: updatedUser,
        token: this.authToken,
        message: 'Login successful!'
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Failed to login. Please try again.'
      };
    }
  }

  // Logout user
  public async logout(): Promise<void> {
    try {
      this.currentUser = null;
      this.authToken = null;
      
      // Clear secure storage
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Get current user
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return this.currentUser !== null && this.authToken !== null;
  }

  // Get auth token
  public getAuthToken(): string | null {
    return this.authToken;
  }

  // Store authentication data in secure storage
  private async storeAuthData(user: User, token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  }

  // Restore authentication from secure storage
  public async restoreAuth(): Promise<boolean> {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const userDataString = await SecureStore.getItemAsync('userData');

      if (token && userDataString) {
        const userData = JSON.parse(userDataString);
        this.authToken = token;
        this.currentUser = userData;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error restoring auth:', error);
      return false;
    }
  }

  // Get all users (for development/testing purposes)
  public getAllUsers(): User[] {
    return Array.from(this.users.values()).map(userData => userData.user);
  }

  // Check if email exists
  public emailExists(email: string): boolean {
    return this.users.has(email.toLowerCase());
  }

  // Reset password (placeholder for future implementation)
  public async resetPassword(email: string): Promise<AuthResponse> {
    await this.simulateNetworkDelay();
    
    if (!this.users.has(email.toLowerCase())) {
      return {
        success: false,
        message: 'No account found with this email address'
      };
    }

    // Send password reset email via EmailService
    const emailResponse = await EmailService.sendPasswordResetEmail(email);
    
    return {
      success: emailResponse.success,
      message: emailResponse.message || 'Password reset instructions sent to your email'
    };
  }

  // Update user profile
  public async updateProfile(updates: Partial<Pick<User, 'firstName' | 'lastName'>>): Promise<AuthResponse> {
    try {
      await this.simulateNetworkDelay();

      if (!this.currentUser) {
        return {
          success: false,
          message: 'No user is currently logged in'
        };
      }

      const updatedUser: User = {
        ...this.currentUser,
        ...updates
      };

      // Update in storage
      const userData = this.users.get(this.currentUser.email);
      if (userData) {
        this.users.set(this.currentUser.email, {
          ...userData,
          user: updatedUser
        });
      }

      this.currentUser = updatedUser;
      await this.storeAuthData(updatedUser, this.authToken!);

      return {
        success: true,
        user: updatedUser,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Failed to update profile'
      };
    }
  }

  // Verify user email
  public async verifyEmail(email: string, code: string): Promise<AuthResponse> {
    try {
      const emailResponse = await EmailService.verifyEmail(email, code);
      
      if (!emailResponse.success) {
        return {
          success: false,
          message: emailResponse.message || 'Email verification failed'
        };
      }

      // Update user's email verification status
      const userData = this.users.get(email.toLowerCase());
      if (userData) {
        const updatedUser: User = {
          ...userData.user,
          emailVerified: true,
          emailVerifiedAt: new Date().toISOString()
        };

        this.users.set(email.toLowerCase(), {
          ...userData,
          user: updatedUser
        });

        // Update current user if it's the same
        if (this.currentUser && this.currentUser.email === email.toLowerCase()) {
          this.currentUser = updatedUser;
          await this.storeAuthData(updatedUser, this.authToken!);
        }

        return {
          success: true,
          user: updatedUser,
          message: 'Email verified successfully!'
        };
      }

      return {
        success: false,
        message: 'User not found'
      };

    } catch (error) {
      console.error('Verify email error:', error);
      return {
        success: false,
        message: 'Failed to verify email. Please try again.'
      };
    }
  }

  // Resend email verification code
  public async resendEmailVerification(email: string): Promise<AuthResponse> {
    try {
      const emailResponse = await EmailService.resendVerificationCode(email);
      
      return {
        success: emailResponse.success,
        message: emailResponse.message || 'Verification code sent successfully'
      };

    } catch (error) {
      console.error('Resend email verification error:', error);
      return {
        success: false,
        message: 'Failed to resend verification code. Please try again.'
      };
    }
  }

  // Check if user's email is verified
  public isEmailVerified(): boolean {
    return this.currentUser?.emailVerified ?? false;
  }

  // Get email verification status for a specific email
  public getEmailVerificationStatus(email: string): { verified: boolean; hasPending: boolean } {
    const userData = this.users.get(email.toLowerCase());
    const verified = userData?.user.emailVerified ?? false;
    const hasPending = EmailService.hasPendingVerification(email);
    
    return { verified, hasPending };
  }
}

// Export singleton instance
export default AuthService.getInstance();