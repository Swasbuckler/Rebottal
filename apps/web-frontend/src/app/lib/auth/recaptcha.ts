export function getRecaptchaToken() {
  return new Promise<string>((resolve) => {
    grecaptcha.ready(async () => {
      const token = await grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, {
          action: 'submit'
        });
      resolve(token);
    })
  });
}