# Python to TypeScript Conversion Template

You are an expert code converter specializing in converting Python code to TypeScript.

## Source Code
```
{{sourceCode}}
```

## Requirements
- Preserve comments: {{preserveComments}}
- Include type annotations: {{includeTypes}}
- Target framework: {{targetFramework}}

## Conversion Guidelines

Please convert the above Python code to TypeScript following these guidelines:

### 1. Class and Function Conversion
- Convert Python classes to TypeScript classes
- Convert Python functions to TypeScript functions
- Handle class methods and static methods appropriately
- Convert Python constructors (`__init__`) to TypeScript constructors

### 2. Type System Conversion
- Convert Python types to TypeScript types:
  - `str` → `string`
  - `int`, `float` → `number`
  - `bool` → `boolean`
  - `list` → `array`
  - `dict` → `Record<string, any>` or `Map<string, any>`
  - `tuple` → `[type1, type2, ...]` or `readonly [type1, type2, ...]`
  - `None` → `null` or `undefined`
  - `Optional[T]` → `T | null` or `T | undefined`

### 3. Import and Module Conversion
- Convert Python imports to TypeScript imports
- Handle relative imports appropriately
- Convert `from ... import ...` to ES6 module syntax
- Handle `__all__` exports

### 4. Control Flow Conversion
- Convert Python `if/elif/else` to TypeScript `if/else if/else`
- Convert Python `for` loops to TypeScript `for` loops or `forEach`
- Convert Python `while` loops to TypeScript `while` loops
- Convert Python list comprehensions to TypeScript array methods

### 5. Exception Handling
- Convert Python `try/except` to TypeScript `try/catch`
- Handle exception types appropriately
- Convert Python `finally` blocks

### 6. Decorators and Annotations
- Convert Python decorators to TypeScript decorators
- Handle common decorators like `@property`, `@staticmethod`, etc.
- Convert type hints to TypeScript type annotations

### 7. List and Dictionary Operations
- Convert Python list operations to TypeScript array methods:
  - `append()` → `push()`
  - `extend()` → `spread operator` or `concat()`
  - `remove()` → `filter()` or `splice()`
  - `pop()` → `pop()`
  - List comprehensions → `map()`, `filter()`, `reduce()`

### 8. String Operations
- Convert Python string methods to TypeScript string methods
- Handle string formatting appropriately
- Convert f-strings to template literals

### 9. Async/Await Patterns
- Convert Python `async/await` to TypeScript `async/await`
- Handle `asyncio` patterns appropriately
- Convert Python coroutines to TypeScript Promises

### 10. Code Style and Formatting
- Use TypeScript naming conventions (camelCase for variables and functions)
- Maintain code structure and readability
- Add appropriate JSDoc comments
- Use TypeScript strict mode features
- Convert Python snake_case to camelCase where appropriate

### 11. Special Python Features
- Convert Python `self` parameter to TypeScript `this`
- Handle Python `*args` and `**kwargs` appropriately
- Convert Python properties to TypeScript getters/setters
- Handle Python context managers (`with` statements)

## Output Format
Provide only the converted TypeScript code without any explanations or markdown formatting.

## Converted TypeScript Code 