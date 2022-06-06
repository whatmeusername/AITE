import ContentNode from './ContentNode';
import type EditorCommands from './EditorCommands';
import type ActiveElementState from './packages/AITE_ActiveState/activeElementState';

import {ClassVariables} from './Interfaces';
import {SelectionState, insertSelection} from './SelectionUtils'

import {editorWarning} from './EditorUtils'

import{
	editorDOMState,
	AiteNodes,
} from './AITEreconciliation'

interface editorConf{
	ContentNode: ContentNode;
}


let ActiveEditorState: EditorState | undefined = undefined

function getEditorState(){
	if(ActiveEditorState){
		return ActiveEditorState
	}
	return undefined
}

function getSelectionState(){
	if(ActiveEditorState){
		return ActiveEditorState.selectionState
	}
	return undefined
}
function updateActiveEditor(EditorState: EditorState){
	ActiveEditorState = EditorState
}

function createEmptyEditorState(initData?: editorConf){
	ActiveEditorState = new EditorState(initData)
	return ActiveEditorState
}

class EditorState {
	contentNode: ContentNode;
	selectionState: SelectionState;
	EditorCommands: EditorCommands | undefined;

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
		this.EditorCommands = undefined;
		this.EditorActiveElementState = undefined;

		this.focus = false;
		this.__editorDOMState = new editorDOMState(this)
		this.__readOnly = false
		this.__previousSelection = undefined
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

export type{EditorState}