import {HeadNode} from "../nodes";
import {getEditorState} from "../EditorState";
import {AiteHTML, AiteHTMLNode} from "./interface";

function unmountNode(node: HeadNode) {
	const currentDOMElement: AiteHTML | undefined = getEditorState().EditorDOMState.getNodeFromMap(node.key);
	if (currentDOMElement !== undefined) {
		const parentNode = currentDOMElement.parentNode as AiteHTMLNode;
		if (parentNode.$isAiteNode || parentNode.dataset.aite_editor_root) {
			getEditorState().EditorDOMState.removeNodeFromMap(node.key);
			parentNode.removeChild(currentDOMElement);
		}
	}
}

export {unmountNode};
