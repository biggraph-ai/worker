const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { buildOpenApiSpec } = require('../services/openapi');

const router = express.Router();

router.get('/openapi.json', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.json(buildOpenApiSpec(baseUrl));
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
