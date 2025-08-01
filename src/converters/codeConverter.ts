import { Logger } from '../utils/Logger.js';
import { ConversionRequest, ConversionResponse, ConversionStats, LanguageSupport } from '../types/index.js';
import { PromptManager } from '../prompts/PromptManager.js';
import { CSharpToTypeScriptConverter } from './CSharpToTypeScriptConverter.js';
import { BaseConverter } from './BaseConverter.js';

export class CodeConverter {
  private logger: Logger;
  private promptManager: PromptManager;
  private converters: Map<string, BaseConverter>;
  private conversionHistory: Map<string, ConversionStats>;

  constructor(logger: Logger) {
    this.logger = logger;
    this.promptManager = new PromptManager();
    this.converters = new Map();
    this.conversionHistory = new Map();
    this.initializeConverters();
  }

  private initializeConverters(): void {
    // Register built-in converters
    const csharpToTsConverter = new CSharpToTypeScriptConverter(this.logger);
    this.converters.set('csharp-to-typescript', csharpToTsConverter);
    
    // Add more converters here as needed
    // this.converters.set('java-to-typescript', new JavaToTypeScriptConverter(this.logger));
    // this.converters.set('python-to-typescript', new PythonToTypeScriptConverter(this.logger));
  }

  async convert(request: ConversionRequest): Promise<ConversionResponse> {
    const startTime = new Date();
    const conversionId = this.generateConversionId();
    
    this.logger.info(`Starting conversion ${conversionId}: ${request.sourceLanguage} -> ${request.targetLanguage}`);

    try {
      const converterKey = `${request.sourceLanguage}-to-${request.targetLanguage}`;
      const converter = this.converters.get(converterKey);

      if (!converter) {
        throw new Error(`No converter found for ${request.sourceLanguage} to ${request.targetLanguage}`);
      }

      const convertedCode = await converter.convert(request.sourceCode, request.options);
      
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      const stats: ConversionStats = {
        startTime,
        endTime,
        duration,
        sourceLines: request.sourceCode.split('\n').length,
        targetLines: convertedCode.split('\n').length,
        tokensUsed: this.estimateTokenCount(request.sourceCode + convertedCode),
      };

      this.conversionHistory.set(conversionId, stats);

      const response: ConversionResponse = {
        convertedCode,
        conversionId,
        stats,
      };

      this.logger.info(`Conversion ${conversionId} completed successfully`);
      return response;

    } catch (error) {
      this.logger.error(`Conversion ${conversionId} failed:`, error);
      throw error;
    }
  }

  getSupportedLanguages(): LanguageSupport[] {
    const languages: LanguageSupport[] = [];
    
    for (const [key, converter] of this.converters) {
      const [sourceLanguage, targetLanguage] = key.split('-to-');
      languages.push({
        sourceLanguage,
        targetLanguage,
        converter: key,
        supported: true,
        features: converter.getSupportedFeatures(),
      });
    }

    return languages;
  }

  async getConversionStats(conversionId: string): Promise<ConversionStats | null> {
    return this.conversionHistory.get(conversionId) || null;
  }

  private generateConversionId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private estimateTokenCount(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  registerConverter(key: string, converter: BaseConverter): void {
    this.converters.set(key, converter);
    this.logger.info(`Registered converter: ${key}`);
  }

  getConverter(key: string): BaseConverter | undefined {
    return this.converters.get(key);
  }
} 