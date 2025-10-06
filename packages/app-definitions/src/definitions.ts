/*
*   Definitions for Auth
*/

import z from "zod";

const minUsernameLength = 3;
const maxUsernameLength = 128;
const minPasswordLength = 12;
const maxPasswordLength = 128;
const maxEmailLength = 320;

const passwordErrors = {
  minLength: 'Be at least 12 Characters', 
  lowercase: 'Include at least 1 Lowercase Letter',
  uppercase: 'Include at least 1 Uppercase Letter', 
  number: 'Include at least 1 Number', 
  special: 'Include at least 1 Special Character', 
};

export const passwordErrorsArray = Object.values(passwordErrors);

export const usernamaFormSchema = z.object({
  username: z
    .string({error: 'Please add a desired Username'})
    .trim()
    .min(minUsernameLength, {error: `Username must be at least ${minUsernameLength} Characters`})
    .max(maxUsernameLength, {error: `Username must not exceed ${maxUsernameLength} Characters`})
    .refine((value) => !(/[^a-zA-Z0-9]/.test(value)), {error: 'Username must not include Special Characters'}),
});

export const emailFormSchema = z.object({
  email: z
    .email({error: 'Please enter a valid Email'})
    .trim()
    .max(maxEmailLength, {error: `Email must not exceed ${maxEmailLength} Characters`}),
});

export const passwordFormSchema = z.object({
  password: z
    .string()
    .min(minPasswordLength, {error: passwordErrors.minLength})
    .max(maxPasswordLength, {error: `Password must not exceed ${maxPasswordLength} Characters`})
    .regex(/[a-z]/, {error: passwordErrors.lowercase})
    .regex(/[A-Z]/, {error: passwordErrors.uppercase})
    .regex(/[0-9]/, {error: passwordErrors.number})
    .regex(/[^a-zA-Z0-9 ]/, {error: passwordErrors.special}),
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  error: 'Passwords do not match',
  path: ['confirm'], 
});

export const signUpFormSchema = z.object({
  username: usernamaFormSchema.shape.username,
  email: emailFormSchema.shape.email,
  password: passwordFormSchema.shape.password,
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  error: 'Passwords do not match',
  path: ['confirm'], 
});

export type SignUpUser = z.infer<typeof signUpFormSchema>;

export const logInFormSchema = z.object({
  usernameOrEmail: z
    .string({error: 'Please enter your Username or Email'})
    .trim(),
  password: z
    .string({error: 'Please enter your Password'}),
  rememberMe: z
    .boolean({error: 'Enter proper Boolean'})
});

export type LogInUser = z.infer<typeof logInFormSchema>;

export const otpLength = 6;

export const submitOTPCodeSchema = z.object({
  email: emailFormSchema.shape.email,
  otpCode: z
    .string({error: 'Please enter the OTP code'})
    .length(otpLength, {error: `OTP code must be ${otpLength} Numbers long`})
    .refine((value) => /^\d+$/.test(value), {error: 'OTP must only include Numbers'}),
});

export type SubmitOTPCode = z.infer<typeof submitOTPCodeSchema>;

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

export type ErrorMessage = {
  cause: 'Prisma' | 'Server',
  code: string,
  message: string
};

export const GoogleSignInParty: string = 'auth-google-party';

/*
*   Definitions for User Table
*/

export const createUserSchema = z.object({
  username: signUpFormSchema.shape.username,
  email: signUpFormSchema.shape.email,
  password: signUpFormSchema.shape.password,
});

export type CreateUser = z.infer<typeof createUserSchema>;

const userRoleValues = ['USER', 'ADMIN_LEVEL_1', 'ADMIN_LEVEL_2'] as const;

export const createUserFullSchema = z.object({
  username: signUpFormSchema.shape.username,
  email: signUpFormSchema.shape.email,
  password: signUpFormSchema.shape.password
    .nullable(),
  verified: z
    .boolean({error: 'Enter proper boolean for Verified'}),
  role: z
    .enum(userRoleValues, {error: 'Provide valid Role'}),
});

export type CreateUserFull = z.infer<typeof createUserFullSchema>;

export type User = {
  uuid: string,
  createdAt: Date,
  username: string,
  email: string,
  password: string | null,
  verified: boolean,
  role: UserRole,
};

export type UserRole = typeof userRoleValues[number];

/*
*   Definitions for Refresh Token Table
*/

export const createRefreshTokenSchema = z.object({
  userUuid: z
    .uuid({error: 'Enter uuid for User'}),
  sub: z
    .uuid({error: 'Enter uuid for sub of Refresh Token'}),
  token: z
    .jwt({error: 'Enter valid JWT Token'}),
  rememberMe: z
    .boolean({error: 'Enter proper boolean for Remember Me'}),
  accessedAt: z
    .iso.datetime({error: 'Enter valid ISO DateTime'}),
  expiresAt: z
    .iso.datetime({error: 'Enter valid ISO DateTime'}) 
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

const otpPurposeValues = ['TWO_FACTOR', 'VERIFICATION', 'PASSWORD_RESET'] as const;

export const createOTPSchema = z.object({
  userUuid: z
    .uuid({error: 'Enter uuid for User'}),
  code: submitOTPCodeSchema.shape.otpCode,
  purpose: z
    .enum(otpPurposeValues, {error: 'Provide valid Purpose'}),
  createdAt: z
    .iso.datetime({error: 'Enter valid ISO DateTime for Created At'}),
  expiresAt: z
    .iso.datetime({error: 'Enter valid ISO DateTime for Expires At'}) 
});

export type OTP = {
  id: number,
  userUuid: string,
  code: string,
  purpose: OTPPurpose
  createdAt: Date, 
  expiresAt: Date,
};

export type OTPPurpose = typeof otpPurposeValues[number];