import * as fs from 'fs-extra';
import * as path from 'path';
import { Logger } from '../utils/logger.js';
import { PromptTemplate } from '../types/index.js';

export class PromptManager {
  private logger: Logger;
  private promptsDirectory: string;
  private templates: Map<string, string>;

  constructor() {
    this.logger = new Logger();
    this.promptsDirectory = path.join(process.cwd(), 'prompts');
    this.templates = new Map();
  }

  async initialize(): Promise<void> {
    try {
      await this.loadPromptTemplates();
      this.logger.info('PromptManager initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize PromptManager:', error);
      throw error;
    }
  }

  private async loadPromptTemplates(): Promise<void> {
    if (!await fs.pathExists(this.promptsDirectory)) {
      this.logger.warn(`Prompts directory not found: ${this.promptsDirectory}`);
      return;
    }

    const languageDirs = await fs.readdir(this.promptsDirectory);
    
    for (const langDir of languageDirs) {
      const langPath = path.join(this.promptsDirectory, langDir);
      const stat = await fs.stat(langPath);
      
      if (stat.isDirectory()) {
        await this.loadTemplatesFromDirectory(langPath, langDir);
      }
    }
  }

  private async loadTemplatesFromDirectory(dirPath: string, language: string): Promise<void> {
    const files = await fs.readdir(dirPath);
    
    for (const file of files) {
      if (file.endsWith('.md') || file.endsWith('.txt') || file.endsWith('.prompt')) {
        const filePath = path.join(dirPath, file);
        const templateName = path.basename(file, path.extname(file));
        const key = `${language}-${templateName}`;
        
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          this.templates.set(key, content);
          this.logger.info(`Loaded prompt template: ${key}`);
        } catch (error) {
          this.logger.error(`Failed to load template ${filePath}:`, error);
        }
      }
    }
  }

  async getPromptTemplate(templateKey: string): Promise<string> {
    // First try exact match
    if (this.templates.has(templateKey)) {
      return this.templates.get(templateKey)!;
    }

    // Try to find a template with the key as suffix
    for (const [key, template] of this.templates) {
      if (key.endsWith(templateKey) || key.includes(templateKey)) {
        return template;
      }
    }

    // Return default template if not found
    this.logger.warn(`Template not found: ${templateKey}, using default`);
    return this.getDefaultTemplate(templateKey);
  }

  private getDefaultTemplate(templateKey: string): string {
    // Default templates for common conversions
    const defaultTemplates: Record<string, string> = {
      'csharp-to-typescript': `You are an expert code converter specializing in converting C# code to TypeScript.

Source Code:
{{sourceCode}}

Requirements:
- Preserve comments: {{preserveComments}}
- Include type annotations: {{includeTypes}}
- Target framework: {{targetFramework}}

Please convert the above C# code to TypeScript following these guidelines:
1. Convert C# classes to TypeScript classes/interfaces
2. Convert C# properties to TypeScript properties
3. Convert C# methods to TypeScript methods
4. Convert C# types to TypeScript types
5. Convert C# namespaces to TypeScript modules
6. Convert C# using statements to TypeScript imports
7. Handle async/await patterns appropriately
8. Convert C# generics to TypeScript generics
9. Maintain code structure and readability

Converted TypeScript code:`,

      'java-to-typescript': `You are an expert code converter specializing in converting Java code to TypeScript.

Source Code:
{{sourceCode}}

Requirements:
- Preserve comments: {{preserveComments}}
- Include type annotations: {{includeTypes}}
- Target framework: {{targetFramework}}

Please convert the above Java code to TypeScript following these guidelines:
1. Convert Java classes to TypeScript classes/interfaces
2. Convert Java methods to TypeScript methods
3. Convert Java types to TypeScript types
4. Convert Java packages to TypeScript modules
5. Convert Java imports to TypeScript imports
6. Handle Java generics to TypeScript generics
7. Convert Java annotations to TypeScript decorators where appropriate
8. Maintain code structure and readability

Converted TypeScript code:`,

      'python-to-typescript': `You are an expert code converter specializing in converting Python code to TypeScript.

Source Code:
{{sourceCode}}

Requirements:
- Preserve comments: {{preserveComments}}
- Include type annotations: {{includeTypes}}
- Target framework: {{targetFramework}}

Please convert the above Python code to TypeScript following these guidelines:
1. Convert Python classes to TypeScript classes
2. Convert Python functions to TypeScript functions
3. Convert Python types to TypeScript types
4. Convert Python imports to TypeScript imports
5. Handle Python decorators to TypeScript decorators
6. Convert Python list comprehensions to TypeScript array methods
7. Handle Python async/await patterns
8. Maintain code structure and readability

Converted TypeScript code:`
    };

    return defaultTemplates[templateKey] || `Convert the following code to TypeScript:

{{sourceCode}}

Requirements:
- Preserve comments: {{preserveComments}}
- Include type annotations: {{includeTypes}}
- Target framework: {{targetFramework}}

Converted code:`;
  }

  async createPromptTemplate(template: PromptTemplate): Promise<void> {
    const templateDir = path.join(this.promptsDirectory, template.language);
    await fs.ensureDir(templateDir);
    
    const filePath = path.join(templateDir, `${template.name}.md`);
    await fs.writeFile(filePath, template.content);
    
    const key = `${template.language}-${template.name}`;
    this.templates.set(key, template.content);
    
    this.logger.info(`Created prompt template: ${key}`);
  }

  async updatePromptTemplate(templateKey: string, content: string): Promise<void> {
    this.templates.set(templateKey, content);
    
    // Save to file
    const [language, name] = templateKey.split('-', 2);
    const templateDir = path.join(this.promptsDirectory, language);
    await fs.ensureDir(templateDir);
    
    const filePath = path.join(templateDir, `${name}.md`);
    await fs.writeFile(filePath, content);
    
    this.logger.info(`Updated prompt template: ${templateKey}`);
  }

  async deletePromptTemplate(templateKey: string): Promise<void> {
    this.templates.delete(templateKey);
    
    // Delete file
    const [language, name] = templateKey.split('-', 2);
    const filePath = path.join(this.promptsDirectory, language, `${name}.md`);
    
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
    }
    
    this.logger.info(`Deleted prompt template: ${templateKey}`);
  }

  getAvailableTemplates(): string[] {
    return Array.from(this.templates.keys());
  }

  async reloadTemplates(): Promise<void> {
    this.templates.clear();
    await this.loadPromptTemplates();
    this.logger.info('Prompt templates reloaded');
  }
} 