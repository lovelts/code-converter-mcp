# Java to TypeScript Conversion Template

You are an expert code converter specializing in converting Java code to TypeScript.

## Source Code
```
{{sourceCode}}
```

## Requirements
- Preserve comments: {{preserveComments}}
- Include type annotations: {{includeTypes}}
- Target framework: {{targetFramework}}

## Conversion Guidelines

Please convert the above Java code to TypeScript following these guidelines:

### 1. Class and Interface Conversion
- Convert Java classes to TypeScript classes
- Convert Java interfaces to TypeScript interfaces
- Maintain access modifiers (public, private, protected)
- Convert Java fields to TypeScript properties

### 2. Type System Conversion
- Convert Java types to TypeScript types:
  - `String` → `string`
  - `Integer`, `Long`, `Short`, `int`, `long`, `short` → `number`
  - `Double`, `Float`, `double`, `float` → `number`
  - `Boolean`, `boolean` → `boolean`
  - `Date` → `Date`
  - `List<T>` → `T[]`
  - `Map<K,V>` → `Record<K,V>` or `Map<K,V>`
  - `Optional<T>` → `T | undefined` or `T | null`

### 3. Package and Import Conversion
- Convert Java packages to TypeScript modules
- Convert `import` statements to ES6 module syntax
- Handle static imports appropriately

### 4. Method Conversion
- Convert Java methods to TypeScript methods
- Handle method overloading appropriately
- Convert method parameters and return types
- Handle static methods appropriately

### 5. Constructor Conversion
- Convert Java constructors to TypeScript constructors
- Handle constructor overloading
- Convert constructor parameters to class properties

### 6. Generics and Generic Constraints
- Convert Java generics to TypeScript generics
- Handle generic constraints appropriately
- Convert bounded wildcards to TypeScript constraints

### 7. Annotations and Decorators
- Convert Java annotations to TypeScript decorators where appropriate
- Handle common annotations like `@Override`, `@Deprecated`, etc.

### 8. Exception Handling
- Convert Java try-catch blocks to TypeScript try-catch
- Handle checked exceptions appropriately (make them unchecked in TypeScript)

### 9. Collections and Streams
- Convert Java collections to TypeScript arrays or Maps
- Convert Java streams to TypeScript array methods:
  - `filter()` → `filter()`
  - `map()` → `map()`
  - `findFirst()` → `find()`
  - `anyMatch()` → `some()`
  - `allMatch()` → `every()`
  - `count()` → `length`

### 10. Code Style and Formatting
- Use TypeScript naming conventions (camelCase for variables and methods)
- Maintain code structure and readability
- Add appropriate JSDoc comments
- Use TypeScript strict mode features

## Output Format
Provide only the converted TypeScript code without any explanations or markdown formatting.

## Converted TypeScript Code 