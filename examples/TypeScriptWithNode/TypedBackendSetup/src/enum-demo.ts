// A real TypeScript enum — a named set of constant values. Info/Warn/Error
// automatically get the numbers 0/1/2, in the order they're written.
enum LogLevel {
  Info,
  Warn,
  Error,
}

// LogLevel.Warn is really just the number 1 at runtime — but enum syntax
// itself (the "enum" keyword) is a real construct that has to be turned
// into plain JS somehow, which is exactly what strip-only mode struggles
// with (see this section's live demo below).
console.log(`LogLevel.Warn = ${LogLevel.Warn}`);
