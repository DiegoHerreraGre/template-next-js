import dotenv from "dotenv";

dotenv.config();

export const envs = {
  SUPABASE_PASSWORD: process.env.SUPABASE_PASSWORD,
  SUPABASE_URI: process.env.SUPABASE_URI,
  SUPABASE_API: process.env.SUPABASE_API,
  JWT_SECRET: process.env.JWT_SECRET,
  SMTP_MAIL: process.env.SMTP_MAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  RECAPTCHA_PUBLIC_KEY: process.env.RECAPTCHA_PUBLIC_KEY,
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
};
