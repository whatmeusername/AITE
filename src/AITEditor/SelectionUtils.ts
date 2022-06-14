

import {ClassVariables} from './Interfaces';
import {HTML_TEXT_NODE, BREAK_LINE_TAGNAME, BREAK_LINE_TYPE, ELEMENT_NODE_TYPE, TEXT_NODE_TYPE, STANDART_BLOCK_TYPE} from './ConstVariables';
import {getChildrenNodes, isDefined} from './EditorUtils';


import {
	getEditorState,
	AiteHTMLNode,
	BlockNode,
	ContentNode
} from './index'

import type{
	BlockType
} from './index'
import { AiteHTMLTextNode } from './AITEreconciliation';

interface blockNodeDataExtended {
	node: AiteHTMLNode;
	nodePath: Array<number>;
	elementType: string | null;
}

interface selectionData {
	nodeKey: string | undefined;
	node: AiteHTMLNode;
	nodePath: Array<number>;
}

type granularity = "character" | "word" | "sentence" |  "line" | "lineboundary" | "sentenceboundary"


interface insertSelection extends Omit<ClassVariables<SelectionState>, 'anchorPath' | 'focusPath'>{
	anchorPath?: Array<number>;
	focusPath?: Array<number>;
}

/**
 * Checks if selection is backward direction
 * @returns boolean
 */
const isSelectionBackward = (rangeOrSelection: Selection | Range) => {
	if(rangeOrSelection instanceof Selection){
		let pos = rangeOrSelection?.anchorNode?.compareDocumentPosition(rangeOrSelection.focusNode as HTMLElement);
		if ((!pos && rangeOrSelection.anchorOffset > rangeOrSelection.focusOffset) || pos === Node.DOCUMENT_POSITION_PRECEDING) return true;
		return false;
	}
	else {
		let pos = rangeOrSelection?.startContainer?.compareDocumentPosition(rangeOrSelection.endContainer as HTMLElement);
		if ((!pos && rangeOrSelection.startOffset > rangeOrSelection.endOffset) || pos === Node.DOCUMENT_POSITION_PRECEDING) return true;
		return false;
	}
}
/**
 * Returns window getSelection()
 * @returns Selection
 */
const getSelection = (): Selection => window.getSelection() as Selection;

/**
 * Returns window getSelection() with applied modifications to selection
 * @returns Selection
 */
const getMutatedSelection = (
	alter: "move" | 'extend', 
	granularity: granularity,
	direction?: 'backward' | 'forward'
	): Selection => {
	let selection = getSelection()
	// @ts-expect-error
	selection.modify(
		alter,
		direction ? direction : (isSelectionBackward(selection) ? 'backward' : 'forward'),
		granularity
		)
		
	return selection
}


class NodePath {
	path: Array<number>;

	constructor(path?: Array<number>) {
		this.path = path ?? [];
	}

	set(path: Array<number> | undefined): void {
		if (path !== undefined) this.path = path;
	}


	getContentNode(){
		let length = this.length() - 1
		if(length <= 1){
			return []
		}
		else if(length > 1){
			return this.path.slice(0, length - 1)
		}
		else return []
	}

	getBlockPath(){
		let length = this.length() - 1
		if(length > 0){
			return this.path.slice(0, length)
		}
		else return this.path
	}

	getBlockIndex(){
		let length = this.length() - 1
		if(length > 0){
			return this.path[length - 1]
		}
		else return this.getLastIndex()
	}

	addOrRemoveToBlock(operator: 'dec' | 'inc', value: number){
		let length = this.length() - 1
		if(length > 0){
			if(operator === 'dec'){
				this.path[length - 1] -= value
			}
			else this.path[length - 1] += value
		}
		else {
			if(operator === 'dec'){
				this.path[length] -= value
			}
			else this.path[length] += value
		}
	}

	addOrRemoveToContent(operator: 'dec' | 'inc', value: number){
		let length = this.length() - 1
		if(length > 1){
			if(operator === 'dec'){
				this.path[length - 1] -= value
			}
			else this.path[length - 1] += value
		}
	}

	addOrRemoveToNode(operator: 'dec' | 'inc', value: number){
		let length = this.length() - 1
		if(length >= 0){
			if(operator === 'dec'){
				this.path[length] -= value
			}
			else this.path[length] += value
		}
	}

	getContentNodeIndex(){
		let length = this.length() - 1
		if(length <= 1){
			return 0
		}
		else if(length > 1){
			return this.path[length - 1]
		}
		else return 0
	}

	get() {
		return this.path;
	}

	length() {
		return this.path.length;
	}

	getLastIndex(): number {
		return this.path[this.path.length - 1];
	}

	setLastPathIndex(index: number): void {
		this.path[this.path.length - 1] = index;
	}
}

class SelectionState {
	anchorOffset: number;
	focusOffset: number;

	anchorPath: NodePath;
	focusPath: NodePath;

	_anchorNode: Node | number | null;
	_focusNode: Node | number | null;

	anchorType: string | null;
	focusType: string | null;

	isCollapsed: boolean;
	isDirty: boolean;

	constructor() {
		this.anchorOffset = 0;
		this.focusOffset = 0;

		this.anchorPath = new NodePath();
		this.focusPath = new NodePath();

		this._anchorNode = null; // DEPRECATED / MAYBE CAN BE USED TO SPEEDUP PERFMONCE
		this._focusNode = null; // DEPRECATED / MAYBE CAN BE USED TO SPEEDUP PERFMONCE

		this.anchorType = null;
		this.focusType = null;

		this.isCollapsed = false;
		this.isDirty = false; // DEPRECATED / RANGE USING HTML FRAGMENT TO FIND NODES
	}

	set anchorNode(Node: Node | number | null) {
		if (typeof Node === 'number') {
			this.isDirty = true;
			this._anchorNode = Node;
		} else {
			this.isDirty = false;
			this._anchorNode = Node;
		}
	}

	set focusNode(Node: Node | number | null) {
		if (typeof Node === 'number') {
			this.isDirty = true;
			this._focusNode = Node;
		} else {
			this.isDirty = false;
			this._focusNode = Node;
		}
	}

	get anchorNode() {
		return this._anchorNode;
	}

	get focusNode() {
		return this._focusNode;
	}


	// DEPRECATED / TODO
	isNodesSame(): boolean {
		return this.focusPath.getLastIndex() === this.anchorPath.getLastIndex()
	}

	/**
	 * Checks if selection anchor is on begging of block
	 * @returns boolean
	 */
	isAnchorOnStart(): boolean {
		return this.anchorPath.getLastIndex() === 0 && this.anchorOffset === 0
	}

	/**
	 * Checks if selection focus is on begging of block
	 * @returns boolean
	 */
	isFocusOnStart(): boolean {
		return this.focusPath.getLastIndex() === 0 && this.focusOffset === 0
	}

	
	/**
	 * Checks if selection focus and anchor is on begging of block
	 * @returns boolean
	 */
	isOffsetOnStart(): boolean {
		return (
			this.anchorPath.getLastIndex() === 0 && 
			this.anchorOffset === 0 &&
			this.focusPath.getLastIndex() === 0 && 
			this.focusOffset === 0
		)
	}

	// DEPRECATED / DONT USED
	isFullBlockSelected(): boolean {

		let anchorPath = this.anchorPath
		let focusPath = this.focusPath
		if (
			(anchorPath.getLastIndex() === 0 || anchorPath.getLastIndex() === -1) &&
			this.anchorOffset === 0 &&
			focusPath.getBlockPath()[anchorPath.getBlockPath.length - 1] === anchorPath.getBlockPath()[anchorPath.getBlockPath.length - 1] + 1 &&
			(focusPath.getLastIndex() === 0 || focusPath.getLastIndex() === -1) &&
			this.focusOffset === 0
		)
			return true;
		else return false;
	}

	// DEPRECATED / TODO: REMOVE
	enableDirty(): SelectionState{
		this.isDirty = true;
		return this
	}

	/**
	 * Resets SelectionState to it initial state
	 * @returns SelectionState - собственный возрат
	 */
	resetSelection(): SelectionState {
		this.anchorOffset = 0;
		this.focusOffset = 0;

		this.anchorPath = new NodePath();
		this.focusPath = new NodePath();

		this._anchorNode = null;
		this._focusNode = null;

		this.anchorType = null;
		this.focusType = null;

		this.isCollapsed = false;
		this.isDirty = false;
		return this;
	}
	
	/**
	 * Settings anchor and focus offsets to zero
	 * @returns SelectionState - returning self
	 */
	offsetToZero(): SelectionState{
		this.anchorOffset = 0;
		this.focusOffset = 0;
		return this
	}
	/**
	 * Moving selection to begging of block
	 * @returns SelectionState - returning self
	 */
	moveBlockOffsetToZero(): SelectionState{
		this.offsetToZero()
		this.anchorPath.setLastPathIndex(0);
		this.focusPath.setLastPathIndex(0);
		return this
	}

	/**
	 * Finding path to node, that can used in Object Nodes
	 * @param  {AiteHTMLNode} node  - Node which requires path
	 * @returns selectionData - self return
	 */
	getPathToNodeByNode(node: AiteHTMLNode): selectionData | undefined{

		if(node.$$isAiteNode === true){

			if(node.$$isAiteWrapper === true){
				while(node.$$isAiteWrapper){
					node = node.parentNode as AiteHTMLNode
					if(node.$$isAiteNode === undefined){
						return undefined
					}
					
				}
			}
			else if(node.dataset?.aite_decorator_node === undefined){
				node = node.firstChild ? (node.firstChild as AiteHTMLNode) : node;
			} 

			if(node instanceof Text){
				node = node.parentNode as AiteHTMLNode;
			}
		
			let data: selectionData = {
				nodeKey: node.$$AiteNodeKey,
				node: node,
				nodePath: [],
			};


			while(node !== undefined) {
				let parentNode = node.parentNode as AiteHTMLNode
				if(parentNode?.dataset?.aite_editor_root !== undefined){
					let nodeIndex = Array.from(parentNode.children).indexOf(node);
					data.nodePath.unshift(nodeIndex)
					return data
				}
				if(parentNode.$$isAiteWrapper === false){
					if(node.dataset.aite_content_node === undefined){
						let nodeIndex = Array.from(parentNode.children).indexOf(node);
						data.nodePath.unshift(nodeIndex)
					}
					if(parentNode?.dataset?.aite_editor_root !== undefined){
						return data
					}
				}
				node = parentNode
			}	
		}
		return undefined
	}

	/**
	 * Moving selection to next node or block
	 * @param  {ContentNode} ContentNode - ContentNode where next node will be searched
	 * @param  {number} step - How much nodes should be skipped
	 * @returns SelectionState - Self return
	 */
	moveSelectionToNextSibling(ContentNode: ContentNode, step?: number): SelectionState {
		let blockIndex = this.focusPath;
		let focusChar = this.focusPath.getLastIndex() + 1;

		let FocusBlock = ContentNode.getBlockByPath(this.focusPath.getBlockPath()) as BlockType;
		let nextNode = (FocusBlock as BlockNode).NodeData[focusChar] ?? undefined;

		if (nextNode === undefined) {
			while (nextNode === undefined) {
				blockIndex.addOrRemoveToBlock('inc', 1);
				FocusBlock = ContentNode.getBlockByPath(this.focusPath.getBlockPath());
				if (FocusBlock === undefined) break;
				else if (FocusBlock.getType() === STANDART_BLOCK_TYPE) {
					nextNode = (FocusBlock as BlockNode).NodeData[0];
					focusChar = 0;
					break;
				}
			}
		}
		if (nextNode !== undefined) {
			let anchorOffset = step !== undefined ? (nextNode.getContentLength() < step ? nextNode.getContentLength() : step) : 0;

			this.anchorPath = blockIndex;
			this.focusPath = blockIndex;

			this._anchorNode = focusChar;
			this._focusNode = focusChar;

			this.anchorOffset = anchorOffset;
			this.focusOffset = anchorOffset;

			this.anchorPath.setLastPathIndex(focusChar);
			this.focusPath.setLastPathIndex(focusChar);

			this.anchorType = nextNode.getType();
			this.focusType = nextNode.getType();

			this.isDirty = true;
		}
		return this
	}

	/**
	 * Moving selection to previous node or block
	 * @param  {ContentNode} ContentNode - ContentNode where previous node will be searched
	 * @returns SelectionState - Self return
	 */
	moveSelectionToPreviousBlock(ContentNode: ContentNode): SelectionState{
		this.anchorPath.addOrRemoveToBlock('dec', 1)
		let anchorBlock = ContentNode.getBlockByPath(this.anchorPath.getBlockPath());

		let lastNode;
		let lastNodeIndex: number | undefined

		if(anchorBlock instanceof BlockNode){
			lastNode = anchorBlock.getNodeByIndex(anchorBlock.lastNodeIndex())
			lastNodeIndex = anchorBlock.lastNodeIndex();
		}
		else{
			while(anchorBlock !== undefined){
				this.anchorPath.addOrRemoveToBlock('dec', 1)
				anchorBlock = ContentNode.getBlockByPath(this.anchorPath.getBlockPath());
				if(anchorBlock instanceof BlockNode){
					lastNode = anchorBlock.getNodeByIndex(anchorBlock.lastNodeIndex())
					lastNodeIndex = anchorBlock.lastNodeIndex();
				}
			}
		}
		if(lastNode && isDefined(lastNodeIndex)){

			this.anchorOffset = lastNode.getContentLength();
			this.focusOffset = lastNode.getContentLength();

			this.anchorPath.setLastPathIndex(lastNodeIndex ?? 0)
			this.focusPath.setLastPathIndex(lastNodeIndex ?? 0)

			this.anchorType = lastNode.getType() !== 'text' ? 'element' : 'text';
			this.focusType = this.anchorType;

			this.isDirty = true;
		}
		return this
	}

	/**
	 * Moving selection to next block
	 * @param  {ContentNode} ContentNode -  ContentNode where next block will be searched
	 * @returns SelectionState - Self return
	 */
	moveSelectionToNextBlock(ContentNode: ContentNode): SelectionState{
		this.anchorPath.addOrRemoveToBlock('dec', 1)
		let anchorBlock = ContentNode.getBlockByPath(this.anchorPath.getBlockPath());

		let firstNode;

		if(anchorBlock instanceof BlockNode){
			firstNode = anchorBlock.getNodeByIndex(0)
		}
		else{
			while(anchorBlock !== undefined){
				this.anchorPath.addOrRemoveToBlock('dec', 1)
				anchorBlock = ContentNode.getBlockByPath(this.anchorPath.getBlockPath());
				if(anchorBlock instanceof BlockNode){
					firstNode = anchorBlock.getNodeByIndex(0)
				}
			}
		}
		if(firstNode){

			this.anchorOffset = 0
			this.focusOffset = 0

			this.anchorPath.setLastPathIndex(0);
			this.focusPath.setLastPathIndex(0)

			this.anchorType = firstNode.getType() !== 'text' ? 'element' : 'text';
			this.focusType = this.anchorType;

			this.isDirty = true;
		}
		return this
	}

	
	/**
	 * Moving selection to previous block
	 * @param  {ContentNode} ContentNode -  ContentNode where previous block will be searched
	 * @returns SelectionState - Self return
	 */
	moveSelectionToPreviousSibling(ContentNode: ContentNode): SelectionState {
		let blockIndex = this.anchorPath;
		let acnhorChar = this.anchorPath.getLastIndex() - 1

		let anchorBlock = ContentNode.getBlockByPath(blockIndex.getBlockPath());
		let nextNode = acnhorChar > -1 ? (anchorBlock as BlockNode).NodeData[acnhorChar] : undefined;

		if (nextNode === undefined) {
			while (nextNode === undefined) {
				blockIndex.addOrRemoveToBlock('dec', 1);
				ContentNode.getBlockByPath(this.anchorPath.getBlockPath());
				if (anchorBlock === undefined) break;
				if (anchorBlock.getType() === STANDART_BLOCK_TYPE) {
					nextNode = (anchorBlock as BlockNode).NodeData[(anchorBlock as BlockNode).lastNodeIndex()];
					acnhorChar = (anchorBlock as BlockNode).lastNodeIndex();
					break;
				}
			}
		}

		if (nextNode !== undefined) {
			this.anchorPath = blockIndex;
			this.focusPath = blockIndex;

			this._anchorNode = acnhorChar;
			this._focusNode = acnhorChar;

			this.anchorOffset = nextNode.getContentLength();
			this.focusOffset = nextNode.getContentLength();

			this.anchorPath.setLastPathIndex(acnhorChar)
			this.focusPath.setLastPathIndex(acnhorChar)

			this.anchorType = nextNode.getType() !== 'text' ? 'element' : 'text';
			this.focusType = this.anchorType;

			this.isDirty = true;
		}
		return this
	}

	/**
	 * Moving selection offset forward by 1
	 * @returns SelectionState - Self return
	 */
	moveSelectionForward(): SelectionState {
		this.anchorOffset += 1;
		this.focusOffset += 1;
		return this
	}

	/**
	 * Moving selection offset backward by 1
	 * @returns SelectionState - Self return
	 */
	moveSelectionBackward(): SelectionState {
		this.anchorOffset -= 1;
		this.focusOffset -= 1;
		return this
	}

	/**
	 * Checks if andhor and focus NodePaths is same
	 * @returns SelectionState - Self return
	 */
	isBlockPathEqual(): boolean {
		let focusPathArr = this.focusPath.getBlockPath();
		let anchorPathArr = this.anchorPath.getBlockPath();
		for (let i = 0; i < this.anchorPath.length(); i++) {
			if (anchorPathArr[i] !== focusPathArr[i]) return false;
		}
		return true;
	}

	getTextNode(node: HTMLElement): {isTextNode: boolean, TextNode: undefined | HTMLElement} {
		let childrenNode: HTMLElement | undefined = node;
		let data: {isTextNode: boolean, TextNode: undefined | HTMLElement} = {isTextNode: false, TextNode: undefined}
		while(childrenNode !== undefined) {
			if(childrenNode?.nodeType === HTML_TEXT_NODE || childrenNode?.tagName === BREAK_LINE_TAGNAME){
				data.isTextNode = true
				data.TextNode = childrenNode
				return data
			}
			else childrenNode = childrenNode?.firstChild as HTMLElement
			if(childrenNode === undefined) break
		}
		return data
	}

	/**
	 * Collapsing selection
	 * @param  {boolean=false} focus - Collapse using focus data
	 * @returns SelectionState - Self return
	 */
	toggleCollapse(focus: boolean = false): SelectionState {
		this.isCollapsed = true;
		if (focus === true) {
			this.anchorOffset = this.focusOffset;
			this.anchorNode = this.focusNode;
			this.anchorPath.setLastPathIndex(this.focusPath.getLastIndex())
			this.anchorType = this.focusType;
			this.anchorPath = this.focusPath;
		} else {
			this.focusType = this.anchorType;
			this.focusPath = this.anchorPath;
			this.focusOffset = this.anchorOffset;
			this.focusNode = this.anchorNode;
			this.focusPath.setLastPathIndex(this.anchorPath.getLastIndex())
		}
		return this
	}

	/**
	 * Defines node type
	 * @param  {Node|HTMLElement|AiteHTMLNode} node - Node which type shoul be defined
	 * @returns string - Node type
	 */
	$getNodeType(node: Node | HTMLElement | AiteHTMLNode): string | null {

		if(node.nodeName === BREAK_LINE_TAGNAME) return BREAK_LINE_TYPE;
		else if(node.nodeType === HTML_TEXT_NODE) return TEXT_NODE_TYPE
		else{
			while (node.firstChild !== null) {
				node = node.firstChild;
			}

			if (node.nodeType === HTML_TEXT_NODE || node.nodeName === BREAK_LINE_TYPE) return TEXT_NODE_TYPE;
			else if(node.nodeName === BREAK_LINE_TAGNAME) return BREAK_LINE_TYPE;
			else if (node.nodeType === 1) return ELEMENT_NODE_TYPE;

			return null
		}
	}

	/**
	 * Unfolds current selection data 
	 * @returns void
	 */
	__reverseSelection(): void {
		let selectionCopy = {...this};

		this.focusNode = selectionCopy.anchorNode; 
		this.anchorNode = selectionCopy.focusNode;

		this.focusNode = selectionCopy.anchorOffset;
		this.anchorNode = selectionCopy.focusOffset;

		this.anchorPath.setLastPathIndex(selectionCopy.anchorPath.getLastIndex())
		this.focusPath.setLastPathIndex(selectionCopy.focusPath.getLastIndex())

		this.focusPath = selectionCopy.anchorPath;
		this.anchorPath = selectionCopy.focusPath;

		this.focusType = selectionCopy.anchorType;
		this.anchorType = selectionCopy.focusType;
	}

	/**
	 * Gets data from selected node
	 * @param  {Node} node - node which data should be getted
	 * @returns blockNodeDataExtended
	 */
	__getBlockNode(node: AiteHTMLNode | AiteHTMLTextNode): blockNodeDataExtended {
		let currentBlockData = this.getPathToNodeByNode(node as AiteHTMLNode);
		if (currentBlockData !== undefined) {
			let ElementType = null;
			if (node?.firstChild?.nodeName === BREAK_LINE_TAGNAME) {
				ElementType = BREAK_LINE_TYPE;
			} else {
				ElementType = node.$$AiteNodeType ? node.$$AiteNodeType : this.$getNodeType(node);
			}

			let Result: blockNodeDataExtended = {
				node: currentBlockData.node,
				nodePath: currentBlockData.nodePath,
				elementType: ElementType,
			};
			return Result;
			// TODO: REPLACE WITH onError METHOD
		} else throw new Error(`Not returned return value during condition check`);
	}

	// DEPRECATED / TODO: TO REMOVE
	$normailizeDirtySelection(EditorRef: React.MutableRefObject<HTMLDivElement>): void {
		let EditorNode: HTMLDivElement = EditorRef.current;
		let EditorNodes = getChildrenNodes(EditorNode);


		function __getCharNode(path: NodePath, currentNode: HTMLElement): HTMLElement | undefined {
			let currentBlock: HTMLElement | undefined;
			let pathArray = path.get();

			for (let i = 1; i < path.length(); i++) {
				let childrens = getChildrenNodes(currentNode);
				let nextNode = childrens[pathArray[i]] as HTMLElement;
				let nextChildrenDataset = nextNode?.dataset;
				if (
					i === path.length() - 1 &&
					(currentNode?.dataset?.aite_block_node === undefined || currentNode?.dataset?.aite_block_content_node !== undefined)
				) {
					currentBlock = childrens.find((node) => {
						if ((node as HTMLElement).dataset.aite_block_node !== undefined || (node as HTMLElement).dataset.aite_block_content_node !== undefined)
							return true;
						return false;
					}) as HTMLElement;
					if (currentBlock !== undefined) {
						return (currentBlock = getChildrenNodes(currentBlock)[pathArray[i]] as HTMLElement);
					}
				} else if (nextChildrenDataset?.aite_block_node !== undefined || nextChildrenDataset?.aite_block_content_node !== undefined) {
					currentNode = childrens[pathArray[i]] as HTMLElement;
				} else {
					if (nextNode.children.length === 0) {
						currentNode = childrens.find((node) => {
							if (
								(node as HTMLElement).dataset.aite_block_node !== undefined ||
								(node as HTMLElement).dataset.aite_block_content_node !== undefined
							)
								return true;
							return false;
						}) as HTMLElement;
						currentNode = getChildrenNodes(currentNode)[pathArray[i]] as HTMLElement;
					} else currentNode = childrens[pathArray[i]] as HTMLElement;
				}
			}
			return currentBlock;
		}

		let anchorNodeBlock = undefined;
		let focusNodeBlock = undefined;

		if (this.anchorPath.length() === 1) anchorNodeBlock = EditorNodes[this.anchorPath.get()[0]];
		else anchorNodeBlock = __getCharNode(this.anchorPath, EditorNodes[this.anchorPath.get()[0]] as HTMLElement);

		if (this.anchorPath.length() === 1) focusNodeBlock = EditorNodes[this.focusPath.get()[0]];
		else focusNodeBlock = __getCharNode(this.focusPath, EditorNodes[this.focusPath.get()[0]] as HTMLElement);


		
		let anchorNode = undefined;
		let focusNode = undefined;

		if (anchorNodeBlock !== undefined) anchorNode = getChildrenNodes(anchorNodeBlock)[this.anchorPath.getLastIndex()] as HTMLElement;
		if (focusNodeBlock !== undefined) focusNode = getChildrenNodes(focusNodeBlock)[this.focusPath.getLastIndex()] as HTMLElement;

		if (anchorNode !== undefined && focusNode !== undefined) {
			let textNode = this.getTextNode(anchorNode)


			if (textNode.isTextNode) this.anchorNode = textNode.TextNode as HTMLElement;
			else this.anchorNode = anchorNode.firstChild;

			if (textNode.isTextNode) this.focusNode = textNode.TextNode as HTMLElement;
			else this.focusNode = anchorNode.firstChild;
			this.isDirty = false;
		}
	}

	removeSelection(): void {
		let selection = getSelection();
		if(selection){
			selection.removeAllRanges()
		}
	}

	/**
	 * Get current caret data by selection
	 * @param  {Range|undefined} forceRange - forced Range which data will be used to set selectionState data
	 * @returns void
	 */
	getCaretPosition(forceRange?: Range ): void {

		let selection = getSelection()
		if(forceRange === undefined && (!selection.anchorNode || !selection.focusNode)) return;

		let range = forceRange ?? selection.getRangeAt(0);
		let anchorNode = range?.startContainer as AiteHTMLNode | AiteHTMLTextNode
		let focusNode = range?.endContainer as AiteHTMLNode | AiteHTMLTextNode


		if (range !== undefined) {
			if (
				(!anchorNode || !focusNode) ||
				(!anchorNode.$$isAiteNode || !anchorNode.$$isAiteNode)
				) return;

			let isCollapsed = range.collapsed;
			this.isCollapsed = isCollapsed;
			let isBackward = isSelectionBackward(range);

			let anchorNodeData = this.__getBlockNode(anchorNode);

			if (anchorNodeData) {

				this.anchorNode = focusNode;
				this.anchorType = anchorNodeData.elementType;
				this.anchorPath.setLastPathIndex(anchorNodeData.nodePath[anchorNodeData.nodePath.length - 1]);
				this.anchorPath = new NodePath(anchorNodeData.nodePath);

				this.anchorOffset = isBackward ? range.endOffset: range.startOffset;

				if (isCollapsed) this.toggleCollapse();
			}

			if (!isCollapsed) {
				let focusNodeData = this.__getBlockNode(focusNode);

				this._focusNode = focusNode;
				this.focusType = focusNodeData.elementType;
				this.focusPath.setLastPathIndex(focusNodeData.nodePath[focusNodeData.nodePath.length - 1])
				this.focusPath = new NodePath(focusNodeData.nodePath);

				this.focusOffset = isBackward ? range.startOffset: range.endOffset;

				if (this.anchorPath.length() !== this.focusPath.length()) {
					this.toggleCollapse();
					this.focusOffset = (this.focusNode as HTMLElement).textContent?.length ?? this.focusOffset;
				}
			}
		}
	}
	
	/**
	 * Set caret position using 
	 * @returns void
	 */
	setCaretPosition(): void {
		let selection = window.getSelection();

		if (selection) {
			let range = document.createRange();
			let EditorState = getEditorState()

			let anchorNode = EditorState?.__editorDOMState.getDOMNode(this.anchorPath.get())
			if(anchorNode === undefined) return;
			let anchorType = this.$getNodeType(anchorNode)

			let focusNode
			let focusType
			

			if(this.isCollapsed){
				focusNode = anchorNode
			}
			else{
				focusNode = EditorState?.__editorDOMState.getDOMNode(this.focusPath.get())
				if(focusNode === undefined) return;
				focusType = this.$getNodeType(focusNode)
			}

			if (anchorType === TEXT_NODE_TYPE) {
				let anchorNodeText = (anchorNode as Node).textContent;
				if (anchorNodeText !== null) {
					if (this.anchorOffset > anchorNodeText.length) {
						this.anchorOffset = anchorNodeText.length;
					}
					range.setStart(anchorNode?.firstChild as Node, this.anchorOffset);
				}
			} else if (anchorType === ELEMENT_NODE_TYPE || anchorType === BREAK_LINE_TYPE) {
				range.setStart(anchorNode as HTMLElement as Node, this.anchorOffset);
			}

			if (focusType === TEXT_NODE_TYPE) {
				let focusNodeText = (focusNode as Node).textContent;
				if (focusNodeText !== null) {
					if (this.focusOffset > focusNodeText.length) {
						this.focusOffset = focusNodeText.length;
					}
					range.setEnd(focusNode?.firstChild as Node, this.focusOffset);
				}
			} else if (focusType === ELEMENT_NODE_TYPE || focusType === BREAK_LINE_TYPE) {
				range.setEnd(focusNode as HTMLElement as Node, this.focusOffset);
			}

			selection.removeAllRanges();
			selection.addRange(range);
		}
	}

	
	/**
	 * Get current selectionState data
	 * @returns insertSelection - selectionState Data
	 */
	get(): insertSelection{
		return({
			anchorOffset: this.anchorOffset,
			focusOffset: this.focusOffset,

			anchorPath: this.anchorPath.get(),
			focusPath: this.focusPath.get(),

			anchorType: this.anchorType,
			focusType: this.focusType,

			isCollapsed: this.isCollapsed,
			isDirty: this.isDirty,

		})
	}

	/**
	 * Inserting given data to selectionState 
	 * @param  {insertSelection} SelectionData - available parameters ofr inserting data
	 * @returns void
	 */
	insertSelectionData(SelectionData: insertSelection): void{

		if(SelectionData.anchorOffset && typeof SelectionData.anchorOffset === 'number') this.anchorOffset = SelectionData.anchorOffset < this.anchorOffset ? 0 : SelectionData.anchorOffset
		if(SelectionData.focusOffset && typeof SelectionData.anchorOffset === 'number') this.focusOffset = SelectionData.focusOffset < this.anchorOffset ? 0 : SelectionData.focusOffset
		
		if(SelectionData.anchorPath && Array.isArray(SelectionData.anchorPath) && !SelectionData.anchorPath.some(isNaN)) this.anchorPath.set(SelectionData.anchorPath)
		if(SelectionData.focusPath && Array.isArray(SelectionData.focusPath) && !SelectionData.focusPath.some(isNaN)) this.focusPath.set(SelectionData.focusPath)

		if(SelectionData.anchorType && (SelectionData.anchorType === 'text' || SelectionData.anchorType === 'element')) this.anchorType = SelectionData.anchorType
		if(SelectionData.focusType && (SelectionData.focusType === 'text' || SelectionData.focusType === 'element')) this.focusType = SelectionData.focusType

		this.isCollapsed = SelectionData.isCollapsed ?? this.isCollapsed;
		this.isDirty = SelectionData.isDirty ?? this.isDirty;
	}
}


export {
	SelectionState,
	NodePath,
	isSelectionBackward,
	getSelection,
	getMutatedSelection
}

export type{
	selectionData,
	insertSelection
}