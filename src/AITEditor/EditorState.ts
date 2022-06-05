import ContentNode from './ContentNode';
import {SelectionState} from './SelectionUtils';
import type EditorCommands from './EditorCommands';
import type ActiveElementState from './packages/AITE_ActiveState/activeElementState';

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

	__readOnly: boolean;
	__updating: boolean;

	constructor(initData?: editorConf) {
		this.contentNode = initData?.ContentNode ?? new ContentNode();
		this.selectionState = new SelectionState();
		this.EditorCommands = undefined;
		this.EditorActiveElementState = undefined;

		this.__editorDOMState = new editorDOMState(this)
		this.__readOnly = false
		this.__updating = false
	}


	onError(){
		// TODO:
	}
	editorWillUpdate(){
		// TODO:
	}
	onUpdate(){
		//: TODO:
	}
	update(){
		// if(this.__rootElement === undefined && this.__editorDOMState === undefined){
		// 	this.__editorDOMState = createNewDOMstate(this)
		// 	this.__rootElement = returnSingleDOMNode(this.__editorDOMState)
		// }  

		// let currentEditorState = this.__editorDOMState
		// let nextEditorState = createNewDOMstate(this)
	}
}


export{
	createEmptyEditorState,
	getEditorState,
	getSelectionState,
	updateActiveEditor
}

export type{EditorState}