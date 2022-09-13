export type confirmUserEmailType = {
  email: string;
  user_id: string;
};

export type EmailType = {
  to: string;
  subject: string;
  text?: string;
  html: string;
};
