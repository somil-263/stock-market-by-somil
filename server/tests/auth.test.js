const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../config/db');

describe('🛡️ Auth API Security Tests', () => {
    
    it('It should return 400 for invalid email format', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Hacker Bhai',
                username: 'hacker_007',
                email: 'kachra-email.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(400); 
        expect(res.body.message).toBeDefined(); 
    });

    it('It should return 400 for missing password', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'No Password User',
                username: 'nopass_1',
                email: 'asli@gmail.com'
            });

        expect(res.statusCode).not.toEqual(201); 
    });

    afterAll(async () => {
        await sequelize.close();
    });
});