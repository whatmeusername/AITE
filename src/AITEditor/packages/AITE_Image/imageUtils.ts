import {getEditorState} from '../../index';
import type {floatType, imageNode} from './imageNode';
import {IMAGE_NODE_TYPE} from '../../ConstVariables';
import {getBlockNodeWithNode} from '../../EditorUtils';

export function setImageFloatDirection(direction: floatType): void {
	let EditorState = getEditorState();
	let activeEditorState = EditorState.EditorActiveElementState;

	let CurrentNodeData = getBlockNodeWithNode(activeEditorState.pathToActiveNode, undefined);
	let BlockNode = CurrentNodeData?.block;
	let ImageNode = CurrentNodeData?.node;

	// if (BlockNode?.node !== undefined) {
	// 	if (ImageNode.node.getActualType() === 'image/gif') {
	// 		if ((activeNodes.char as imageNode).imageConf.canFloat === true) {
	// 			(activeNodes.char as imageNode).$setDirection(direction);
	// 			if (direction !== 'none') {
	// 				let nextNode = activeNodes.block.NodeData[charIndex! + 1];
	// 				if (nextNode === undefined || nextNode.getType() !== 'text') {
	// 					let previousNode = activeNodes.block.NodeData[charIndex! - 1];
	// 					if (previousNode !== undefined) {
	// 						if (previousNode.getType() === 'text') {
	// 							activeNodes.block.swapNodePosition(charIndex! - 1, charIndex!);
	// 							EditorActiveState.charNode! -= 1;
	// 							(activeNodes.char as imageNode).$setDirection(undefined, true);
	// 						}
	// 					}
	// 				}
	// 			} else if (
	// 				direction === 'none' &&
	// 				(activeNodes.char as imageNode).imageStyle.float.hasChanged === true
	// 			) {
	// 				let nextNode = activeNodes.block.NodeData[charIndex! + 1];
	// 				if (nextNode !== undefined) {
	// 					if (nextNode.getType() === 'text') {
	// 						activeNodes.block.swapNodePosition(charIndex!, charIndex! + 1);
	// 						//EditorActiveState.node! += 1;
	// 						(activeNodes.char as imageNode).$setDirection(undefined, false);
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// }
}

export function toggleImageCaption(): void {
	let activeEditorState = getEditorState().EditorActiveElementState;
	if (activeEditorState.activeNodeType === IMAGE_NODE_TYPE) {
		let CurrentNode = getBlockNodeWithNode(activeEditorState.pathToActiveNode, undefined)?.node;
		if (CurrentNode && CurrentNode.node.getActualType() === IMAGE_NODE_TYPE) {
			(CurrentNode.node as imageNode).toggleCaptition();
			CurrentNode.node.remount();
		}
	}
}

export function validateImageURL(imageURL: string): boolean {
	let url;

	try {
		//eslint-disable-next-line
		url = new URL(imageURL);
	} catch (_) {
		return false;
	}

	return imageURL.match(/\.(jpeg|jpg|gif|png)$/) !== null && (imageURL.startsWith('http://') || imageURL.startsWith('https://'));
}
