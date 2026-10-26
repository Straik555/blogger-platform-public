import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailExamples {
  registrationEmail(this: void, code: string) {
    return ` <h1>Thanks for your registration</h1>
               <p>To finish registration, please follow the link below:<br>
                  <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
              </p>`;
  }
  recoverPasswordEmail(this: void, code: string) {
    return ` <h1>Recover your password</h1>
               <p>To recover your password, please follow the link below:<br>
                  <a href='https://somesite.com/recover-password?code=${code}'>recover password</a>
              </p>`;
  }
}
