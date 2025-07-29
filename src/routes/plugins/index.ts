import express, { Router } from 'express';
import { discoverNpmPackages, discoverUrlPackages } from '@/hooks';
import { Plugin } from '@/models/plugins';
const router: Router = express.Router();

router.get('/discover', async function (req, res, next) {
  switch (req.query.source) {
    case 'npm': {
      const plugin = await discoverNpmPackages(req.query);
      res.json(plugin);
      return;
    }
    case 'url': {
      const plugin = await discoverUrlPackages(req.query);
      res.json(plugin);
      return;
    }
  }
});

router.get('/list', async function (req, res, next) {
  const plugins = await Plugin.findAll();
  res.json(plugins);
});

export function usePluginsRoutes(app: any) {
  app.use('/plugins', router);
}

// https://www.npmjs.com/package/@rubick-extra/io-tools?activeTab=readme
