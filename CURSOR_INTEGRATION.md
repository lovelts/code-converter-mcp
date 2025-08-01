# Cursor 集成指南

## 概述

这个MCP代码转换服务器可以直接与Cursor集成，提供代码转换功能。

## 安装和配置

### 1. 安装依赖

```bash
# 安装项目依赖
npm install

# 构建项目
npm run build
```

### 2. 配置Cursor

在Cursor中配置MCP服务器：

1. 打开Cursor设置
2. 找到MCP配置部分
3. 添加以下配置：

```json
{
  "mcpServers": {
    "mcp-cs2ts-server": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      },
      "cwd": "/path/to/your/mcp-cs2ts-server"
    }
  }
}
```

### 3. 启动服务器

```bash
# 开发模式
npm run dev

# 生产模式
npm run start:stdio
```

## 可用的工具

### 1. convert_code
转换代码片段

**参数：**
- `sourceCode`: 源代码
- `sourceLanguage`: 源语言 (csharp, java, python)
- `targetLanguage`: 目标语言 (typescript)
- `options`: 转换选项

**示例：**
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

### 2. convert_file
转换单个文件

**参数：**
- `filePath`: 源文件路径
- `targetLanguage`: 目标语言
- `outputPath`: 输出文件路径 (可选)
- `options`: 转换选项

**示例：**
```json
{
  "filePath": "./src/Example.cs",
  "targetLanguage": "typescript",
  "outputPath": "./output/Example.ts",
  "options": {}
}
```

### 3. convert_directory
转换整个目录

**参数：**
- `directoryPath`: 源目录路径
- `targetLanguage`: 目标语言
- `outputDirectory`: 输出目录路径 (可选)
- `options`: 转换选项

**示例：**
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

### 4. list_supported_languages
列出支持的语言转换

**示例：**
```json
{}
```

### 5. get_conversion_stats
获取转换统计信息

**参数：**
- `conversionId`: 转换ID

**示例：**
```json
{
  "conversionId": "conv_1234567890_abc123"
}
```

## 在Cursor中使用

### 1. 通过命令面板
1. 按 `Cmd/Ctrl + Shift + P` 打开命令面板
2. 搜索 "MCP" 或 "Convert"
3. 选择相应的转换命令

### 2. 通过聊天
在Cursor的聊天界面中，你可以直接要求AI进行代码转换：

```
请将以下C#代码转换为TypeScript：

public class User {
    public string Name { get; set; }
    public int Age { get; set; }
}
```

### 3. 通过快捷键
可以配置自定义快捷键来快速调用转换功能。

## 支持的转换

### C# → TypeScript
- 类转换
- 接口转换
- 方法转换
- 属性转换
- 枚举转换
- 命名空间到模块
- using到import
- 类型注解
- async/await
- 泛型
- 装饰器
- 访问修饰符

### Java → TypeScript
- 类转换
- 接口转换
- 方法转换
- 类型转换
- 包到模块
- import转换
- 泛型
- 注解到装饰器

### Python → TypeScript
- 类转换
- 函数转换
- 类型转换
- import转换
- 装饰器
- 列表推导式
- async/await

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

## 故障排除

### 1. 服务器无法启动
- 检查Node.js版本 (需要14+)
- 确保所有依赖已安装
- 检查端口是否被占用

### 2. 转换失败
- 检查源文件格式
- 查看日志输出
- 确认语言支持

### 3. Cursor无法连接
- 检查MCP配置
- 确认服务器正在运行
- 检查文件路径配置

## 开发模式

### 1. 本地开发
```bash
npm run dev
```

### 2. 调试
```bash
DEBUG=true npm run dev
```

### 3. 测试
```bash
npm test
```

## 扩展功能

### 1. 添加新语言支持
1. 创建新的转换器类
2. 继承BaseConverter
3. 实现转换逻辑
4. 注册转换器
5. 创建prompt模板

### 2. 自定义Prompt模板
1. 在prompts目录下创建模板文件
2. 使用变量占位符
3. 按语言分类组织

### 3. 配置自定义选项
1. 修改转换选项
2. 调整批处理参数
3. 自定义文件处理规则

## 性能优化

### 1. 批量处理
- 使用适当的批处理大小
- 避免内存溢出
- 监控处理进度

### 2. 缓存机制
- 缓存转换结果
- 避免重复转换
- 优化响应时间

### 3. 错误恢复
- 单个文件失败不影响整体
- 记录错误信息
- 提供重试机制 