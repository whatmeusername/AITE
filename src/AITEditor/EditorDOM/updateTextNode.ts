import {TextNode} from "../nodes";
import {HTML_TEXT_NODE} from "../ConstVariables";
import {getEditorState} from "../EditorState";
import {AiteHTMLTextNode} from "./interface";

function updateTextNodeContent(node: TextNode): TextNode {
	const currentDOMElement: AiteHTMLTextNode | undefined = getEditorState().EditorDOMState.getNodeFromMap(node.key)?.firstChild as AiteHTMLTextNode;
	if (currentDOMElement && currentDOMElement.nodeType === HTML_TEXT_NODE) {
		if (node.content !== currentDOMElement.textContent) {
			currentDOMElement.textContent = node.content;
		}
	}
	return node;
}

export {updateTextNodeContent};
