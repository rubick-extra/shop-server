import express, { Router } from 'express';
import { discoverNpmPackages } from '@/hooks';

const router: Router = express.Router();

router.get('/discover', async function(req, res, next) {
  switch (req.query.source) {
    case 'npm':
      const plugin = await discoverNpmPackages(req.query);
      res.json(plugin);
      return next();
  }
});

export function usePluginsRoutes(app: any) {
  app.use('/plugins', router);
}

// https://www.npmjs.com/package/@rubick-extra/io-tools?activeTab=readme