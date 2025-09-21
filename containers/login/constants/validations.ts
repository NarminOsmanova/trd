import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email tələb olunur')
    .email('Düzgün email formatı daxil edin'),
  password: z
    .string()
    .min(1, 'Şifrə tələb olunur')
    .min(6, 'Şifrə ən azı 6 simvol olmalıdır'),
  otp: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return /^\d{6}$/.test(val);
    }, 'OTP kodu 6 rəqəmli olmalıdır')
});

export const otpSchema = z.object({
  otp: z
    .string()
    .min(1, 'OTP kodu tələb olunur')
    .regex(/^\d{6}$/, 'OTP kodu 6 rəqəmli olmalıdır')
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
