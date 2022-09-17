import { SendgridService } from "../services/sendgrid.service";
import { TokenService } from "../services/token.service";
import { TokenActivity } from "../utils/enums";
import { confirmUserEmailType } from "../utils/types/email.type";

export const CONFIRM_USER_EMAIL = "CONFIRM_USER_EMAIL";

export async function confirmUserEmailEvent({
  userId,
  email,
}: confirmUserEmailType): Promise<void> {
  try {
    const tokenDto = await TokenService.generateTokenDto(
      userId,
      TokenActivity.RESET_PASSWORD,
      process.env.JWT_EMAIL_CONFIRMATION_EXPIRATION_TIME_MINUTES,
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
