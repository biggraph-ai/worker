const express = require('express');
const listEndpoints = require('express-list-endpoints');
const swaggerUi = require('swagger-ui-express');
const { buildOpenApiSpec } = require('../services/openapi');

const router = express.Router();

const getEndpoints = (app) => {
  const appEndpoints = listEndpoints(app);
  if (appEndpoints.length > 0) {
    return appEndpoints;
  }

  if (app?.router) {
    return listEndpoints(app.router);
  }

  return appEndpoints;
};

const buildSpec = (req) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const endpoints = getEndpoints(req.app);
  console.log('[openapi] endpoints', endpoints);
  return buildOpenApiSpec({ serverUrl: baseUrl, endpoints });
};

router.get('/openapi.json', (req, res) => {
  res.json(buildSpec(req));
});

router.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: {
      url: '/api/openapi.json',
    },
    customSiteTitle: 'LibreChat API Docs',
  }),
);

module.exports = router;
