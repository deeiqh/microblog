import { faker } from "@faker-js/faker";
import { SendgridService } from "./sendgrid.service";

jest.mock("@sendgrid/mail", () => {
  return {
    setApiKey: jest.fn(),
    send: jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          statusCode: 200,
          headers: {},
          body: "",
        },
      ])
    ),
  };
});

describe("SendgridService", () => {
  describe("sendEmail", () => {
    it("should send an email", async () => {
      const to = faker.internet.email();
      const text = faker.lorem.words();
      const subject = faker.lorem.word();

      const result = await SendgridService.sendEmail({
        to,
        html: text,
        text,
        subject,
      });

      expect(result).toMatchSnapshot();
    });
  });
});
