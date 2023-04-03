import ActiveElementState from "./packages/AITE_ActiveState/activeElementState";

import {onKeyDownEvent, onKeyUpEvent} from "./commands/EditorEvents";

import {EditorDOMState, getMutatedSelection, SelectionState, EditorCommands, returnSingleDOMNode, PassContext} from "./index";
import {ClassVariables} from "./Interfaces";
import {BaseBlockNode, ContentNode} from "./nodes";
import {EditorWarning} from "./typeguards";

interface editorConf {
	ContentNode: ContentNode;
}

function createEmptyEditorState(initData?: editorConf) {
	const editorState = new EditorState(initData);

	editorState.EditorCommands.registerCommand("KEYDOWN_COMMAND", "HIGH_IGNORECARET_COMMAND", (event) => {
		onKeyDownEvent(event, editorState);
	});

	editorState.EditorCommands.registerCommand("KEYUP_COMMAND", "HIGH_IGNORECARET_COMMAND", (event) => {
		onKeyUpEvent(event, editorState);
	});

	editorState.EditorCommands.registerCommand("LETTER_INSERT_COMMAND", "HIGH_EDITOR_COMMAND", (event) => {
		editorState.selectionState.insertLetter(event);
		editorState.selectionState.stabilize();
	});

	editorState.EditorCommands.registerCommand("LETTER_REMOVE_COMMAND", "HIGH_EDITOR_COMMAND", () => {
		editorState.selectionState.removeLetter();
		editorState.selectionState.stabilize();
	});

	editorState.EditorCommands.registerCommand("FORWARD_LETTER_REMOVE_COMMAND", "HIGH_EDITOR_COMMAND", () => {
		getMutatedSelection("extend", "character", "forward");
		editorState.selectionState.getCaretPosition();
		editorState.selectionState.removeLetter();
		editorState.replaceActiveSelectionWithPrevious();
	});

	editorState.EditorCommands.registerCommand("ENTER_COMMAND", "HIGH_EDITOR_COMMAND", () => {
		editorState.selectionState.insertEnter();
		editorState.selectionState.stabilize(true);
	});

	editorState.EditorCommands.registerCommand("WORD_REMOVE_COMMAND", "HIGH_EDITOR_COMMAND", () => {
		getMutatedSelection("extend", "word", "backward");
		editorState.selectionState.getCaretPosition();
		editorState.selectionState.removeLetter();
		if (editorState.selectionState.isOffsetOnStart() === false) {
			editorState.selectionState.moveSelectionForward();
		}
	});

	editorState.EditorCommands.registerCommand("FORWARD_WORD_REMOVE_COMMAND", "HIGH_EDITOR_COMMAND", () => {
		getMutatedSelection("extend", "word", "forward");
		editorState.selectionState.getCaretPosition();
		editorState.selectionState.removeLetter();
		editorState.replaceActiveSelectionWithPrevious();
	});

	editorState.EditorCommands.registerCommand("FORWARD_LINE_REMOVE_COMMAND", "HIGH_EDITOR_COMMAND", () => {
		getMutatedSelection("extend", "lineboundary", "forward");
		editorState.selectionState.getCaretPosition();
		editorState.selectionState.removeLetter();
		editorState.replaceActiveSelectionWithPrevious();
	});

	editorState.EditorCommands.registerCommand("LINE_REMOVE_COMMAND", "HIGH_EDITOR_COMMAND", () => {
		getMutatedSelection("extend", "lineboundary", "backward");
		editorState.selectionState.getCaretPosition();
		editorState.selectionState.removeLetter();
		if (editorState.selectionState.isOffsetOnStart() === false) {
			editorState.selectionState.moveSelectionForward();
		}
	});

	// ActiveEditorState.EditorCommands.registerCommand('CLICK_COMMAND', 'LOW_IGNORECARET_COMMAND', (event) =>
	// 	ActiveEditorState.EditorActiveElementState?.handleElementClick(event),
	// );

	editorState.EditorCommands.listenRootEvent();

	return editorState;
}

class EditorState {
	contentNode: ContentNode;
	selectionState: SelectionState;
	EditorCommands: EditorCommands;

	EditorActiveElementState: ActiveElementState;
	EditorDOMState: EditorDOMState;

	// __onError?: (...rest: any) => void

	focus: boolean;
	__readOnly: boolean;
	editorEventsActive: boolean;
	__previousSelection: ClassVariables<SelectionState> | undefined;

	constructor(initData?: editorConf) {
		this.contentNode = initData?.ContentNode ?? new ContentNode(true);
		this.selectionState = new SelectionState();
		this.EditorCommands = new EditorCommands(this);
		this.EditorActiveElementState = new ActiveElementState();

		this.focus = false;
		this.editorEventsActive = true;

		this.__readOnly = false;
		this.EditorDOMState = new EditorDOMState();
	}

	replaceActiveSelectionWithPrevious(): void {
		if (this.__previousSelection) {
			//this.selectionState.insertSelectionData(this.__previousSelection);
			this.selectionState.setCaretPosition();
		} else EditorWarning(true, "tried to set selection by previous selection data, when it undefined");
	}

	onError(): void {
		// TODO:
	}
	onEditorDOMChange(): void {
		// TODO:
	}

	setInitialLayout(...nodes: BaseBlockNode[]): EditorState {
		this.contentNode.children = nodes;
		return this;
	}

	render(rootElement?: HTMLElement): HTMLElement {
		if (!rootElement) {
			const node = returnSingleDOMNode(PassContext({editor: this}, this.contentNode.createNodeState(this)));
			this.EditorDOMState.setDOMElement(node);
			return node;
		} else {
			rootElement.replaceChildren(returnSingleDOMNode(PassContext({editor: this}, this.contentNode.createNodeState(this))));
			this.EditorDOMState.setDOMElement(rootElement);
			return rootElement;
		}
	}
}

export {createEmptyEditorState, EditorState};
