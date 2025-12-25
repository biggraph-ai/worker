const path = require('path');

const packageJson = require(path.resolve(__dirname, '..', '..', 'package.json'));

const apiTags = [
  { name: 'auth', description: 'Authentication and session endpoints.' },
  { name: 'actions', description: 'Action execution and tool integrations.' },
  { name: 'agents', description: 'Agent configuration and execution endpoints.' },
  { name: 'assistants', description: 'Assistant configuration endpoints.' },
  { name: 'balance', description: 'Account balance and usage endpoints.' },
  { name: 'banner', description: 'Banner configuration endpoints.' },
  { name: 'categories', description: 'Prompt category endpoints.' },
  { name: 'config', description: 'Server and UI configuration endpoints.' },
  { name: 'convos', description: 'Conversation management endpoints.' },
  { name: 'endpoints', description: 'Model endpoint configuration endpoints.' },
  { name: 'files', description: 'File upload and retrieval endpoints.' },
  { name: 'keys', description: 'API key and provider key endpoints.' },
  { name: 'mcp', description: 'Model Context Protocol endpoints.' },
  { name: 'memories', description: 'Memory management endpoints.' },
  { name: 'messages', description: 'Message creation and retrieval endpoints.' },
  { name: 'models', description: 'Model discovery endpoints.' },
  { name: 'permissions', description: 'Access permission endpoints.' },
  { name: 'presets', description: 'Preset management endpoints.' },
  { name: 'prompts', description: 'Prompt management endpoints.' },
  { name: 'roles', description: 'Role-based access endpoints.' },
  { name: 'search', description: 'Search endpoints.' },
  { name: 'share', description: 'Shared conversation endpoints.' },
  { name: 'tags', description: 'Tag management endpoints.' },
  { name: 'user', description: 'User profile endpoints.' },
  { name: 'system', description: 'System health and metadata endpoints.' },
];

const defaultPathSummary = (method, pathName) => `${method.toUpperCase()} ${pathName}`;

const normalizeEndpoints = (endpoints) => {
  if (!Array.isArray(endpoints)) {
    return [];
  }

  return endpoints.flatMap((endpoint) => {
    if (!endpoint) {
      return [];
    }

    const rawPaths = Array.isArray(endpoint.path) ? endpoint.path : [endpoint.path];
    const methods = Array.isArray(endpoint.methods)
      ? endpoint.methods
      : endpoint.methods && typeof endpoint.methods === 'object'
        ? Object.keys(endpoint.methods)
        : [];

    return rawPaths
      .filter((routePath) => typeof routePath === 'string')
      .map((routePath) => ({
        path: routePath,
        methods,
      }));
  });
};

const buildPaths = (endpoints) =>
  normalizeEndpoints(endpoints).reduce((paths, endpoint) => {
    const { path: routePath, methods } = endpoint;
    const normalizedPath = routePath.replace(/\/:([A-Za-z0-9_]+)/g, '/{$1}');
    const methodsLower = methods.map((method) => method.toLowerCase());

    const methodSpecs = methodsLower.reduce((methodMap, method) => {
      const shouldSkip = method === 'options' || method === 'head';
      if (shouldSkip) {
        return methodMap;
      }

      return {
        ...methodMap,
        [method]: {
          summary: defaultPathSummary(method, normalizedPath),
          responses: {
            200: {
              description: 'OK',
            },
          },
          security: [{ bearerAuth: [] }],
        },
      };
    }, {});

    if (Object.keys(methodSpecs).length === 0) {
      return paths;
    }

    return {
      ...paths,
      [normalizedPath]: {
        ...(paths[normalizedPath] || {}),
        ...methodSpecs,
      },
    };
  }, {});

const buildOpenApiSpec = ({ serverUrl, endpoints }) => ({
  openapi: '3.0.3',
  info: {
    title: 'LibreChat API',
    version: packageJson.version,
    description:
      'Auto-generated OpenAPI document derived from the Express route table. ' +
      'Operation details should be refined with route-level annotations over time.',
  },
  servers: serverUrl ? [{ url: serverUrl }] : undefined,
  tags: apiTags,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: buildPaths(endpoints),
});

module.exports = { buildOpenApiSpec };
