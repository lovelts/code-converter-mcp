export interface ConversionRequest {
  sourceCode: string;
  sourceLanguage: string;
  targetLanguage: string;
  options?: ConversionOptions;
}

export interface ConversionResponse {
  convertedCode: string;
  conversionId: string;
  stats: ConversionStats;
  errors?: string[];
  warnings?: string[];
}

export interface ConversionOptions {
  preserveComments?: boolean;
  includeTypes?: boolean;
  targetFramework?: string;
  customPrompts?: Record<string, string>;
  batchSize?: number;
  maxTokens?: number;
  temperature?: number;
}

export interface ConversionStats {
  startTime: Date;
  endTime: Date;
  duration: number;
  sourceLines: number;
  targetLines: number;
  tokensUsed: number;
  cost?: number;
}

export interface LanguageSupport {
  sourceLanguage: string;
  targetLanguage: string;
  converter: string;
  supported: boolean;
  features: string[];
}

export interface FileConversionResult {
  filePath: string;
  outputPath: string;
  success: boolean;
  convertedCode?: string;
  errors?: string[];
  stats: ConversionStats;
}

export interface DirectoryConversionResult {
  directoryPath: string;
  outputDirectory: string;
  totalFiles: number;
  successfulConversions: number;
  failedConversions: number;
  results: FileConversionResult[];
  summary: ConversionStats;
}

export interface PromptTemplate {
  name: string;
  language: string;
  content: string;
  variables: string[];
  description: string;
}

export interface ConverterConfig {
  name: string;
  sourceLanguage: string;
  targetLanguage: string;
  promptTemplate: string;
  options: Record<string, any>;
} 