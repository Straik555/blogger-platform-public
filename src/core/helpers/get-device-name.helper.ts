import { Request } from 'express';
import { UAParser } from 'ua-parser-js';

export const getDeviceNameUtils = (req: Request): string => {
  const parser = new UAParser(req.headers['user-agent']);

  const browser = parser.getBrowser();
  const os = parser.getOS();
  const ua = parser.getUA();
  const browserPart = browser.version
    ? `${browser.name} ${browser.version}`
    : browser.name;
  return (
    browser.name && os.name
      ? `${browserPart} • ${os.name}`
      : ua || 'Unknown device'
  ).slice(0, 255);
};
