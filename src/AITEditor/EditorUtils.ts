import {LINK_NODE_TAGNAME} from './ConstVariables'


export interface selectionData {
	charNode: HTMLElement;
	charIndex: null | number;
	blockNode: HTMLElement | null;
	blockPath: Array<number>;
}


function unpackNode(node: HTMLElement): Array<HTMLElement> {
	return Array.from(node.children) as Array<HTMLElement>;
}

export function getChildrenNodes(blockNode: HTMLElement): Array<HTMLElement> {
	let childrens = unpackNode(blockNode)
	for(let i = 0; i < childrens.length; i++) {
		let node = childrens[i]
		let dataset = node.dataset
		if(dataset.aiteNodePack !== undefined){
			let children = Array.from(node.children) as Array<HTMLElement>
			childrens = [...childrens.slice(0, i), ...children, ...childrens.slice(i + 1)]
		}
	}
	return childrens
}

export function findEditorBlockIndex(node: HTMLElement): {node: HTMLElement, index: number} | undefined {
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

export function findEditorRoot(node: HTMLElement): HTMLElement | undefined {
	while (true) {
		let nodeDataSet = (node.parentNode as HTMLElement)?.dataset;
		if (nodeDataSet.aite_editor_root !== undefined) {
			return node.parentNode as HTMLDivElement;
		} else if (node.tagName === 'BODY') break;
		node = node.parentNode as HTMLElement;
	}
	return undefined;
}

export function findEditorCharIndex(node: HTMLElement): {node: HTMLElement, index: number} | undefined  {
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


export function isTextNode(node: HTMLElement): boolean {
	if(node.parentElement?.dataset.aite_block_node !== undefined){
		return true;
	}
	return false;
}