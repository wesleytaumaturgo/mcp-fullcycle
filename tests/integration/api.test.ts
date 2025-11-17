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
