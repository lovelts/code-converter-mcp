import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { Logger } from '../utils/Logger.js';
import { CodeConverter } from '../converters/CodeConverter.js';
import { PromptManager } from '../prompts/PromptManager.js';
import { FileProcessor } from '../utils/FileProcessor.js';
import { ConversionRequest, ConversionResponse } from '../types/index.js';

export class CodeConverterServer {
  private server: Server;
  private logger: Logger;
  private codeConverter: CodeConverter;
  private promptManager: PromptManager;
  private fileProcessor: FileProcessor;

  constructor(server: Server, logger: Logger) {
    this.server = server;
    this.logger = logger;
    this.codeConverter = new CodeConverter(logger);
    this.promptManager = new PromptManager();
    this.fileProcessor = new FileProcessor(logger);
  }

  async initialize(): Promise<void> {
    await this.promptManager.initialize();
    
    // Register tools
    this.server.setRequestHandler('tools/call', async (request) => {
      return this.handleToolCall(request);
    });

    this.logger.info('CodeConverterServer initialized');
  }

  private async handleToolCall(request: any): Promise<any> {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'convert_code':
          return await this.convertCode(args);
        case 'convert_file':
          return await this.convertFile(args);
        case 'convert_directory':
          return await this.convertDirectory(args);
        case 'list_supported_languages':
          return await this.listSupportedLanguages();
        case 'get_conversion_stats':
          return await this.getConversionStats(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      this.logger.error(`Error handling tool call ${name}:`, error);
      throw error;
    }
  }

  private async convertCode(args: any): Promise<any> {
    const { sourceCode, sourceLanguage, targetLanguage, options = {} } = args;
    
    const conversionRequest: ConversionRequest = {
      sourceCode,
      sourceLanguage,
      targetLanguage,
      options
    };

    const result = await this.codeConverter.convert(conversionRequest);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  private async convertFile(args: any): Promise<any> {
    const { filePath, targetLanguage, outputPath, options = {} } = args;
    
    const result = await this.fileProcessor.convertFile(filePath, targetLanguage, outputPath, options);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  private async convertDirectory(args: any): Promise<any> {
    const { directoryPath, targetLanguage, outputDirectory, options = {} } = args;
    
    const result = await this.fileProcessor.convertDirectory(directoryPath, targetLanguage, outputDirectory, options);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  private async listSupportedLanguages(): Promise<any> {
    const languages = this.codeConverter.getSupportedLanguages();
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(languages, null, 2)
        }
      ]
    };
  }

  private async getConversionStats(args: any): Promise<any> {
    const { conversionId } = args;
    const stats = await this.codeConverter.getConversionStats(conversionId);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(stats, null, 2)
        }
      ]
    };
  }
} 