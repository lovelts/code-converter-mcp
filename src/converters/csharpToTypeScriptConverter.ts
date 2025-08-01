import { BaseConverter } from './BaseConverter.js';
import { ConversionOptions } from '../types/index.js';
import { PromptManager } from '../prompts/PromptManager.js';

export class CSharpToTypeScriptConverter extends BaseConverter {
  private promptManager: PromptManager;

  constructor(logger: any) {
    super(logger);
    this.promptManager = new PromptManager();
  }

  async convert(sourceCode: string, options?: ConversionOptions): Promise<string> {
    this.validateSourceCode(sourceCode);
    
    const processedCode = this.preprocessCode(sourceCode, options);
    const languageOptions = this.getLanguageSpecificOptions(options);
    
    this.logger.info('Converting C# code to TypeScript');
    
    // Get the appropriate prompt template
    const prompt = await this.buildPrompt(processedCode, languageOptions);
    
    // Call LLM for conversion
    const convertedCode = await this.callLLM(prompt, languageOptions);
    
    // Post-process the converted code
    const finalCode = this.postprocessCode(convertedCode, options);
    
    this.logger.info('C# to TypeScript conversion completed');
    
    return finalCode;
  }

  getSupportedFeatures(): string[] {
    return [
      'class-conversion',
      'interface-conversion',
      'method-conversion',
      'property-conversion',
      'enum-conversion',
      'namespace-to-module',
      'using-to-import',
      'type-annotations',
      'async-await',
      'generics',
      'decorators',
      'access-modifiers'
    ];
  }

  private async buildPrompt(sourceCode: string, options: Record<string, any>): Promise<string> {
    const template = await this.promptManager.getPromptTemplate('csharp-to-typescript');
    
    return template
      .replace('{{sourceCode}}', sourceCode)
      .replace('{{preserveComments}}', options.preserveComments ? 'true' : 'false')
      .replace('{{includeTypes}}', options.includeTypes ? 'true' : 'false')
      .replace('{{targetFramework}}', options.targetFramework || 'none');
  }

  protected override async callLLM(prompt: string, options?: ConversionOptions): Promise<string> {
    // Enhanced LLM call with C# specific processing
    this.logger.info('Calling LLM for C# to TypeScript conversion');
    
    // For now, return a mock response with some basic C# to TS conversion logic
    return this.mockCSharpToTypeScriptConversion(prompt);
  }

  private mockCSharpToTypeScriptConversion(prompt: string): string {
    // Mock implementation with basic C# to TypeScript conversion patterns
    const sourceCode = prompt.includes('{{sourceCode}}') 
      ? prompt.split('{{sourceCode}}')[1]?.split('{{')[0] || ''
      : prompt;
    
    let convertedCode = sourceCode;
    
    // Basic C# to TypeScript conversion patterns
    convertedCode = convertedCode
      // Convert using statements to imports
      .replace(/using\s+([^;]+);/g, "import { $1 } from '$1';")
      
      // Convert namespace to module
      .replace(/namespace\s+([^{]+)\s*{/g, '// Module: $1')
      
      // Convert class declarations
      .replace(/public\s+class\s+(\w+)/g, 'export class $1')
      .replace(/private\s+class\s+(\w+)/g, 'class $1')
      
      // Convert method declarations
      .replace(/public\s+(\w+)\s+(\w+)\s*\(([^)]*)\)/g, 'public $2($3): $1')
      .replace(/private\s+(\w+)\s+(\w+)\s*\(([^)]*)\)/g, 'private $2($3): $1')
      
      // Convert property declarations
      .replace(/public\s+(\w+)\s+(\w+)\s*{\s*get;\s*set;\s*}/g, 'public $2: $1;')
      .replace(/private\s+(\w+)\s+(\w+)\s*{\s*get;\s*set;\s*}/g, 'private $2: $1;')
      
      // Convert type annotations
      .replace(/string/g, 'string')
      .replace(/int/g, 'number')
      .replace(/bool/g, 'boolean')
      .replace(/double/g, 'number')
      .replace(/float/g, 'number')
      .replace(/DateTime/g, 'Date')
      .replace(/List<([^>]+)>/g, '$1[]')
      .replace(/Dictionary<([^,]+),\s*([^>]+)>/g, 'Record<$1, $2>')
      
      // Convert constructor
      .replace(/public\s+(\w+)\s*\(([^)]*)\)/g, 'constructor($2)')
      
      // Convert interface
      .replace(/public\s+interface\s+(\w+)/g, 'export interface $1')
      
      // Convert enum
      .replace(/public\s+enum\s+(\w+)/g, 'export enum $1')
      
      // Remove semicolons at end of lines (optional in TypeScript)
      .replace(/;\s*$/gm, '')
      
      // Convert null to undefined where appropriate
      .replace(/\bnull\b/g, 'undefined');
    
    return `// Converted from C# to TypeScript\n${convertedCode}`;
  }

  private preprocessCSharpCode(sourceCode: string): string {
    // C# specific preprocessing
    return sourceCode
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/^\s*#region.*$/gm, '') // Remove #region directives
      .replace(/^\s*#endregion.*$/gm, ''); // Remove #endregion directives
  }

  private postprocessTypeScriptCode(convertedCode: string): string {
    // TypeScript specific postprocessing
    return convertedCode
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Clean up excessive newlines
      .replace(/^\s*\/\/\s*$/gm, '') // Remove empty comment lines
      .trim();
  }
} 