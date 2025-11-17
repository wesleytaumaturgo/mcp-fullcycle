import { AuthMiddleware, AuthenticatedRequest } from '../../src/tools/auth_middleware';
import { AuthenticationError, AuthorizationError } from '../../src/tools/errors';

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware;
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    authMiddleware = new AuthMiddleware();
    mockRequest = {
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('authenticate', () => {
    it('should call next for valid token', () => {
      const token = authMiddleware.generateToken('user123', 'user', ['read']);
      mockRequest.headers = { authorization: `Bearer ${token}` };

      authMiddleware.authenticate(mockRequest as AuthenticatedRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect((mockRequest as AuthenticatedRequest).user).toEqual({
        id: 'user123',
        role: 'user',
        permissions: ['read']
      });
    });

    it('should return 401 for missing token', () => {
      authMiddleware.authenticate(mockRequest as AuthenticatedRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token de autenticação obrigatório' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid token', () => {
      mockRequest.headers = { authorization: 'Bearer invalid-token' };

      authMiddleware.authenticate(mockRequest as AuthenticatedRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('authorize', () => {
    it('should call next for user with correct role', () => {
      mockRequest.user = { id: 'user123', role: 'admin', permissions: [] };
      const authorizeMiddleware = authMiddleware.authorize(['admin']);

      authorizeMiddleware(mockRequest as AuthenticatedRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 403 for user with incorrect role', () => {
      mockRequest.user = { id: 'user123', role: 'user', permissions: [] };
      const authorizeMiddleware = authMiddleware.authorize(['admin']);

      authorizeMiddleware(mockRequest as AuthenticatedRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Acesso negado - role insuficiente' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 for unauthenticated user', () => {
      const authorizeMiddleware = authMiddleware.authorize(['admin']);

      authorizeMiddleware(mockRequest as AuthenticatedRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Usuário não autenticado' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('rateLimit', () => {
    it('should call next for requests within limit', () => {
      const mockRequestWithIp = { ...mockRequest, ip: '127.0.0.1' } as any;
      const rateLimitMiddleware = authMiddleware.rateLimit(10, 60000);

      rateLimitMiddleware(mockRequestWithIp, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 429 when rate limit exceeded', () => {
      const mockRequestWithIp = { ...mockRequest, ip: '127.0.0.1' } as any;
      const rateLimitMiddleware = authMiddleware.rateLimit(1, 60000);

      // First request
      rateLimitMiddleware(mockRequestWithIp, mockResponse, mockNext);

      // Reset mock
      mockNext.mockClear();

      // Second request should be blocked
      rateLimitMiddleware(mockRequestWithIp, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(429);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Muitas requisições - rate limit excedido',
        retryAfter: expect.any(Number)
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('generateToken', () => {
    it('should generate valid JWT token', () => {
      const token = authMiddleware.generateToken('user123', 'user', ['read']);

      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });
});
