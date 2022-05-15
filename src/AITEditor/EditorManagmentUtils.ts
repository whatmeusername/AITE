import ContentNode from './ContentNode';
import {SelectionState} from './SelectionUtils';
import type EditorCommands from './EditorCommands';
import type ActiveElementState from './packages/AITE_ActiveState/activeElementState';

type EditorConfig = {
	React?: boolean;
	defaultClass: string;
	editorDepth: number | undefined;
};

const defaultEditorConfig = {
	React: true,
	defaultClass: 'ATE__editor',
	editorDepth: undefined,
};

export class EditorState {
	contentNode: ContentNode;
	selectionState: SelectionState;
	editorConfig: EditorConfig;
	EditorCommands: EditorCommands | undefined;
	EditorActiveElementState: ActiveElementState | undefined;

	constructor(editorConfig: EditorConfig = defaultEditorConfig) {
		this.contentNode = new ContentNode();
		this.selectionState = new SelectionState();
		this.editorConfig = defaultEditorConfig;
		this.EditorCommands = undefined;
		this.EditorActiveElementState = undefined;
	}
}
