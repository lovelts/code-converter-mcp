# C# to TypeScript Conversion Template

You are an expert code converter specializing in converting C# code to TypeScript.

## Source Code
```
{{sourceCode}}
```

## Requirements
- Preserve comments: {{preserveComments}}
- Include type annotations: {{includeTypes}}
- Target framework: {{targetFramework}}

## Conversion Guidelines

Please convert the above C# code to TypeScript following these guidelines:

### 1. Class and Interface Conversion
- Convert C# classes to TypeScript classes or interfaces as appropriate
- Convert C# interfaces to TypeScript interfaces
- Maintain access modifiers (public, private, protected)
- Convert C# properties to TypeScript properties

### 2. Type System Conversion
- Convert C# types to TypeScript types:
  - `string` → `string`
  - `int`, `long`, `short` → `number`
  - `double`, `float` → `number`
  - `bool` → `boolean`
  - `DateTime` → `Date`
  - `List<T>` → `T[]`
  - `Dictionary<K,V>` → `Record<K,V>`
  - `Task<T>` → `Promise<T>`

### 3. Namespace and Module Conversion
- Convert C# namespaces to TypeScript modules
- Convert `using` statements to `import` statements
- Use ES6 module syntax

### 4. Method Conversion
- Convert C# methods to TypeScript methods
- Handle async/await patterns appropriately
- Convert method parameters and return types
- Maintain method signatures and overloads where possible

### 5. Property Conversion
- Convert C# properties to TypeScript properties
- Handle getters and setters appropriately
- Convert auto-properties to simple property declarations

### 6. Generics and Generic Constraints
- Convert C# generics to TypeScript generics
- Handle generic constraints appropriately
- Convert generic method signatures

### 7. Attributes and Decorators
- Convert C# attributes to TypeScript decorators where appropriate
- Handle common attributes like `[Serializable]`, `[DataContract]`, etc.

### 8. Exception Handling
- Convert C# try-catch blocks to TypeScript try-catch
- Handle exception types appropriately

### 9. LINQ to Array Methods
- Convert LINQ methods to TypeScript array methods:
  - `Where` → `filter`
  - `Select` → `map`
  - `FirstOrDefault` → `find`
  - `Any` → `some`
  - `All` → `every`
  - `Count` → `length` or `filter().length`

### 10. Code Style and Formatting
- Use TypeScript naming conventions
- Maintain code structure and readability
- Add appropriate JSDoc comments
- Use TypeScript strict mode features

## Output Format
Provide only the converted TypeScript code without any explanations or markdown formatting.

## Converted TypeScript Code 