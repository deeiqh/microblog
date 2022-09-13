import sgMail from "@sendgrid/mail";
import { EmailType } from "../utils/types";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export class SendgridService {
  static async sendEmail(data: EmailType) {
    return sgMail.send({
      ...data,
      from: process.env.SENDGRID_SENDER_EMAIL as string,
    });
  }
}
