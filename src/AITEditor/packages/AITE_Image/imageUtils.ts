import type {EditorState} from '../../index';
import type {floatType, imageNode} from './imageNode';

export function setImageFloatDirection(EditorState: EditorState, direction: floatType): void {
	// let activeNodes = EditorState.EditorActiveElementState?.getActiveNodes();
	// let EditorActiveState = EditorState.EditorActiveElementState;
	// if (EditorActiveState === undefined) return;
	// let charIndex = EditorActiveState?.nodeNode;

	// if (activeNodes !== undefined && (charIndex !== undefined || charIndex !== null)) {
	// 	if (activeNodes.char.getActualType() === 'image') {
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

export function toggleImageCaption(EditorState: EditorState): void {
	// let activeNodes = EditorState.EditorActiveElementState?.getActiveNodes();
	// if(activeNodes?.char.getActualType() === 'image'){
	// 	(activeNodes.char as imageNode).toggleCaptition()
	// }
}


export function validateImageURL(imageURL: string): boolean {

	let url

	try {
		//eslint-disable-next-line
		url = new URL(imageURL);
	  } catch (_) {
		return false;  
	  }

	return(
		imageURL.match(/\.(jpeg|jpg|gif|png)$/) !== null &&
		(imageURL.startsWith('http://') || imageURL.startsWith('https://'))
		)

}