#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CodeConverterServer } from './core/codeConverterServer.js';
import { Logger } from './utils/logger.js';

async function main() {
  const logger = new Logger();
  
  try {
    logger.info('Starting MCP Code Converter Server...');
    
    const transport = new StdioServerTransport();
    const server = new Server(
      {
        name: 'mcp-cs2ts-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    const codeConverterServer = new CodeConverterServer(server, logger);
    await codeConverterServer.initialize();

    await server.connect(transport);
    logger.info('MCP Server started successfully');
  } catch (error) {
    logger.error('Failed to start MCP Server:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
} 