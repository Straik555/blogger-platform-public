export const AuthConfigConstant = {
  acTime: 'AC_TIME',
  rtTime: 'RT_TIME',
  acSecret: 'AC_SECRET',
  rtSecret: 'RT_SECRET',
};

export type AuthConfigConstantVariables = Record<
  (typeof AuthConfigConstant)[keyof typeof AuthConfigConstant],
  string
>;
