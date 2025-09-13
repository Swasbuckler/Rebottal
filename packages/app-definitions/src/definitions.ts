/*
*   Definitions for Auth
*/

import z from "zod";

const minUsernameLength = 3;
const maxUsernameLength = 128;
const minPasswordLength = 12;

const passwordErrors = {
  minLength: 'Be at least 12 Characters', 
  lowercase: 'Include at least 1 Lowercase Letter',
  uppercase: 'Include at least 1 Uppercase Letter', 
  number: 'Include at least 1 Number', 
  special: 'Include at least 1 Special Character', 
};

export const passwordErrorsArray = Object.values(passwordErrors);

export const signUpFormSchema = z.object({
  username: z
    .string({error: 'Please add a desired Username'})
    .trim()
    .min(minUsernameLength, {error: 'Username must be at least 3 Characters'})
    .max(maxUsernameLength, {error: 'Username must not exceed 128 Characters'})
    .refine((value) => !(/[^a-zA-Z0-9]/.test(value)), {error: 'Username must not include Special Characters'}),
  email: z
    .email({error: 'Please enter a valid Email'})
    .trim(),
  password: z
    .string()
    .min(minPasswordLength, {error: passwordErrors.minLength})
    .regex(/[a-z]/, {error: passwordErrors.lowercase})
    .regex(/[A-Z]/, {error: passwordErrors.uppercase})
    .regex(/[0-9]/, {error: passwordErrors.number})
    .regex(/[^a-zA-Z0-9 ]/, {error: passwordErrors.special}),
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  error: 'Passwords do not match',
  path: ['confirm'], 
});

export type SignUpUser = z.infer<typeof signUpFormSchema>;

export const createUserSchema = z.object({
  username: signUpFormSchema.shape.username,
  email: signUpFormSchema.shape.email,
  password: signUpFormSchema.shape.password,
});

export type CreateUser = z.infer<typeof createUserSchema>;

export const logInFormSchema = z.object({
  usernameOrEmail: z
    .string()
    .trim(),
  password: z
    .string(),
  rememberMe: z
    .boolean()
});

export type LogInUser = z.infer<typeof logInFormSchema>;

export type CheckData = {
  value: string;
}

export type CookieAttributes = {
  name: string,
  value: string,
  domain?: string,
  expires?: Date | number,
  httpOnly?: boolean,
  maxAge?: number,
  partitioned?: boolean,
  path?: string,
  sameSite?: boolean | "lax" | "strict" | "none",
  secure?: boolean
};

/*
*   Definitions for User Table
*/

export type User = {
  uuid: string,
  createdAt: Date,
  username: string,
  email: string,
  password: string,
  verified: boolean,
  role: Role,
};

export type Role = 'USER' | 'ADMIN_LEVEL_1' | 'ADMIN_LEVEL_2';

/*
*   Definitions for Refresh Token Table
*/

export const createRefreshTokenSchema = z.object({
  userUuid: z
    .uuid(),
  sub: z
    .uuid(),
  token: z
    .string(),
  rememberMe: z
    .boolean(),
  accessedAt: z
    .iso.datetime(),
  expiresAt: z
    .iso.datetime() 
});

export type RefreshToken = {
  id: number,
  userUuid: string,
  sub: string,
  token: string,
  rememberMe: boolean,
  accessedAt: Date,
  expiresAt: Date,
};

/*
*   Definitions for OTP Table
*/

const purposeValues = ['VERIFICATION', 'PASSWORD_RESET'] as const;

export const createOTPSchema = z.object({
  userUuid: z
    .uuid(),
  code: z
    .string()
    .max(6),
  purpose: z
    .enum(purposeValues),
  createdAt: z
    .iso.datetime(),
  expiresAt: z
    .iso.datetime() 
});

export type OTP = {
  id: number,
  userUuid: string,
  code: string,
  purpose: Purpose
  createdAt: Date, 
  expiresAt: Date,
};

export type Purpose = typeof purposeValues[number];