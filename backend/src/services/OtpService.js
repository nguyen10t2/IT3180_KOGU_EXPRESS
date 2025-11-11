import { Otp } from '../models/Otp.js';
import argon2 from 'argon2';

const OTP_TTL = 10 * 60 * 1000;

export const OtpService = {
    async createOtp() {
        const plain_otp = Otp.generateOtp();
        const otp = await argon2.hash(plain_otp);
        const expires_at = new Date(Date.now() + OTP_TTL);
        return { plain_otp, otp, expires_at };
    },
};