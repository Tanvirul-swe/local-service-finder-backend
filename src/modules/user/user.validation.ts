import { z } from 'zod';
import { passwordRegex } from './user.utils';
export const createUserValidationSchema = z.object({
  name: z.string().min(3, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .regex(
      passwordRegex,
      'Password must be at least 6 characters and include one uppercase letter, one number, and one special character',
    ),
  avatarUrl: z.string().optional(),
});

export const updateUserValidationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z
    .string()
    .regex(
      passwordRegex,
      'Password must be at least 6 characters and include one uppercase letter, one number, and one special character',
    )
    .optional(),
  avatarUrl: z.string().optional(),
});

export const updateUserPasswordValidationSchema = z.object({
  currentPassword: z
    .string()
    .min(6, 'Current password must be at least 6 characters'),
  newPassword: z
    .string()
    .regex(
      passwordRegex,
      'New password must be at least 6 characters and include one uppercase letter, one number, and one special character',
    ),
});
