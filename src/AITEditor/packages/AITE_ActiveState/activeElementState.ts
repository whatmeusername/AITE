import {findEditorCharIndex, isTextNode} from '../../EditorUtils';

import type {NodeTypes} from '../../BlockNode';
import type {BlockNode} from '../../BlockNode';
import type {EditorState} from '../../EditorState';
import {NodePath} from '../../SelectionUtils'

import type {selectionData} from '../../SelectionUtils'

type mouseEvent = React.MouseEvent | MouseEvent;
type EditorNodeSelectedData = {node: Node | HTMLElement; index: number} | undefined;

export default class ActiveElementState {
	EditorStateFunction: () => void;
	EditorState: EditorState;
	allowedAllements: Array<string>;
	isActive: boolean;
	activeNode: HTMLElement | null;
	charNode: number | null;
	blockNode: NodePath;

	constructor(EditorStateManager: () => void, editorState: EditorState) {
		this.EditorStateFunction = EditorStateManager;
		this.EditorState = editorState;
		this.allowedAllements = ['IMG'];
		this.isActive = false;
		this.activeNode = null;
		this.charNode = null;
		this.blockNode = new NodePath();
	}

	addElementToAllowed(element: string): void {
		if (this.allowedAllements.findIndex((o) => o === element) === -1) {
			this.allowedAllements.push(element);
		}
	}

	removeElementFromAllowed(element: string): void {
		let elementIndex = this.allowedAllements.findIndex((o) => o === element);
		if (elementIndex !== -1) {
			this.allowedAllements.splice(elementIndex, 1);
		}
	}
	resetActiveData(): void {
		this.isActive = false;
		this.activeNode = null;
		this.charNode = null;
		this.blockNode.set([]);
	}


	handleElementClick(event: MouseEvent): void {
		let nodeTag = (event.target as HTMLElement).tagName;
		let currentBlockData: selectionData | undefined = undefined;

		
		// const removeClickEvent = (): void => {
		// 	this.resetActiveData();
		// 	document.removeEventListener('click', editorClickEvent);
		// 	document.removeEventListener('keyup', backspaceEventHandler);
		// 	this.EditorStateFunction();
		// }

		// const editorClickEvent = (event: MouseEvent): void => {
		// 	if (event.target === null || event.defaultPrevented === true) return;
		// 	else if(isTextNode(event.target as HTMLElement)) {
		// 		removeClickEvent()
		// 	}
		// 	else if (this.allowedAllements.includes((event.target as HTMLElement).tagName)) {
		// 		let newBlockData = this.EditorState.selectionState.getPathToNodeByNode(event.target as HTMLElement);
		// 		if (newBlockData?.blockNode !== currentBlockData?.blockNode) {
		// 			currentBlockData = newBlockData;
		// 			if (currentBlockData !== undefined){
		// 				this.blockNode?.set(newBlockData!.NodePath);
		// 				this.charNode = newBlockData!.charIndex;
		// 				this.EditorStateFunction();
		// 			}
		// 		}
		// 	} 
		// 	else if (!(currentBlockData!.blockNode as HTMLElement).contains(event.target as HTMLElement)) {
		// 		removeClickEvent()
		// 	}
		// };

		// const backspaceEventHandler = (event: KeyboardEvent): void => {
		// 	if (event.key === 'Backspace' && this.blockNode !== null && this.charNode !== null) {
		// 		let currentBlock = this.EditorState.contentNode.getBlockByPath(this.blockNode.get());
		// 		if (currentBlock.getType() === 'standart') {
		// 			(currentBlock as BlockNode).removeCharNode(this.charNode);
		// 			this.resetActiveData();
		// 			document.removeEventListener('click', editorClickEvent);
		// 			document.removeEventListener('keyup', backspaceEventHandler);
		// 			this.EditorStateFunction();
		// 		}
		// 	}
		// };

		// if (this.allowedAllements.includes(nodeTag) && event.target !== null) {
		// 	currentBlockData = this.EditorState.selectionState.getPathToNodeByNode(event.target as HTMLElement);

		// 	if (currentBlockData !== undefined && currentBlockData !== undefined && this.isActive === false) {

		// 		this.blockNode.set(currentBlockData.NodePath);
		// 		this.charNode = currentBlockData.charIndex;
		// 		this.isActive = true;
		// 		this.EditorStateFunction();

		// 		let selection = window.getSelection();
		// 		if (selection !== null) selection.removeAllRanges();
		// 		this.EditorState.selectionState.resetSelection()
				
		// 		document.addEventListener('mousedown', editorClickEvent);
		// 		document.addEventListener('keyup', backspaceEventHandler);
		// 	}
		// }
	}

	getActiveNodes(): {block: BlockNode, char: NodeTypes} | undefined {
		if (this.blockNode !== null && this.charNode !== null) {
			let currentBlock = this.EditorState.contentNode.getBlockByPath(this.blockNode.getBlockPath()) as BlockNode;
			let currentChar = currentBlock.getNodeByIndex(this.charNode);
			return {block: currentBlock, char: currentChar};
		}
		return undefined;
	}
}
