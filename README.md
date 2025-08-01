# MCP Code Converter Server

一个基于Model Context Protocol (MCP)的代码转换服务器，支持将C#代码转换为TypeScript，并可扩展支持其他语言的转换。

## 功能特性

- 🚀 **MCP Server**: 基于Model Context Protocol的服务器
- 🔄 **多语言转换**: 支持C#到TypeScript转换，可扩展其他语言
- 📁 **多文件处理**: 支持单文件和批量目录转换
- 📝 **独立Prompt管理**: 可定制的prompt模板文件
- ⚡ **大数据量处理**: 支持批量处理和进度显示
- 🛠️ **CLI工具**: 命令行界面支持
- 📊 **转换统计**: 详细的转换统计信息

## 支持的语言转换

### 当前支持
- **C# → TypeScript**: 完整的C#到TypeScript转换
- **Java → TypeScript**: Java到TypeScript转换
- **Python → TypeScript**: Python到TypeScript转换

### 可扩展
- 任意语言之间的转换
- 自定义转换规则
- 特定框架的转换

## 安装

```bash
# 克隆项目
git clone <repository-url>
cd mcp-cs2ts-server

# 安装依赖
npm install

# 构建项目
npm run build
```

## 使用方法

### 1. MCP Server模式

```bash
# 启动MCP服务器
npm run start:stdio
```

### 2. CLI工具模式

#### 转换单个文件
```bash
# 转换C#文件到TypeScript
npm run cli convert-file ./src/Example.cs -t typescript -o ./output/Example.ts

# 转换Java文件到TypeScript
npm run cli convert-file ./src/Example.java -t typescript
```

#### 转换整个目录
```bash
# 转换目录中的所有文件
npm run cli convert-directory ./src -t typescript -o ./output --batch-size 5
```

#### 转换代码片段
```bash
# 从stdin读取代码并转换
echo "public class Example { }" | npm run cli convert-code -s csharp -t typescript
```

#### 列出支持的语言
```bash
npm run cli list-languages
```

#### 管理Prompt模板
```bash
# 列出可用的prompt模板
npm run cli prompts --list

# 删除prompt模板
npm run cli prompts --delete csharp-to-typescript
```

### 3. 开发模式

```bash
# 开发模式运行
npm run dev

# 启动MCP服务器
npm run serve --stdio
```

## 项目结构

```
mcp-cs2ts-server/
├── src/
│   ├── core/                 # 核心服务器逻辑
│   │   └── codeConverterServer.ts
│   ├── converters/           # 代码转换器
│   │   ├── baseConverter.ts
│   │   ├── codeConverter.ts
│   │   └── csharpToTypeScriptConverter.ts
│   ├── prompts/             # Prompt管理器
│   │   └── promptManager.ts
│   ├── utils/               # 工具类
│   │   ├── fileProcessor.ts
│   │   └── logger.ts
│   ├── types/               # 类型定义
│   │   └── index.ts
│   ├── cli.ts              # CLI工具
│   └── index.ts            # 主入口
├── prompts/                 # Prompt模板文件
│   ├── csharp/
│   │   └── csharp-to-typescript.md
│   ├── java/
│   │   └── java-to-typescript.md
│   └── python/
│       └── python-to-typescript.md
├── dist/                   # 编译输出
├── package.json
├── tsconfig.json
└── README.md
```

## 代码架构详解

### 整体架构设计

```
MCP Server (src/index.ts)
    ↓
CodeConverterServer (src/core/CodeConverterServer.ts)
    ↓
CodeConverter (src/converters/CodeConverter.ts)
    ↓
具体语言转换器 (如 CSharpToTypeScriptConverter)
```

### 核心组件详解

#### 1. **MCP Server 主入口** (`src/index.ts`)
- 使用`@modelcontextprotocol/sdk`创建标准MCP服务器
- 支持stdio传输协议，可以直接与Cursor集成
- 注册工具调用处理器
- 提供统一的错误处理和日志记录

```typescript
// 创建MCP服务器实例
const server = new Server({
  name: 'mcp-cs2ts-server',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
  },
});
```

#### 2. **代码转换服务器** (`src/core/codeConverterServer.ts`)
核心业务逻辑层，负责：
- **工具注册**: 注册各种转换工具（convert_code, convert_file, convert_directory等）
- **请求路由**: 将MCP工具调用路由到相应的处理函数
- **错误处理**: 统一的错误处理和日志记录

```typescript
// 工具调用处理
private async handleToolCall(request: any): Promise<any> {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case 'convert_code':
      return await this.convertCode(args);
    case 'convert_file':
      return await this.convertFile(args);
    // ... 其他工具
  }
}
```

#### 3. **代码转换器管理器** (`src/converters/codeConverter.ts`)
负责管理所有语言转换器：
- **转换器注册**: 管理不同语言对的转换器
- **转换历史**: 记录转换统计信息
- **语言支持**: 提供支持的语言列表

```typescript
// 转换器注册
private initializeConverters(): void {
  const csharpToTsConverter = new CSharpToTypeScriptConverter(this.logger);
  this.converters.set('csharp-to-typescript', csharpToTsConverter);
}
```

#### 4. **基础转换器抽象类** (`src/converters/baseConverter.ts`)
定义了所有转换器的通用接口：
- **抽象方法**: `convert()` 和 `getSupportedFeatures()`
- **通用功能**: 代码预处理、后处理、LLM调用
- **配置管理**: 语言特定选项处理

```typescript
export abstract class BaseConverter {
  abstract convert(sourceCode: string, options?: ConversionOptions): Promise<string>;
  abstract getSupportedFeatures(): string[];
  
  // 通用预处理
  protected preprocessCode(sourceCode: string, options?: ConversionOptions): string {
    // 处理注释、格式化等
  }
}
```

#### 5. **C#到TypeScript转换器** (`src/converters/csharpToTypeScriptConverter.ts`)
具体的语言转换实现：
- **模式匹配**: 使用正则表达式进行基础转换
- **类型映射**: C#类型到TypeScript类型的映射
- **结构转换**: 类、接口、方法、属性的转换

```typescript
// 基础转换模式
convertedCode = convertedCode
  .replace(/using\s+([^;]+);/g, "import { $1 } from '$1';")
  .replace(/public\s+class\s+(\w+)/g, 'export class $1')
  .replace(/string/g, 'string')
  .replace(/int/g, 'number');
```

#### 6. **Prompt管理器** (`src/prompts/promptManager.ts`)
管理独立的prompt模板文件：
- **模板加载**: 从文件系统加载prompt模板
- **变量替换**: 处理模板中的占位符
- **默认模板**: 提供内置的默认模板

```typescript
// 模板加载
private async loadPromptTemplates(): Promise<void> {
  const languageDirs = await fs.readdir(this.promptsDirectory);
  for (const langDir of languageDirs) {
    await this.loadTemplatesFromDirectory(langPath, langDir);
  }
}
```

#### 7. **文件处理器** (`src/utils/fileProcessor.ts`)
处理多文件和大数据量：
- **批量处理**: 支持批量文件转换
- **进度显示**: 实时显示转换进度
- **错误处理**: 单个文件失败不影响整体转换

```typescript
// 批量处理
for (let i = 0; i < sourceFiles.length; i += batchSize) {
  const batch = sourceFiles.slice(i, i + batchSize);
  const batchPromises = batch.map(async (filePath) => {
    return this.convertFile(filePath, targetLanguage, outputPath, options);
  });
  const batchResults = await Promise.all(batchPromises);
}
```

#### 8. **日志工具** (`src/utils/logger.ts`)
提供统一的日志记录：
- **彩色输出**: 使用chalk库提供彩色日志
- **进度条**: 显示转换进度
- **调试模式**: 支持调试信息输出

### 关键特性实现

#### 1. **可扩展性**
- 通过继承`BaseConverter`可以轻松添加新的语言转换器
- 模块化的prompt模板系统
- 插件式的转换器注册机制

#### 2. **多文件处理**
- 支持单文件和目录批量转换
- 可配置的批处理大小
- 文件大小限制和错误恢复

#### 3. **独立Prompt管理**
- Prompt模板存储在独立文件中
- 支持变量替换和自定义模板
- 按语言分类的模板组织

#### 4. **大数据量处理**
- 批量处理避免内存溢出
- 进度显示和统计信息
- 可配置的处理参数

### 与Cursor的集成

#### 1. **MCP协议支持**
- 使用标准MCP协议，Cursor原生支持
- stdio传输，无需额外配置
- 工具调用标准化

#### 2. **CLI工具**
- 提供命令行接口
- 支持各种转换场景
- 便于脚本化和自动化

#### 3. **配置灵活性**
- 环境变量配置
- 命令行参数支持
- 配置文件管理

### 使用流程

1. **启动服务器**: `npm run start:stdio`
2. **Cursor集成**: 在Cursor中配置MCP服务器
3. **工具调用**: 通过Cursor调用转换工具
4. **结果处理**: 获取转换结果和统计信息

### 架构设计优势

- **可扩展性**: 易于添加新语言支持
- **可维护性**: 清晰的模块分离
- **可测试性**: 每个组件都可以独立测试
- **可配置性**: 灵活的配置选项

## Prompt模板管理

### 模板文件结构
```
prompts/
├── {language}/
│   └── {conversion-name}.md
```

### 创建自定义模板
1. 在`prompts/{language}/`目录下创建`.md`文件
2. 使用以下变量占位符：
   - `{{sourceCode}}`: 源代码
   - `{{preserveComments}}`: 是否保留注释
   - `{{includeTypes}}`: 是否包含类型注解
   - `{{targetFramework}}`: 目标框架

### 示例模板
```markdown
# 自定义转换模板

You are an expert code converter.

Source Code:
{{sourceCode}}

Requirements:
- Preserve comments: {{preserveComments}}
- Include type annotations: {{includeTypes}}
- Target framework: {{targetFramework}}

Converted code:
```

## 配置选项

### 转换选项
- `preserveComments`: 是否保留注释 (默认: true)
- `includeTypes`: 是否包含类型注解 (默认: true)
- `targetFramework`: 目标框架
- `batchSize`: 批处理大小 (默认: 10)
- `maxTokens`: 最大token数 (默认: 4000)
- `temperature`: 生成温度 (默认: 0.1)

### 文件处理选项
- `maxFileSize`: 最大文件大小 (默认: 1MB)
- `ignorePatterns`: 忽略的文件模式
- `outputDirectory`: 输出目录

## 扩展新的语言转换器

### 1. 创建转换器类
```typescript
import { BaseConverter } from './BaseConverter.js';

export class NewLanguageToTypeScriptConverter extends BaseConverter {
  async convert(sourceCode: string, options?: ConversionOptions): Promise<string> {
    // 实现转换逻辑
    return convertedCode;
  }

  getSupportedFeatures(): string[] {
    return ['feature1', 'feature2'];
  }
}
```

### 2. 注册转换器
```typescript
// 在 CodeConverter.ts 中注册
this.converters.set('newlanguage-to-typescript', new NewLanguageToTypeScriptConverter(this.logger));
```

### 3. 创建Prompt模板
在`prompts/newlanguage/`目录下创建相应的prompt模板文件。

## API参考

### MCP Server API

#### convert_code
转换代码片段
```json
{
  "sourceCode": "public class Example { }",
  "sourceLanguage": "csharp",
  "targetLanguage": "typescript",
  "options": {
    "preserveComments": true,
    "includeTypes": true
  }
}
```

#### convert_file
转换单个文件
```json
{
  "filePath": "./src/Example.cs",
  "targetLanguage": "typescript",
  "outputPath": "./output/Example.ts",
  "options": {}
}
```

#### convert_directory
转换整个目录
```json
{
  "directoryPath": "./src",
  "targetLanguage": "typescript",
  "outputDirectory": "./output",
  "options": {
    "batchSize": 10
  }
}
```

## 开发

### 脚本命令
```bash
npm run build      # 构建项目
npm run dev        # 开发模式
npm run test       # 运行测试
npm run lint       # 代码检查
npm run format     # 代码格式化
```

### 环境变量
- `NODE_ENV`: 环境模式 (development/production)
- `DEBUG`: 启用调试模式
- `LOG_LEVEL`: 日志级别

## 贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

## 支持

如有问题或建议，请创建 Issue 或联系维护者。 