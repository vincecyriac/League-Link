const request = require('supertest');
const app = require('../app');
const userService = require("../services/users.service");
const { compareSync } = require("bcrypt");

jest.mock('../services/users.service');
jest.mock('bcrypt');

describe('login', () => {
  test('returns 400 status code if email is missing', async () => {
    const response = await request(app).post('/login').send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('please enter an email');
  });

  test('returns 403 status code if user does not exist', async () => {
    userService.getUserByEmail.mockResolvedValue(null);

    const response = await request(app)
      .post('/login')
      .send({ email: 'nonexistinguser@example.com', password: 'password' });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Invalid Credentials');
  });

  test('returns 403 status code if password is invalid', async () => {

    compareSync.mockReturnValue(false);

    const response = await request(app)
      .post('/login')
      .send({ email: 'admin@leaguelink.com', password: 'invalidpassword' });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Invalid Credentials');
  });

  test('returns JWT access and refresh token if login is successful', async () => {
    userService.getUserByEmail.mockResolvedValue({
      id: 1,
      name: 'Vince Cyriac',
      email: 'admin@leaguelink.com',
      password: '$2b$10$27ejVWQw98FAP80fG2Cu0ucJ/PKHlgmra40wAVWfQjs4Yksdz9Yky',
      status: 1,
      created_at: "2022-12-19T12:15:39.000Z",
      updated_at: "2022-12-19T12:15:39.000Z"
    });

    compareSync.mockReturnValue(true);

    const response = await request(app)
      .post('/login')
      .send({ email: 'admin@leaguelink.com', password: 'Admin@1234' });

    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });
});
