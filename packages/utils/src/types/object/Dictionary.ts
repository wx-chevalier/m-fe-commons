// type Dictionary<K extends string, T> = Partial<Record<K, T>>;
// type Dictionary<K extends string, T> = { [P in K]?: T };

// If you need to support numbers and symbols as keys:
// type Dictionary<K extends keyof any, T> = Partial<Record<K, T>>;
export type Dictionary<K extends keyof any, T> = { [P in K]?: T };
