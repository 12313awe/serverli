import { Router, Request, Response } from 'express';
import { logger } from '@/utils/logger';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: process.memoryUsage(),
  };

  logger.info('Health check requested');
  res.status(200).json(healthCheck);
});

router.get('/ready', (req: Request, res: Response) => {
  // Add any readiness checks here (database connections, external services, etc.)
  const readinessCheck = {
    status: 'READY',
    timestamp: new Date().toISOString(),
    services: {
      langflow: process.env.LANGFLOW_BASE_URL ? 'configured' : 'not configured',
    },
  };

  res.status(200).json(readinessCheck);
});

export default router;