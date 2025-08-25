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
  space: 'Must not include Spaces'
};

export const passwordErrorsArray = Object.values(passwordErrors);

export const signUpFormSchema = z.object({
  username: z
    .string({error: 'Please add a desired Username'})
    .trim()
    .min(minUsernameLength, {error: 'Username must be at least 3 Characters'})
    .max(maxUsernameLength, {error: 'Username must not exceed 128 Characters'})
    .refine((username) => !username.includes(' '), {error: 'Username must not include Spaces'}),
  email: z
    .email({error: 'Please enter a valid Email'})
    .trim(),
  password: z
    .string()
    .min(minPasswordLength, {error: passwordErrors.minLength})
    .regex(/[a-z]/, {error: passwordErrors.lowercase})
    .regex(/[A-Z]/, {error: passwordErrors.uppercase})
    .regex(/[0-9]/, {error: passwordErrors.number})
    .regex(/[^a-zA-Z0-9 ]/, {error: passwordErrors.special})
    .refine((password) => !password.includes(' '), {error: passwordErrors.space}),
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  error: 'Passwords do not match',
  path: ['confirm'], 
});

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;
