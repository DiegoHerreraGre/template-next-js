import nodemailer from "nodemailer";
import { envs } from "@/config/envs.config";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = envs;
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export default transporter;
