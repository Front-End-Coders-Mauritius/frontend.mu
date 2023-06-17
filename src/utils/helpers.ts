export const random = (list: string[] | number[]) => list[Math.floor(Math.random() * list.length)];

// a function that converts string to safe variable name
// Path: src/utils/helpers.ts
export const toSafeVarName = (str: string) => str.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();