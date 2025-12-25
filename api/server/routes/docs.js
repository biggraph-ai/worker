const express = require('express');
const listEndpoints = require('express-list-endpoints');
const swaggerUi = require('swagger-ui-express');
const { buildOpenApiSpec } = require('../services/openapi');

const router = express.Router();

const buildSpec = (req) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const endpoints = listEndpoints(req.app);
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
