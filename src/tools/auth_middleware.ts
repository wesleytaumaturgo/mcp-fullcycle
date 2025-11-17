import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from './logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    permissions: string[];
  };
}

export class AuthMiddleware {
  private jwtSecret = process.env.JWT_SECRET || 'mcp-fullcycle-secret-key';
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  /**
   * Middleware de autenticação JWT
   */
  authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Token de autenticação obrigatório' });
        return;
      }

      const token = authHeader.substring(7);
      console.log('DEBUG: Token received:', token.substring(0, 20) + '...');
      console.log('DEBUG: JWT Secret:', this.jwtSecret);

      const decoded = jwt.verify(token, this.jwtSecret) as any;
      console.log('DEBUG: Token decoded successfully:', { id: decoded.id, role: decoded.role });

      req.user = {
        id: decoded.id,
        role: decoded.role,
        permissions: decoded.permissions || []
      };

      next();
    } catch (error) {
      console.log('DEBUG: JWT verification failed:', error.message);
      logger.error(error as Error, 'Erro na autenticação JWT');
      res.status(401).json({ error: 'Token inválido ou expirado' });
    }
  }

  /**
   * Middleware de controle de acesso baseado em roles
   */
  authorize(roles: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({ error: 'Acesso negado - role insuficiente' });
        return;
      }

      next();
    };
  }

  /**
   * Middleware de rate limiting
   */
  rateLimit(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const key = req.ip || 'unknown';
      const now = Date.now();
      const windowData = this.rateLimitMap.get(key);

      if (!windowData || now > windowData.resetTime) {
        this.rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
        next();
        return;
      }

      if (windowData.count >= maxRequests) {
        res.status(429).json({
          error: 'Muitas requisições - rate limit excedido',
          retryAfter: Math.ceil((windowData.resetTime - now) / 1000)
        });
        return;
      }

      windowData.count++;
      next();
    };
  }

  /**
   * Gera token JWT
   */
  generateToken(userId: string, role: string, permissions: string[] = []): string {
    return jwt.sign(
      {
        id: userId,
        role,
        permissions
      },
      this.jwtSecret,
      { expiresIn: '24h' }
    );
  }
}
