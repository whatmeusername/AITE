import ActiveElementState from "./packages/AITE_ActiveState/activeElementState";

import {editorWarning} from "./EditorUtils";
import {onKeyDownEvent, onKeyUpEvent} from "./EditorEvents";

import {EditorDOMState, getMutatedSelection, SelectionState, insertSelection, EditorCommands, ContentNode} from "./index";

interface editorConf {
	ContentNode: ContentNode;
}

let ActiveEditorState: EditorState;

function getEditorState(): EditorState {
	return ActiveEditorState;
}

function getSelectionState(): SelectionState {
	return ActiveEditorState.selectionState;
}

function getEditorEventStatus(): boolean {
	return ActiveEditorState.editorEventsActive;
}

function isNodeActive(key: number | undefined): boolean {
	if (key) {
		return getEditorState().EditorActiveElementState?.activeNodeKey === key;
	}
	return false;
}

function updateActiveEditor(EditorState: EditorState) {
	ActiveEditorState = EditorState;
}

function createEmptyEditorState(initData?: editorConf) {
	ActiveEditorState = new EditorState(initData);

	ActiveEditorState.EditorCommands.registerCommand("KEYDOWN_COMMAND", "HIGH_IGNORECARET_COMMAND", (event) => {
		onKeyDownEvent(event);
	});

	ActiveEditorState.EditorCommands.registerCommand("KEYUP_COMMAND", "HIGH_IGNORECARET_COMMAND", (event) => {
		onKeyUpEvent(event);
	});

	ActiveEditorState.EditorCommands.registerCommand("LETTER_INSERT_COMMAND", "HIGH_EDITOR_COMMAND", (event) => {
		ActiveEditorState.contentNode.insertLetter(event);
	});

	ActiveEditorState.EditorCommands.registerCommand("LETTER_REMOVE_COMMAND", "HIGH_EDITOR_COMMAND", () => {
		ActiveEditorState.contentNode.removeLetter();
	});

	ActiveEditorState.EditorCommands.registerCommand("FORWARD_LETTER_REMOVE_COMMAND", "HIGH_EDITOR_COMMAND", () => {
		getMutatedSelection("extend", "character", "forward");
		ActiveEditorState.selectionState.getCaretPosition();
		ActiveEditorState.contentNode.removeLetter();
		ActiveEditorState.replaceActiveSelectionWithPrevious();
	});

	ActiveEditorState.EditorCommands.registerCommand("ENTER_COMMAND", "HIGH_EDITOR_COMMAND", () => {
		ActiveEditorState.contentNode.handleEnterTest();
	});

	ActiveEditorState.EditorCommands.registerCommand("WORD_REMOVE_COMMAND", "HIGH_EDITOR_COMMAND", () => {
		getMutatedSelection("extend", "word", "backward");
		ActiveEditorState.selectionState.getCaretPosition();
		ActiveEditorState.contentNode.removeLetter();
		if (ActiveEditorState.selectionState.isOffsetOnStart() === false) {
			ActiveEditorState.selectionState.moveSelectionForward();
		}
	});

	ActiveEditorState.EditorCommands.registerCommand("FORWARD_WORD_REMOVE_COMMAND", "HIGH_EDITOR_COMMAND", () => {
		getMutatedSelection("extend", "word", "forward");
		ActiveEditorState.selectionState.getCaretPosition();
		ActiveEditorState.contentNode.removeLetter();
		ActiveEditorState.replaceActiveSelectionWithPrevious();
	});

	ActiveEditorState.EditorCommands.registerCommand("FORWARD_LINE_REMOVE_COMMAND", "HIGH_EDITOR_COMMAND", () => {
		getMutatedSelection("extend", "lineboundary", "forward");
		ActiveEditorState.selectionState.getCaretPosition();
		ActiveEditorState.contentNode.removeLetter();
		ActiveEditorState.replaceActiveSelectionWithPrevious();
	});

	ActiveEditorState.EditorCommands.registerCommand("LINE_REMOVE_COMMAND", "HIGH_EDITOR_COMMAND", () => {
		getMutatedSelection("extend", "lineboundary", "backward");
		ActiveEditorState.selectionState.getCaretPosition();
		ActiveEditorState.contentNode.removeLetter();
		if (ActiveEditorState.selectionState.isOffsetOnStart() === false) {
			ActiveEditorState.selectionState.moveSelectionForward();
		}
	});

	// ActiveEditorState.EditorCommands.registerCommand('CLICK_COMMAND', 'LOW_IGNORECARET_COMMAND', (event) =>
	// 	ActiveEditorState.EditorActiveElementState?.handleElementClick(event),
	// );

	ActiveEditorState.EditorCommands.listenRootEvent();

	return ActiveEditorState;
}

class EditorState {
	contentNode: ContentNode;
	selectionState: SelectionState;
	EditorCommands: EditorCommands;

	EditorActiveElementState: ActiveElementState;
	__editorDOMState: EditorDOMState;

	// __onError?: (...rest: any) => void

	focus: boolean;
	__readOnly: boolean;
	editorEventsActive: boolean;
	__previousSelection: insertSelection | undefined;

	constructor(initData?: editorConf) {
		updateActiveEditor(this);

		this.contentNode = initData?.ContentNode ?? new ContentNode();
		this.selectionState = new SelectionState();
		this.EditorCommands = new EditorCommands();
		this.EditorActiveElementState = new ActiveElementState();

		this.focus = false;
		this.editorEventsActive = true;

		this.__readOnly = false;
		this.__editorDOMState = new EditorDOMState(this);
		this.__previousSelection = undefined;
	}

	replaceActiveSelectionWithPrevious(): void {
		if (this.__previousSelection) {
			this.selectionState.insertSelectionData(this.__previousSelection);
			this.selectionState.setCaretPosition();
		} else editorWarning(true, "tried to set selection by previous selection data, when it undefined");
	}

	setPreviousSelection(): void {
		this.__previousSelection = this.selectionState.get();
	}

	onError(): void {
		// TODO:
	}
	onEditorDOMChange(): void {
		// TODO:
	}
}

export {isNodeActive, createEmptyEditorState, getEditorState, getSelectionState, getEditorEventStatus, updateActiveEditor};

export type {EditorState};
