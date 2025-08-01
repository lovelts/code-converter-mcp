import * as fs from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';
import { Logger } from './Logger.js';
import { CodeConverter } from '../converters/CodeConverter.js';
import { FileConversionResult, DirectoryConversionResult, ConversionStats } from '../types/index.js';

export class FileProcessor {
  private logger: Logger;
  private codeConverter: CodeConverter;
  private batchSize: number;
  private maxFileSize: number; // in bytes

  constructor(logger: Logger) {
    this.logger = logger;
    this.codeConverter = new CodeConverter(logger);
    this.batchSize = 10; // Process 10 files at a time
    this.maxFileSize = 1024 * 1024; // 1MB max file size
  }

  async convertFile(
    filePath: string, 
    targetLanguage: string, 
    outputPath?: string, 
    options: any = {}
  ): Promise<FileConversionResult> {
    const startTime = new Date();
    
    try {
      this.logger.info(`Converting file: ${filePath}`);
      
      // Validate file exists
      if (!await fs.pathExists(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      // Check file size
      const stats = await fs.stat(filePath);
      if (stats.size > this.maxFileSize) {
        throw new Error(`File too large: ${filePath} (${stats.size} bytes)`);
      }

      // Read source file
      const sourceCode = await fs.readFile(filePath, 'utf-8');
      
      // Determine source language from file extension
      const sourceLanguage = this.getLanguageFromExtension(path.extname(filePath));
      
      if (!sourceLanguage) {
        throw new Error(`Unsupported file extension: ${path.extname(filePath)}`);
      }

      // Convert code
      const conversionResult = await this.codeConverter.convert({
        sourceCode,
        sourceLanguage,
        targetLanguage,
        options
      });

      // Determine output path
      const finalOutputPath = outputPath || this.generateOutputPath(filePath, targetLanguage);
      
      // Ensure output directory exists
      await fs.ensureDir(path.dirname(finalOutputPath));
      
      // Write converted code
      await fs.writeFile(finalOutputPath, conversionResult.convertedCode, 'utf-8');
      
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      const stats: ConversionStats = {
        startTime,
        endTime,
        duration,
        sourceLines: sourceCode.split('\n').length,
        targetLines: conversionResult.convertedCode.split('\n').length,
        tokensUsed: conversionResult.stats.tokensUsed,
      };

      const result: FileConversionResult = {
        filePath,
        outputPath: finalOutputPath,
        success: true,
        convertedCode: conversionResult.convertedCode,
        stats
      };

      this.logger.info(`File conversion completed: ${filePath} -> ${finalOutputPath}`);
      return result;

    } catch (error) {
      this.logger.error(`File conversion failed: ${filePath}`, error);
      
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      return {
        filePath,
        outputPath: outputPath || '',
        success: false,
        errors: [error instanceof Error ? error.message : String(error)],
        stats: {
          startTime,
          endTime,
          duration,
          sourceLines: 0,
          targetLines: 0,
          tokensUsed: 0,
        }
      };
    }
  }

  async convertDirectory(
    directoryPath: string,
    targetLanguage: string,
    outputDirectory?: string,
    options: any = {}
  ): Promise<DirectoryConversionResult> {
    const startTime = new Date();
    
    try {
      this.logger.info(`Converting directory: ${directoryPath}`);
      
      // Validate directory exists
      if (!await fs.pathExists(directoryPath)) {
        throw new Error(`Directory not found: ${directoryPath}`);
      }

      // Find all source files
      const sourceFiles = await this.findSourceFiles(directoryPath, options.sourceLanguage);
      
      if (sourceFiles.length === 0) {
        throw new Error(`No source files found in directory: ${directoryPath}`);
      }

      this.logger.info(`Found ${sourceFiles.length} files to convert`);

      // Process files in batches
      const results: FileConversionResult[] = [];
      const batchSize = options.batchSize || this.batchSize;
      
      for (let i = 0; i < sourceFiles.length; i += batchSize) {
        const batch = sourceFiles.slice(i, i + batchSize);
        this.logger.info(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sourceFiles.length / batchSize)}`);
        
        const batchPromises = batch.map(async (filePath) => {
          const relativePath = path.relative(directoryPath, filePath);
          const outputPath = outputDirectory 
            ? path.join(outputDirectory, this.generateOutputPath(relativePath, targetLanguage))
            : undefined;
          
          return this.convertFile(filePath, targetLanguage, outputPath, options);
        });
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      }

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();
      
      const successfulConversions = results.filter(r => r.success).length;
      const failedConversions = results.filter(r => !r.success).length;
      
      const summary: ConversionStats = {
        startTime,
        endTime,
        duration,
        sourceLines: results.reduce((sum, r) => sum + r.stats.sourceLines, 0),
        targetLines: results.reduce((sum, r) => sum + r.stats.targetLines, 0),
        tokensUsed: results.reduce((sum, r) => sum + r.stats.tokensUsed, 0),
      };

      const result: DirectoryConversionResult = {
        directoryPath,
        outputDirectory: outputDirectory || '',
        totalFiles: sourceFiles.length,
        successfulConversions,
        failedConversions,
        results,
        summary
      };

      this.logger.info(`Directory conversion completed: ${successfulConversions} successful, ${failedConversions} failed`);
      return result;

    } catch (error) {
      this.logger.error(`Directory conversion failed: ${directoryPath}`, error);
      throw error;
    }
  }

  private async findSourceFiles(directoryPath: string, sourceLanguage?: string): Promise<string[]> {
    const patterns = sourceLanguage 
      ? this.getFilePatternsForLanguage(sourceLanguage)
      : ['**/*.cs', '**/*.java', '**/*.py', '**/*.js', '**/*.ts', '**/*.cpp', '**/*.c'];
    
    const files: string[] = [];
    
    for (const pattern of patterns) {
      const matches = await glob.glob(pattern, {
        cwd: directoryPath,
        absolute: true,
        ignore: ['**/node_modules/**', '**/bin/**', '**/obj/**', '**/dist/**', '**/build/**']
      });
      files.push(...matches);
    }
    
    return files.sort();
  }

  private getFilePatternsForLanguage(language: string): string[] {
    const patterns: Record<string, string[]> = {
      'csharp': ['**/*.cs'],
      'java': ['**/*.java'],
      'python': ['**/*.py'],
      'javascript': ['**/*.js'],
      'typescript': ['**/*.ts'],
      'cpp': ['**/*.cpp', '**/*.cc', '**/*.cxx'],
      'c': ['**/*.c']
    };
    
    return patterns[language.toLowerCase()] || ['**/*'];
  }

  private getLanguageFromExtension(extension: string): string | null {
    const languageMap: Record<string, string> = {
      '.cs': 'csharp',
      '.java': 'java',
      '.py': 'python',
      '.js': 'javascript',
      '.ts': 'typescript',
      '.cpp': 'cpp',
      '.cc': 'cpp',
      '.cxx': 'cpp',
      '.c': 'c'
    };
    
    return languageMap[extension.toLowerCase()] || null;
  }

  private generateOutputPath(sourcePath: string, targetLanguage: string): string {
    const ext = this.getExtensionForLanguage(targetLanguage);
    const dir = path.dirname(sourcePath);
    const name = path.basename(sourcePath, path.extname(sourcePath));
    return path.join(dir, `${name}.${ext}`);
  }

  private getExtensionForLanguage(language: string): string {
    const extensions: Record<string, string> = {
      'typescript': 'ts',
      'javascript': 'js',
      'python': 'py',
      'java': 'java',
      'csharp': 'cs',
      'cpp': 'cpp',
      'c': 'c'
    };
    
    return extensions[language.toLowerCase()] || 'ts';
  }

  setBatchSize(size: number): void {
    this.batchSize = size;
  }

  setMaxFileSize(size: number): void {
    this.maxFileSize = size;
  }
} 