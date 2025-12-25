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

const basePaths = [
  { path: '/health', method: 'get', summary: 'Health check', tags: ['system'] },
];

const buildPaths = () =>
  basePaths.reduce((paths, entry) => {
    const { path: routePath, method, summary, tags } = entry;
    return {
      ...paths,
      [routePath]: {
        ...(paths[routePath] || {}),
        [method]: {
          summary,
          tags,
          responses: {
            200: {
              description: 'OK',
            },
          },
        },
      },
    };
  }, {});

const buildOpenApiSpec = (serverUrl) => ({
  openapi: '3.0.3',
  info: {
    title: 'LibreChat API',
    version: packageJson.version,
    description:
      'This OpenAPI document provides a starting point for LibreChat API documentation. ' +
      'Only a limited set of endpoints are described today; extend with route-level annotations ' +
      'or expand the spec to document additional paths.',
  },
  servers: serverUrl ? [{ url: serverUrl }] : undefined,
  tags: apiTags,
  paths: buildPaths(),
});

module.exports = { buildOpenApiSpec };
