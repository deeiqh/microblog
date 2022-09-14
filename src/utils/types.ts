export type confirmUserEmailType = {
  email: string;
  userId: string;
};

export type EmailType = {
  to: string;
  subject: string;
  text?: string;
  html: string;
};
