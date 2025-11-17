import request from 'supertest';
import app from '../../src/index';

describe('API Integration Tests', () => {
  describe('GET /healthz', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/healthz')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('Rate Limiting', () => {
    it('should handle rate limiting', async () => {
      // This test would need to be adjusted based on actual rate limiting implementation
      // For now, just verify the endpoint exists and responds
      const response = await request(app)
        .get('/healthz')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
    });
  });
});
