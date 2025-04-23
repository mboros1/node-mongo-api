const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await User.deleteMany();
});

test('GET /users/:id returns user over age 21', async () => {
    const user = await User.create({ name: 'Alice', email: 'alice@email.com', age: 30 });

    const res = await request(app).get(`/users/${user._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Alice');
});

test('GET /users/:id returns 404 for underage user', async () => {
    const user = await User.create({ name: 'Bob', email: 'bob@email.com', age: 19 });

    const res = await request(app).get(`/users/${user._id}`);
    expect(res.statusCode).toBe(404);
});

test('GET /users/:id returns 400 for invalid ObjectId', async () => {
    const res = await request(app).get('/users/invalid_id');
    expect(res.statusCode).toBe(400);
});

