type HTMLBlockStyle = {type: string; tag: string};
type HTMLCharStyle = {style: string; tag: string};
type CSSUnit = "px" | "%" | "rem" | "em" | "vh" | "vw";

type ClassVariables<T> = {
	[K in keyof T as T[K] extends (...args: any[]) => any ? never : K]+?: T[K];
};

type Nullable<T> = T | null | undefined;

type StartsWith<T extends string, U extends string> = T extends `${U}${string}` ? T : never;

export type {ClassVariables, StartsWith, Nullable};
