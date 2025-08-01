#!/usr/bin/env node

import { Command } from 'commander';
import { CodeConverter } from './converters/codeConverter.js';
import { FileProcessor } from './utils/fileProcessor.js';
import { Logger } from './utils/logger.js';
import { PromptManager } from './prompts/promptManager.js';

const program = new Command();
const logger = new Logger();

program
  .name('mcp-cs2ts-server')
  .description('MCP Server for converting code between different languages')
  .version('1.0.0');

// Convert single file
program
  .command('convert-file')
  .description('Convert a single file')
  .argument('<file>', 'Source file path')
  .option('-t, --target <language>', 'Target language', 'typescript')
  .option('-o, --output <path>', 'Output file path')
  .option('--preserve-comments', 'Preserve comments', true)
  .option('--include-types', 'Include type annotations', true)
  .option('--target-framework <framework>', 'Target framework')
  .action(async (file, options) => {
    try {
      const fileProcessor = new FileProcessor(logger);
      const result = await fileProcessor.convertFile(
        file,
        options.target,
        options.output,
        {
          preserveComments: options.preserveComments,
          includeTypes: options.includeTypes,
          targetFramework: options.targetFramework
        }
      );

      if (result.success) {
        logger.success(`File converted successfully: ${result.outputPath}`);
        logger.info(`Stats: ${result.stats.sourceLines} → ${result.stats.targetLines} lines`);
      } else {
        logger.error('Conversion failed:', result.errors);
        process.exit(1);
      }
    } catch (error) {
      logger.error('Conversion failed:', error);
      process.exit(1);
    }
  });

// Convert directory
program
  .command('convert-directory')
  .description('Convert all files in a directory')
  .argument('<directory>', 'Source directory path')
  .option('-t, --target <language>', 'Target language', 'typescript')
  .option('-o, --output <path>', 'Output directory path')
  .option('--batch-size <size>', 'Batch size for processing', '10')
  .option('--preserve-comments', 'Preserve comments', true)
  .option('--include-types', 'Include type annotations', true)
  .option('--target-framework <framework>', 'Target framework')
  .action(async (directory, options) => {
    try {
      const fileProcessor = new FileProcessor(logger);
      fileProcessor.setBatchSize(parseInt(options.batchSize));
      
      const result = await fileProcessor.convertDirectory(
        directory,
        options.target,
        options.output,
        {
          preserveComments: options.preserveComments,
          includeTypes: options.includeTypes,
          targetFramework: options.targetFramework,
          batchSize: parseInt(options.batchSize)
        }
      );

      logger.success(`Directory conversion completed`);
      logger.info(`Total files: ${result.totalFiles}`);
      logger.info(`Successful: ${result.successfulConversions}`);
      logger.info(`Failed: ${result.failedConversions}`);
      logger.info(`Duration: ${result.summary.duration}ms`);
    } catch (error) {
      logger.error('Directory conversion failed:', error);
      process.exit(1);
    }
  });

// Convert code snippet
program
  .command('convert-code')
  .description('Convert a code snippet')
  .option('-s, --source <language>', 'Source language', 'csharp')
  .option('-t, --target <language>', 'Target language', 'typescript')
  .option('--preserve-comments', 'Preserve comments', true)
  .option('--include-types', 'Include type annotations', true)
  .option('--target-framework <framework>', 'Target framework')
  .action(async (options) => {
    try {
      // Read from stdin
      let sourceCode = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (chunk) => {
        sourceCode += chunk;
      });
      
      process.stdin.on('end', async () => {
        try {
          const codeConverter = new CodeConverter(logger);
          const result = await codeConverter.convert({
            sourceCode: sourceCode.trim(),
            sourceLanguage: options.source,
            targetLanguage: options.target,
            options: {
              preserveComments: options.preserveComments,
              includeTypes: options.includeTypes,
              targetFramework: options.targetFramework
            }
          });

          console.log(result.convertedCode);
        } catch (error) {
          logger.error('Code conversion failed:', error);
          process.exit(1);
        }
      });
    } catch (error) {
      logger.error('Code conversion failed:', error);
      process.exit(1);
    }
  });

// List supported languages
program
  .command('list-languages')
  .description('List supported language conversions')
  .action(async () => {
    try {
      const codeConverter = new CodeConverter(logger);
      const languages = codeConverter.getSupportedLanguages();
      
      console.log('Supported language conversions:');
      languages.forEach(lang => {
        console.log(`  ${lang.sourceLanguage} → ${lang.targetLanguage}`);
        console.log(`    Features: ${lang.features.join(', ')}`);
      });
    } catch (error) {
      logger.error('Failed to list languages:', error);
      process.exit(1);
    }
  });

// Manage prompts
program
  .command('prompts')
  .description('Manage prompt templates')
  .option('--list', 'List available templates')
  .option('--create <template>', 'Create a new template')
  .option('--update <template>', 'Update an existing template')
  .option('--delete <template>', 'Delete a template')
  .action(async (options) => {
    try {
      const promptManager = new PromptManager();
      await promptManager.initialize();

      if (options.list) {
        const templates = promptManager.getAvailableTemplates();
        console.log('Available prompt templates:');
        templates.forEach(template => {
          console.log(`  ${template}`);
        });
      } else if (options.create) {
        // Interactive template creation
        console.log('Template creation not implemented yet');
      } else if (options.update) {
        console.log('Template update not implemented yet');
      } else if (options.delete) {
        await promptManager.deletePromptTemplate(options.delete);
        logger.success(`Template deleted: ${options.delete}`);
      } else {
        console.log('Use --list, --create, --update, or --delete options');
      }
    } catch (error) {
      logger.error('Prompt management failed:', error);
      process.exit(1);
    }
  });

// Start MCP server
program
  .command('serve')
  .description('Start the MCP server')
  .option('--stdio', 'Use stdio transport')
  .option('--port <port>', 'Port for HTTP transport', '3000')
  .action(async (options) => {
    try {
      if (options.stdio) {
        // Start stdio server
        const { main } = await import('./index.js');
        await main();
      } else {
        // Start HTTP server
        console.log('HTTP server not implemented yet');
        process.exit(1);
      }
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  });

program.parse(); 