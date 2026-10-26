import { Response } from 'supertest';

type ErrorsBody = { errorsMessages: { message: string; field: string }[] };

/**
 * Checks the standard 400 body: `{ errorsMessages: [{ message, field }] }`
 * and that exactly the expected fields are reported (order does not matter).
 */
export const expectValidationErrors = (
  response: Response,
  fields: string[],
): void => {
  const body = response.body as ErrorsBody;
  expect(body).toEqual({
    errorsMessages: expect.any(Array) as unknown,
  });
  body.errorsMessages.forEach((error) => {
    expect(error).toEqual({
      message: expect.any(String) as unknown,
      field: expect.any(String) as unknown,
    });
  });
  const actual = body.errorsMessages.map((e) => e.field).sort();
  expect(actual).toEqual([...fields].sort());
};
