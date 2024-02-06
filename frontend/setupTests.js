import { server } from './mocks/mockServer';

beforeAll(() => server.listen());

afterAll(() => server.close());
