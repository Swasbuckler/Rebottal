import z from "zod";

export type User = {
  id: number,
  uuid: string,
  createdAt: Date,
  username: string,
  email: string,
  password: string,
  isAdmin: boolean,
};

export type CheckValue = {
  value: any;
}

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
});

export type LogInUser = z.infer<typeof logInFormSchema>;
