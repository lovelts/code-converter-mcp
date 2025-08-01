import { Logger } from '../utils/logger.js';
import { ConversionOptions } from '../types/index.js';

export abstract class BaseConverter {
  protected logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  abstract convert(sourceCode: string, options?: ConversionOptions): Promise<string>;
  
  abstract getSupportedFeatures(): string[];

  protected async callLLM(prompt: string, options?: ConversionOptions): Promise<string> {
    // This is a placeholder for LLM integration
    // In a real implementation, you would integrate with OpenAI, Anthropic, or other LLM providers
    this.logger.info('Calling LLM for code conversion');
    
    // For now, return a mock response
    // TODO: Implement actual LLM integration
    return this.mockLLMResponse(prompt);
  }

  protected mockLLMResponse(prompt: string): string {
    // This is a mock implementation for testing
    // In production, replace with actual LLM API calls
    return `// Converted code from ${prompt.substring(0, 50)}...\n// TODO: Implement actual conversion logic`;
  }

  protected validateSourceCode(sourceCode: string): void {
    if (!sourceCode || sourceCode.trim().length === 0) {
      throw new Error('Source code cannot be empty');
    }
  }

  protected preprocessCode(sourceCode: string, options?: ConversionOptions): string {
    // Common preprocessing steps
    let processedCode = sourceCode;
    
    if (options?.preserveComments === false) {
      // Remove comments if not preserving them
      processedCode = this.removeComments(processedCode);
    }
    
    return processedCode;
  }

  protected postprocessCode(convertedCode: string, options?: ConversionOptions): string {
    // Common postprocessing steps
    let processedCode = convertedCode;
    
    // Clean up extra whitespace
    processedCode = processedCode.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Ensure proper line endings
    processedCode = processedCode.replace(/\r\n/g, '\n');
    
    return processedCode;
  }

  private removeComments(code: string): string {
    // Simple comment removal - can be enhanced for different languages
    return code
      .replace(/\/\/.*$/gm, '') // Remove single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments
  }

  protected getLanguageSpecificOptions(options?: ConversionOptions): Record<string, any> {
    return {
      preserveComments: options?.preserveComments ?? true,
      includeTypes: options?.includeTypes ?? true,
      targetFramework: options?.targetFramework,
      maxTokens: options?.maxTokens ?? 4000,
      temperature: options?.temperature ?? 0.1,
    };
  }
} 