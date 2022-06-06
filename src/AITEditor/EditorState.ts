
import type ActiveElementState from './packages/AITE_ActiveState/activeElementState';

import {ClassVariables} from './Interfaces';
import {editorWarning} from './EditorUtils'
import {onKeyDownEvent, onKeyUpEvent} from './EditorEvents';


import{
	editorDOMState,
	AiteNodes,
	getMutatedSelection,
	SelectionState, 
	insertSelection,
	EditorCommands,
	ContentNode,
} from './index'

interface editorConf{
	ContentNode: ContentNode;
}


let ActiveEditorState: EditorState

function getEditorState(){
	return ActiveEditorState
}

function getSelectionState(){
	return  ActiveEditorState.selectionState
}
function updateActiveEditor(EditorState: EditorState){
	ActiveEditorState = EditorState
}

function createEmptyEditorState(initData?: editorConf){

	ActiveEditorState = new EditorState(initData)
	// EditorState.EditorActiveElementState = new activeElementState(), EditorState);

	ActiveEditorState.EditorCommands.registerCommand('KEYDOWN_COMMAND', 'IGNOREMANAGER_EDITOR_COMMAND', (event) => {
		onKeyDownEvent(event);
	});

	ActiveEditorState.EditorCommands.registerCommand('KEYUP_COMMAND', 'IGNOREMANAGER_EDITOR_COMMAND', (event) => {
		onKeyUpEvent(event);
	});

	ActiveEditorState.EditorCommands.registerCommand('LETTER_INSERT_COMMAND', 'IMMEDIATELY_EDITOR_COMMAND', (event) => {
		ActiveEditorState.contentNode.insertLetterIntoTextNode(event, ActiveEditorState.selectionState);
	});

	ActiveEditorState.EditorCommands.registerCommand('LETTER_REMOVE_COMMAND', 'IMMEDIATELY_EDITOR_COMMAND', (_) => {
		ActiveEditorState.contentNode.removeLetterFromBlock(ActiveEditorState.selectionState);
	});

	ActiveEditorState.EditorCommands.registerCommand('FORWARD_LETTER_REMOVE_COMMAND', 'IMMEDIATELY_EDITOR_COMMAND', (_) => {
		getMutatedSelection('extend', 'character', 'forward');
		ActiveEditorState.selectionState.getCaretPosition();
		ActiveEditorState.contentNode.removeLetterFromBlock(ActiveEditorState.selectionState);
		ActiveEditorState.replaceActiveSelectionWithPrevious();
	});

	ActiveEditorState.EditorCommands.registerCommand('ENTER_COMMAND', 'IMMEDIATELY_EDITOR_COMMAND', (_) => {
		ActiveEditorState.contentNode.handleEnter(ActiveEditorState.selectionState);
	});

	ActiveEditorState.EditorCommands.registerCommand('WORD_REMOVE_COMMAND', 'IMMEDIATELY_EDITOR_COMMAND', (_) => {
		getMutatedSelection('extend', 'word', 'backward');
		ActiveEditorState.selectionState.getCaretPosition();
		ActiveEditorState.contentNode.removeLetterFromBlock(ActiveEditorState.selectionState);
		if (ActiveEditorState.selectionState.isOffsetOnStart() === false) {
			ActiveEditorState.selectionState.moveSelectionForward();
		}
	});

	ActiveEditorState.EditorCommands.registerCommand('FORWARD_WORD_REMOVE_COMMAND', 'IMMEDIATELY_EDITOR_COMMAND', (_) => {
		getMutatedSelection('extend', 'word', 'forward');
		ActiveEditorState.selectionState.getCaretPosition();
		ActiveEditorState.contentNode.removeLetterFromBlock(ActiveEditorState.selectionState);
		ActiveEditorState.replaceActiveSelectionWithPrevious();
	});

	ActiveEditorState.EditorCommands.registerCommand('FORWARD_LINE_REMOVE_COMMAND', 'IMMEDIATELY_EDITOR_COMMAND', (_) => {
		getMutatedSelection('extend', 'lineboundary', 'forward');
		ActiveEditorState.selectionState.getCaretPosition();
		ActiveEditorState.contentNode.removeLetterFromBlock(ActiveEditorState.selectionState);
		ActiveEditorState.replaceActiveSelectionWithPrevious();
	});

	ActiveEditorState.EditorCommands.registerCommand('LINE_REMOVE_COMMAND', 'IMMEDIATELY_EDITOR_COMMAND', (_) => {
		getMutatedSelection('extend', 'lineboundary', 'backward');
		ActiveEditorState.selectionState.getCaretPosition();
		ActiveEditorState.contentNode.removeLetterFromBlock(ActiveEditorState.selectionState);
		if (ActiveEditorState.selectionState.isOffsetOnStart() === false) {
			ActiveEditorState.selectionState.moveSelectionForward();
		}
	});

	ActiveEditorState.EditorCommands.registerCommand('SELECTION_COMMAND', 'IGNOREMANAGER_EDITOR_COMMAND', (_) => {
		ActiveEditorState.selectionState.getCaretPosition();
	});

	ActiveEditorState.EditorCommands.registerCommand('CLICK_COMMAND', 'IMMEDIATELY_EDITOR_COMMAND', (event) =>
		ActiveEditorState.EditorActiveElementState?.handleElementClick(event),
	);

	return ActiveEditorState
}

class EditorState {
	contentNode: ContentNode;
	selectionState: SelectionState;
	EditorCommands: EditorCommands;

	EditorActiveElementState: ActiveElementState | undefined;
	__editorDOMState: editorDOMState;

	// __editorConfig: any;
	// __commands?: EditorCommands;
	// __editorListeners?: Array<EventListener>;
	// __onError?: (...rest: any) => void

	focus: boolean;
	__readOnly: boolean;
	__previousSelection: insertSelection | undefined;

	constructor(initData?: editorConf) {
		this.contentNode = initData?.ContentNode ?? new ContentNode();
		this.selectionState = new SelectionState();
		this.EditorCommands = new EditorCommands();
		this.EditorActiveElementState = undefined;

		this.focus = false;
		this.__editorDOMState = new editorDOMState(this)
		this.__readOnly = false
		this.__previousSelection = undefined

		updateActiveEditor(this)
	}




	replaceActiveSelectionWithPrevious(): void{
		if(this.__previousSelection){
			this.selectionState.insertSelectionData(this.__previousSelection)
			this.selectionState.setCaretPosition()
		}
		else editorWarning(true, 'tried to set selection by previous selection data, when it undefined')
	}

	setPreviousSelection(): void{
		this.__previousSelection = this.selectionState.get()
	}

	onError(): void{
		// TODO:
	}
	onEditorDOMChange(): void{
		// TODO:
	}
}


export{
	createEmptyEditorState,
	getEditorState,
	getSelectionState,
	updateActiveEditor
}

export type
{
	EditorState
}