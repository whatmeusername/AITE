import {EditorState} from './EditorManagmentUtils';

export type EditorStateManager = React.Dispatch<React.SetStateAction<EditorState>>;

export type CharData = [string, Array<string>, Array<number>];
export type HTMLBlockStyle = {type: string; tag: string};
export type HTMLCharStyle = {style: string; tag: string};
export type CSSUnit = 'px' | '%' | 'rem' | 'em' | 'vh' | 'vw';

export type ClassVariables<T> = {
	readonly [K in keyof T as T[K] extends Function ? never : K]+?: T[K];
};

export interface ATEditorBlock {
	blockKey: string;
	blockLength: number;
	plainText: string;
	blockStyle: string;
	CharOffset: number;
	blockInlineStyles: Array<string>;
	CharData: Array<CharData>;
}

export interface ATEditor {
	blocks: Array<ATEditorBlock>;
	selectionState: EditorSelection;
}

export interface EditorSelection {
	anchorOffset: number;
	focusOffset: number;
	SelectionText: string;
	anchorKey: string;
	focusKey: string;
}

export interface blockHTML {
	blockKey: string;
	blockType: string;
	HTML: string;
	blockInlineStyles: Array<string>;
}

export type StartsWith<T extends string, U extends string> = T extends `${U}${string}` ? T : never;