import express, { Router } from 'express';

const router: Router = express.Router();

/* GET home page. */
router.get('/discover', function(req, res, next) {
  res.send('Discover');
});

export function usePluginsRoutes(app: any) {
  app.use('/plugins', router);
}
