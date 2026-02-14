import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';
import { fileURLToPath } from 'url';
import { configService } from './config-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class EmailService {
  private resend: Resend;
  private companyName: string;
  private companyLogoUrl: string;
  private privacyPolicyUrl: string;
  private termsOfServiceUrl: string;

  constructor() {
    this.resend = new Resend(configService.resendApiKey);
    this.companyName = configService.appName;
    this.companyLogoUrl = configService.companyLogoUrl;
    this.privacyPolicyUrl = configService.privacyPolicyUrl;
    this.termsOfServiceUrl = configService.termsOfServiceUrl;
    this.testConnection();
  }

  private async testConnection() {
    try {
      await this.resend.apiKeys.list();
      console.log('Resend email service connected successfully');
    } catch (error: any) {
      console.error('Resend connection error:', error.message);
    }
  }

  public async sendVerificationOTP(userEmail: string, otp: string) {
    try {
      const templatePath = path.join(__dirname, '..', 'templates', 'otpVerification.html');
      let emailHtmlBody = fs.readFileSync(templatePath, 'utf8');

      emailHtmlBody = emailHtmlBody.replace(/{{COMPANY_NAME}}/g, this.companyName);
      emailHtmlBody = emailHtmlBody.replace(/{{COMPANY_LOGO_URL}}/g, this.companyLogoUrl);
      emailHtmlBody = emailHtmlBody.replace(/{{OTP_CODE}}/g, otp);
      emailHtmlBody = emailHtmlBody.replace(/\[Link to your privacy policy\]/g, this.privacyPolicyUrl);
      emailHtmlBody = emailHtmlBody.replace(/\[Link to your terms of service\]/g, this.termsOfServiceUrl);

      const { data, error } = await this.resend.emails.send({
        from: 'Cravo <noreply@cravo.online>',
        to: userEmail,
        subject: `Your ${this.companyName} Verification Code`,
        html: emailHtmlBody,
      });

      if (error) {
        console.error(`Error sending OTP to ${userEmail}:`, error);
        throw error;
      }

      console.log(`Verification OTP sent to ${userEmail} (ID: ${data?.id})`);
      return data;
    } catch (error) {
      console.error(`Error sending OTP to ${userEmail}:`, error);
      throw error;
    }
  }

  public async sendVerificationEmail(userEmail: string, verificationLink: string) {
    try {
      const templatePath = path.join(__dirname, '..', 'templates', 'emailVerification.html');
      let emailHtmlBody = fs.readFileSync(templatePath, 'utf8');

      emailHtmlBody = emailHtmlBody.replace(/{{COMPANY_NAME}}/g, this.companyName);
      emailHtmlBody = emailHtmlBody.replace(/{{COMPANY_LOGO_URL}}/g, this.companyLogoUrl);
      emailHtmlBody = emailHtmlBody.replace(/{{VERIFICATION_LINK}}/g, verificationLink);
      emailHtmlBody = emailHtmlBody.replace(/\[Link to your privacy policy\]/g, this.privacyPolicyUrl);
      emailHtmlBody = emailHtmlBody.replace(/\[Link to your terms of service\]/g, this.termsOfServiceUrl);

      const { data, error } = await this.resend.emails.send({
        from: 'Cravo <noreply@cravo.online>',
        to: userEmail,
        subject: `Verify Your Account for ${this.companyName}!`,
        html: emailHtmlBody,
      });

      if (error) {
        console.error(`Error sending verification email to ${userEmail}:`, error);
        throw error;
      }

      console.log(`Verification email sent to ${userEmail} (ID: ${data?.id})`);
      return data;
    } catch (error) {
      console.error(`Error sending verification email to ${userEmail}:`, error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
