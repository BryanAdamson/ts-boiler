import {clearDatabase, dropDatabase, connectDatabase} from "../index";
import supertest from 'supertest'
import User, {UserDocument} from "../../src/models/User";
import app from "../../src/configs/App";

const request: supertest.SuperTest<supertest.Test> = supertest(app);

beforeAll(async () => {
    await connectDatabase();
})

afterAll(async () => {
    await dropDatabase()
});

describe('Sign up route', () => {
    afterEach(async () => {
        await clearDatabase()
    });

    test('returns 201, and creates a user', async () => {
        const body = {
            email: "test@example.com",
            password: "Password1!",
            type: "admin"
        };

        const res = await request.post('/api/auth/sign-up')
            .send(body);

        const message = res.body.message;
        const data = res.body.data;

        const user = await User.findOne({email: "test@example.com"});

        expect(data.user.id).toBe(user?.id);

        expect(res.statusCode).toBe(201);
        expect(message).toBe('signup successful');
    });


    test('returns 400, and fails to create a user, if request is malformed', async () => {
        const body = {
            email: "test@example.com",
            type: "admin"
        };

        const res = await request.post('/api/auth/sign-up')
            .send(body);

        const message = res.body.message;
        const error = res.body.error;

        const user = await User.findOne({email: "test@example.com"});

        expect(user).toBe(null);
        expect(error.password.path).toBe("password");
        expect(res.statusCode).toBe(400);
        expect(message).toBe('validation error');
    });

    test('returns 400, and fails to create a user, if email is taken', async () => {
        const body = {
            email: "test@example.com",
            password: "Password1!",
            type: "admin"
        };

        await User.create(body);

        const res = await request.post('/api/auth/sign-up')
            .send(body);

        const message = res.body.message;
        const error = res.body.error;

        expect(error.email.path).toBe("email");
        expect(res.statusCode).toBe(400);
        expect(message).toBe('validation error');
    });
})

describe('Sign in route', () => {
    let user: UserDocument;

    beforeEach(async () => {
        const body = {
            email: "test@example.com",
            password: "Password1!",
            type: "admin"
        };

        user = await User.create(body);
    });

    afterEach(async () => {
        await clearDatabase()
    });

    test('returns 200, and returns a token', async () => {
        const body = {
            email: "test@example.com",
            password: "Password1!",
        };

        const res = await request.post('/api/auth/sign-in')
            .send(body);

        const message = res.body.message;
        const data = res.body.data;

        const testUser = await User.findOne({email: "test@example.com"});

        expect(data.user.id).toBe(user.id);
        expect(data.token).toStrictEqual(expect.stringContaining("ey"));
        expect(data.token).toBe(testUser?.token);
        expect(res.statusCode).toBe(200);
        expect(message).toBe('signin successful');
    });

    test('returns 400, and fails to return token, if request is malformed', async () => {
        const body = {
            email: "test@example.com",
        };

        const res = await request.post('/api/auth/sign-in')
            .send(body);

        const message = res.body.message;
        const error = res.body.error;

        expect(error.password.path).toBe("password");
        expect(res.statusCode).toBe(400);
        expect(message).toBe('validation error');
    });

    test('returns 401, and fails to return token, if credentials are invalid', async () => {
        const body = {
            email: "test1@example.com",
            password: "Password1!"
        };

        const res = await request.post('/api/auth/sign-in')
            .send(body);

        const message = res.body.message;

        expect(res.statusCode).toBe(401);
        expect(message).toBe('unauthorized');
    });

    test('returns 403, and fails to return token, if email is taken', async () => {
        const body = {
            email: "test@example.com",
            password: "Password1!"
        };

        user.isSuspended = true;
        await user.save();

        const res = await request.post('/api/auth/sign-in')
            .send(body);

        const message = res.body.message;

        expect(res.statusCode).toBe(403);
        expect(message).toBe('forbidden');
    });
})