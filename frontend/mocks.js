import { rest } from 'msw';

export const handlers = [
  rest.post('http://localhost:5000/auth/register', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'Registration successful' }));
  }),
];