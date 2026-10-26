import { TemplateType } from '../../../src/modules/notifications/application/service/template.type';

type SendCall = [email: string, code: string, template: TemplateType];

/**
 * Replaces EmailConfirmationSenderService in tests: no real emails are sent,
 * but every call is recorded so tests can read confirmation / recovery codes.
 */
export const emailSenderMock = {
  send: jest.fn().mockResolvedValue(undefined),
};

const calls = (): SendCall[] => emailSenderMock.send.mock.calls as SendCall[];

export const getLastSentCode = (
  email: string,
  template: TemplateType,
): string => {
  const call = [...calls()]
    .reverse()
    .find(([to, , type]) => to === email && type === template);
  if (!call) {
    throw new Error(
      `No "${TemplateType[template]}" email was sent to ${email}`,
    );
  }
  return call[1];
};

export const resetEmailSenderMock = (): void => {
  emailSenderMock.send.mockClear();
};
