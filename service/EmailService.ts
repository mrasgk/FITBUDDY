// Email Service for handling email verification and related functionality
export interface EmailVerificationResponse {
  success: boolean;
  message?: string;
  expiresIn?: number;
}

export interface ResendCodeResponse {
  success: boolean;
  message?: string;
  waitTime?: number;
}

class EmailService {
  private static instance: EmailService;
  private verificationCodes: Map<string, { code: string; expiresAt: Date; attempts: number }> = new Map();
  private lastSentTimes: Map<string, Date> = new Map();

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Generate a random 6-digit verification code
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Simulate network delay
  private async simulateNetworkDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  }

  // Send verification code to email
  public async sendVerificationCode(email: string): Promise<EmailVerificationResponse> {
    try {
      await this.simulateNetworkDelay();

      // Check if we can send (rate limiting)
      const lastSent = this.lastSentTimes.get(email.toLowerCase());
      if (lastSent && Date.now() - lastSent.getTime() < 60000) { // 1 minute rate limit
        const waitTime = Math.ceil((60000 - (Date.now() - lastSent.getTime())) / 1000);
        return {
          success: false,
          message: `Please wait ${waitTime} seconds before requesting another code`
        };
      }

      // Generate and store verification code
      const code = this.generateVerificationCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

      this.verificationCodes.set(email.toLowerCase(), {
        code,
        expiresAt,
        attempts: 0
      });

      this.lastSentTimes.set(email.toLowerCase(), new Date());

      // In a real app, this would send an actual email
      console.log(`[EMAIL SERVICE] Verification code for ${email}: ${code}`);

      return {
        success: true,
        message: 'Verification code sent successfully',
        expiresIn: 15 * 60 // 15 minutes in seconds
      };

    } catch (error) {
      console.error('Send verification code error:', error);
      return {
        success: false,
        message: 'Failed to send verification code. Please try again.'
      };
    }
  }

  // Verify email with provided code
  public async verifyEmail(email: string, code: string): Promise<EmailVerificationResponse> {
    try {
      await this.simulateNetworkDelay();

      const emailKey = email.toLowerCase();
      const storedData = this.verificationCodes.get(emailKey);

      if (!storedData) {
        return {
          success: false,
          message: 'No verification code found. Please request a new code.'
        };
      }

      // Check if code has expired
      if (Date.now() > storedData.expiresAt.getTime()) {
        this.verificationCodes.delete(emailKey);
        return {
          success: false,
          message: 'Verification code has expired. Please request a new code.'
        };
      }

      // Check attempts limit
      if (storedData.attempts >= 5) {
        this.verificationCodes.delete(emailKey);
        return {
          success: false,
          message: 'Too many failed attempts. Please request a new code.'
        };
      }

      // Verify the code
      if (storedData.code !== code) {
        storedData.attempts++;
        this.verificationCodes.set(emailKey, storedData);
        
        const remainingAttempts = 5 - storedData.attempts;
        return {
          success: false,
          message: `Invalid verification code. ${remainingAttempts} attempts remaining.`
        };
      }

      // Success - remove the code
      this.verificationCodes.delete(emailKey);
      this.lastSentTimes.delete(emailKey);

      return {
        success: true,
        message: 'Email verified successfully!'
      };

    } catch (error) {
      console.error('Verify email error:', error);
      return {
        success: false,
        message: 'Failed to verify email. Please try again.'
      };
    }
  }

  // Resend verification code
  public async resendVerificationCode(email: string): Promise<ResendCodeResponse> {
    try {
      // Check rate limiting
      const lastSent = this.lastSentTimes.get(email.toLowerCase());
      if (lastSent && Date.now() - lastSent.getTime() < 60000) { // 1 minute rate limit
        const waitTime = Math.ceil((60000 - (Date.now() - lastSent.getTime())) / 1000);
        return {
          success: false,
          message: `Please wait ${waitTime} seconds before requesting another code`,
          waitTime
        };
      }

      // Clear existing code and send new one
      this.verificationCodes.delete(email.toLowerCase());
      const response = await this.sendVerificationCode(email);
      
      return {
        success: response.success,
        message: response.message
      };

    } catch (error) {
      console.error('Resend verification code error:', error);
      return {
        success: false,
        message: 'Failed to resend verification code. Please try again.'
      };
    }
  }

  // Check if email has pending verification
  public hasPendingVerification(email: string): boolean {
    const storedData = this.verificationCodes.get(email.toLowerCase());
    if (!storedData) return false;
    
    // Check if not expired
    return Date.now() <= storedData.expiresAt.getTime();
  }

  // Get remaining time for verification code
  public getRemainingTime(email: string): number {
    const storedData = this.verificationCodes.get(email.toLowerCase());
    if (!storedData) return 0;
    
    const remaining = storedData.expiresAt.getTime() - Date.now();
    return Math.max(0, Math.ceil(remaining / 1000));
  }

  // Clear all verification data for an email
  public clearVerificationData(email: string): void {
    const emailKey = email.toLowerCase();
    this.verificationCodes.delete(emailKey);
    this.lastSentTimes.delete(emailKey);
  }

  // Send password reset email
  public async sendPasswordResetEmail(email: string): Promise<EmailVerificationResponse> {
    try {
      await this.simulateNetworkDelay();

      // Check rate limiting
      const lastSent = this.lastSentTimes.get(`reset_${email.toLowerCase()}`);
      if (lastSent && Date.now() - lastSent.getTime() < 120000) { // 2 minutes rate limit for password reset
        const waitTime = Math.ceil((120000 - (Date.now() - lastSent.getTime())) / 1000);
        return {
          success: false,
          message: `Please wait ${Math.ceil(waitTime / 60)} minutes before requesting another password reset`
        };
      }

      // Generate reset token (in real app, this would be a secure token)
      const resetToken = this.generateVerificationCode() + this.generateVerificationCode(); // 12 digit token
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes expiry

      this.verificationCodes.set(`reset_${email.toLowerCase()}`, {
        code: resetToken,
        expiresAt,
        attempts: 0
      });

      this.lastSentTimes.set(`reset_${email.toLowerCase()}`, new Date());

      // In a real app, this would send an actual email with reset link
      console.log(`[EMAIL SERVICE] Password reset token for ${email}: ${resetToken}`);

      return {
        success: true,
        message: 'Password reset instructions sent to your email',
        expiresIn: 30 * 60 // 30 minutes in seconds
      };

    } catch (error) {
      console.error('Send password reset email error:', error);
      return {
        success: false,
        message: 'Failed to send password reset email. Please try again.'
      };
    }
  }

  // Verify password reset token
  public async verifyPasswordResetToken(email: string, token: string): Promise<EmailVerificationResponse> {
    try {
      await this.simulateNetworkDelay();

      const resetKey = `reset_${email.toLowerCase()}`;
      const storedData = this.verificationCodes.get(resetKey);

      if (!storedData) {
        return {
          success: false,
          message: 'Invalid or expired reset token. Please request a new password reset.'
        };
      }

      // Check if token has expired
      if (Date.now() > storedData.expiresAt.getTime()) {
        this.verificationCodes.delete(resetKey);
        return {
          success: false,
          message: 'Reset token has expired. Please request a new password reset.'
        };
      }

      // Verify the token
      if (storedData.code !== token) {
        storedData.attempts++;
        this.verificationCodes.set(resetKey, storedData);
        
        if (storedData.attempts >= 3) {
          this.verificationCodes.delete(resetKey);
          return {
            success: false,
            message: 'Too many failed attempts. Please request a new password reset.'
          };
        }

        return {
          success: false,
          message: 'Invalid reset token. Please check and try again.'
        };
      }

      // Success - keep the token for password update, but mark as verified
      storedData.attempts = -1; // Mark as verified
      this.verificationCodes.set(resetKey, storedData);

      return {
        success: true,
        message: 'Reset token verified successfully!'
      };

    } catch (error) {
      console.error('Verify password reset token error:', error);
      return {
        success: false,
        message: 'Failed to verify reset token. Please try again.'
      };
    }
  }

  // Send welcome email after successful registration
  public async sendWelcomeEmail(email: string, firstName: string): Promise<EmailVerificationResponse> {
    try {
      await this.simulateNetworkDelay();

      // In a real app, this would send a welcome email template
      console.log(`[EMAIL SERVICE] Welcome email sent to ${firstName} at ${email}`);

      return {
        success: true,
        message: 'Welcome email sent successfully!'
      };

    } catch (error) {
      console.error('Send welcome email error:', error);
      return {
        success: false,
        message: 'Failed to send welcome email.'
      };
    }
  }

  // Get all active verification codes (for development/testing)
  public getActiveVerifications(): Array<{ email: string; code: string; expiresAt: Date; attempts: number }> {
    const active: Array<{ email: string; code: string; expiresAt: Date; attempts: number }> = [];
    
    this.verificationCodes.forEach((data, email) => {
      if (Date.now() <= data.expiresAt.getTime()) {
        active.push({
          email: email.replace('reset_', ''),
          code: data.code,
          expiresAt: data.expiresAt,
          attempts: data.attempts
        });
      }
    });
    
    return active;
  }
}

// Export singleton instance
export default EmailService.getInstance();