import {getEditorState} from "../../index";
import type {floatType, imageNode} from "./imageNode";
import {IMAGE_NODE_TYPE} from "../../ConstVariables";

export function toggleImageCaption(): void {
	// const activeEditorState = getEditorState().EditorActiveElementState;
	// if (activeEditorState.activeNodeType === IMAGE_NODE_TYPE) {
	// 	const CurrentNode = getBlockNodeWithNode(activeEditorState.pathToActiveNode, undefined)?.node;
	// 	if (CurrentNode && CurrentNode.node.getActualType() === IMAGE_NODE_TYPE) {
	// 		(CurrentNode.node as imageNode).toggleCaptition();
	// 		CurrentNode.node.remount();
	// 	}
	// }
}

export function validateImageURL(imageURL: string): boolean {
	let url;

	try {
		//eslint-disable-next-line
		url = new URL(imageURL);
	} catch (_) {
		return false;
	}

	return imageURL.match(/\.(jpeg|jpg|gif|png)$/) !== null && (imageURL.startsWith("http://") || imageURL.startsWith("https://"));
}
