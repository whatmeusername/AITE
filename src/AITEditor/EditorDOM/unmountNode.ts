import {HeadNode} from "../nodes";
import {getEditorState} from "../EditorState";
import {AiteHTML, AiteHTMLNode} from "./interface";

function unmountNode(node: HeadNode) {
	const currentDOMElement: AiteHTML | undefined = getEditorState().__editorDOMState.getNodeFromMap(node.key);
	if (currentDOMElement !== undefined) {
		const parentNode = currentDOMElement.parentNode as AiteHTMLNode;
		if (parentNode.$isAiteNode || parentNode.dataset.aite_editor_root) {
			getEditorState().__editorDOMState.removeNodeFromMap(node.key);
			parentNode.removeChild(currentDOMElement);
		}
	}
}

export {unmountNode};
