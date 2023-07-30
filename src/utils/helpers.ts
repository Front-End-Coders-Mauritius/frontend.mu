export const random = (list: string[] | number[]) => list[Math.floor(Math.random() * list.length)];

// a function that converts string to safe variable name
// Path: src/utils/helpers.ts
export const toSafeVarName = (str: string) => {    
    return str.toString().replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
}

export const vTransitionName = (modelType:string = 'meetup', str: string) => {
    return `view-transition-name: ${toSafeVarName(modelType)}-${toSafeVarName(str)}`
}