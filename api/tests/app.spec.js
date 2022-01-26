const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);

describe('/*', () => {
  describe('ERROR HANDLING', () => {
    it('Return 404 Invalid routes', () => request
      .get('/invalid')
      .expect(404)
      .then(({ body: { message } }) => expect(message).toBe('Route Not Found.')));
    it('Return 404 Root Route', () => request
      .get('/')
      .expect(404)
      .then(({ body: { message } }) => expect(message).toBe('Route Not Found.')));
  });
});
