
import{
	KeyboardEventCommand
} from './editorCommandsTypes'

import {getEditorState, BlockNode, NodeTypes, BlockType, NodePath, AiteHTMLNode} from './index'


import defaultInlineStyles from './defaultStyles/defaultInlineStyles';


function unpackNode(node: HTMLElement): Array<HTMLElement> {
	return Array.from(node.children) as Array<HTMLElement>;
}

function getChildrenNodes(blockNode: HTMLElement): Array<HTMLElement> {
	let childrens = unpackNode(blockNode)
	for(let i = 0; i < childrens.length; i++) {
		let node = childrens[i]
		let dataset = node.dataset
		if(dataset.aiteNodeLeaf !== undefined){
			let children = Array.from(node.children) as Array<HTMLElement>
			childrens = [...childrens.slice(0, i), ...children, ...childrens.slice(i + 1)]
		}
	}
	return childrens
}

function isNodesPathEqual(P1: NodePath | Array<number>, P2: NodePath | Array<number>): boolean {
	if(P1 instanceof NodePath){
		P1 = P1.get()
	}
	if(P2 instanceof NodePath){
		P2 = P2.get()
	}

	if(P1.length !== P2.length){
		return false
	}
	else{
		for (let i = 0; i < P1.length; i++) {
			if (P1[i] !== P2[i]) return false;
		}
	}
	return true
}

function getBlockNodeWithNode(
	forcedPath: NodePath | undefined, 
	from: 'anchor' | 'focus' | undefined
	): {
		block: {node: BlockType, path: Array<number>},
		node: {node: NodeTypes, path: Array<number>} | undefined
		} | undefined{
	let editorState = getEditorState()
	let ContentNode = editorState.contentNode
	let nodePath = forcedPath ??  editorState.selectionState[`${from ?? 'anchor'}Path`]

	if(nodePath instanceof NodePath){
		let blockNode: BlockType = ContentNode.getBlockByPath(nodePath.getBlockPath())
		let Node
		if(blockNode instanceof BlockNode){
			Node = blockNode.getNodeByIndex(nodePath.getLastIndex())
		}
		return {block: {
				node: blockNode,
				path: nodePath.getBlockPath()
			}, 
			node: Node === undefined ? undefined : {
				node: Node,
				path: nodePath.get(),
			}
			}
	}
	return undefined
	
}

function findEditorBlockIndex(node: HTMLElement): {node: HTMLElement, index: number} | undefined {
	while (true) {
		let nodeDataSet = (node.parentNode as HTMLElement)?.dataset;
		if (nodeDataSet.aite_editor_root !== undefined) {
			return {
				node: node,
				index: Array.from(node.parentNode!.children).indexOf(node),
			};
		} else if (node.tagName === 'BODY') break;
		node = node.parentNode as HTMLElement;
	}
	return undefined;
}

function findEditorRoot(node: HTMLElement): HTMLElement | undefined {
	while (true) {
		let nodeDataSet = (node.parentNode as HTMLElement)?.dataset;
		if (nodeDataSet.aite_editor_root !== undefined) {
			return node.parentNode as HTMLDivElement;
		} else if (node.tagName === 'BODY') break;
		node = node.parentNode as HTMLElement;
	}
	return undefined;
}

function keyCodeValidator(event: KeyboardEvent | React.KeyboardEvent): boolean {
	const SYMBOLS = [
		'Comma',
		'Period',
		'Minus',
		'Equal',
		'IntlBackslash',
		'Slash',
		'Quote',
		'Semicolon',
		'Backslash',
		'BracketRight',
		'BracketLeft',
		'Backquote',
	];

	if (event.code.startsWith('Key') || event.code === 'Space' || event.code.startsWith('Digit') || SYMBOLS.includes(event.code)) return true;
	return false;
}

function findEditorCharIndex(node: HTMLElement): {node: HTMLElement, index: number} | undefined  {
	while (true) {
		let nodeDataSet = (node.parentNode as HTMLElement)?.dataset;
		if (nodeDataSet.aite_block_node !== undefined) {
			return {
				node: node,
				index: Array.from(node.parentNode!.children).indexOf(node),
			};
		} else if (node.tagName === 'BODY') break;
		node = node.parentNode as HTMLElement;
	}
	return undefined;
}


function isTextNode(node: HTMLElement): boolean {
	if(node.parentElement?.dataset.aite_block_node !== undefined){
		return true;
	}
	return false;
}

function isArrow(event: KeyboardEventCommand): boolean{
	return(
		event.code === 'ArrowLeft'  ||
		event.code === 'ArrowRight' ||
		event.code === 'ArrowUp' ||
		event.code === 'ArrowDown'
	)
}

function isArrowLeft(event: KeyboardEventCommand): boolean{
	return event.code === 'ArrowLeft'
}

function isArrowRight(event: KeyboardEventCommand): boolean{
	return event.code === 'ArrowRight'
}

function isArrowUp(event: KeyboardEventCommand): boolean{
	return event.code === 'ArrowUp'
}

function isArrowDown(event: KeyboardEventCommand): boolean{
	return event.code === 'ArrowDown'
}


function editorWarning(shoudThrow: boolean, message: string): void{
	if(shoudThrow) {
		console.warn(
		`AITE internal warning: ${message}`
	)
}
}

// eslint-disable-next-line 
function editorError(shoudThrow: boolean, message: string): void{
	if(shoudThrow) throw new Error(
		`AITE internal error: ${message}`
	)
}


function isDefined(obj: any): boolean{
	return (obj !== undefined && obj !== null)
}

// eslint-disable-next-line 
function isSafari(): boolean{
	let userAgent = navigator.userAgent
	return (/safari/i.test(userAgent) && !/chromium|edg|ucbrowser|chrome|crios|opr|opera|fxios|firefox/i.test(userAgent))
}
function isApple(): boolean{
	return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
}

function isMeta(event: KeyboardEventCommand): boolean{
	if(isApple()){
		return event.metaKey
	}
	return false
}

function isAlt(event: KeyboardEventCommand): boolean{
	return event.altKey
}

function isCtrl(event: KeyboardEventCommand): boolean{
	return event.ctrlKey
}

function isForwardBackspace(event: KeyboardEventCommand): boolean{
	return (event.code === 'Delete' || event.code === 'Backspace') && event.which === 46
}

function isBackwardRemoveLine(event: KeyboardEventCommand): boolean{
	if(isApple()){
		return (event.code === 'Delete' || event.code === 'Backspace') && isMeta(event)
	}
	else return false
}

function isForwardRemoveLine(event: KeyboardEventCommand): boolean{
	if(isApple()){
		return (event.code === 'Delete' || event.code === 'Backspace') && event.which === 46 && isMeta(event)
	}
	else return false
}

function isBackwardRemoveWord(event: KeyboardEventCommand | React.KeyboardEvent): boolean{
	if(isApple()){
		return event.code === 'Backspace' && isAlt(event)
	}
	else return event.code === 'Backspace' && isCtrl(event)
}

function isForwardRemoveWord(event: KeyboardEventCommand): boolean{
	if(isApple()){
		return (event.code === 'Delete' || event.code === 'Backspace') && isAlt(event) && event.which === 46
	}
	else return (event.code === 'Delete' || event.code === 'Backspace') && isCtrl(event) && event.which === 46
}

// DEPRECATED / REPLACE WITH NEW FUNCTION
function findStyle (StyleKey: string) {
	let style = defaultInlineStyles.find((style) => style.style === StyleKey);
	if (style !== undefined) {
		return style;
	} else throw new Error(`Can't find inline style with name ${StyleKey}, because its not defineded `);
}


function getDecoratorNode(node: AiteHTMLNode): AiteHTMLNode{
	let nodeDataset = node.dataset
	if(!nodeDataset.aite_decorator_node){
		nodeDataset = node.dataset
		while((node.parentNode as AiteHTMLNode)?.dataset?.aite_editor_root === undefined){
			node = node.parentNode as AiteHTMLNode;
			if(node.dataset.aite_decorator_node){
				return node
			}
		}
	}
	return node
}


export {
	getChildrenNodes,
	getBlockNodeWithNode,
	getDecoratorNode,

	keyCodeValidator,
	
	editorWarning,

	findEditorBlockIndex,
	findEditorRoot,
	findEditorCharIndex,
	findStyle,

	isApple,

	isBackwardRemoveLine,
	isBackwardRemoveWord,

	isForwardBackspace,
	isForwardRemoveWord,
	isForwardRemoveLine,

	isArrow,
	isArrowLeft,
	isArrowRight,
	isArrowUp, 
	isArrowDown,

	isTextNode,
	isNodesPathEqual,
	isDefined
	
}