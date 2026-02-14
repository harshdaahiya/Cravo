import Razorpay from 'razorpay';
import { configService } from '../services/config-service.js';

const keyId = configService.razorpayKeyId;
const keySecret = configService.razorpayKeySecret;

if (!keyId || !keySecret) {
  console.error(
    'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not defined in environment variables.'
  );
}

export const razorpayInstance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});
