import { SendgridService } from "../services/sendgrid.service";
import { TokenService } from "../services/token.service";
import { confirmUserEmailType } from "../utils/types";

export const CONFIRM_USER_EMAIL = "CONFIRM_USER_EMAIL";

export async function confirmUserEmailEvent({
  user_id,
  email,
}: confirmUserEmailType): Promise<void> {
  try {
    const tokenDto = await TokenService.generateTokenDto(
      user_id,
      process.env.JWT_EMAIL_CONFIRMATION_EXPIRATION_TIME,
      process.env.JWT_EMAIL_CONFIRMATION_SECRET
    );
    const expiration = new Date(tokenDto.expiration).toUTCString();

    try {
      await SendgridService.sendEmail({
        to: email,
        subject: "Confirm Account",
        text: "Please, confirm your account",
        html: `<strong>Token: ${JSON.stringify({
          ...tokenDto,
          expiration,
        })}</strong>`,
      });
    } catch (error) {
      console.error("Send email error\n", error);
    }
  } catch (error) {
    console.error("Generate token error\n", error);
  }
}
