import {LINK_NODE_TAGNAME} from './ConstVariables'
import{
	KeyboardEventCommand
} from './editorCommandsTypes'


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

function isArrow(event: KeyboardEventCommand){
	return(
		event.code === 'ArrowLeft'  ||
		event.code === 'ArrowRight' ||
		event.code === 'ArrowUp' ||
		event.code === 'ArrowDown'
	)
}

function isArrowLeft(event: KeyboardEventCommand){
	return event.code === 'ArrowLeft'
}

function isArrowRight(event: KeyboardEventCommand){
	return event.code === 'ArrowRight'
}

function isArrowUp(event: KeyboardEventCommand){
	return event.code === 'ArrowUp'
}

function isArrowDown(event: KeyboardEventCommand){
	return event.code === 'ArrowDown'
}


function editorError(shoudThrow: boolean, message: string){
	if(shoudThrow) throw new Error(
		`AITE internal error: ${message}`
	)
}


function isDefined(obj: any): boolean{
	return (obj !== undefined && obj !== null)
}


export {
	getChildrenNodes,

	findEditorBlockIndex,
	findEditorRoot,
	findEditorCharIndex,

	isArrow,
	isArrowLeft,
	isArrowRight,
	isArrowUp, 
	isArrowDown,

	isTextNode,
	isDefined
	
}