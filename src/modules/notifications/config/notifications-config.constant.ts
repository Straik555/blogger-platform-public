export const NotificationsConfigConstant = {
  email: 'EMAIL',
  emailPass: 'EMAIL_PASS',
} as const;

export type NotificationsConfigConstantVariables = Record<
  (typeof NotificationsConfigConstant)[keyof typeof NotificationsConfigConstant],
  string
>;
