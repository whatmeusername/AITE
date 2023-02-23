import {TextNode} from '../AITE_nodes';
import {HTML_TEXT_NODE} from '../ConstVariables';
import {getEditorState} from '../EditorState';
import {AiteHTMLTextNode} from './interface';

function updateTextNodeContent(node: TextNode): TextNode {
	let currentDOMElement: AiteHTMLTextNode | undefined = getEditorState().__editorDOMState.getNodeFromMap(node.key)?.firstChild as AiteHTMLTextNode;
	if (currentDOMElement && currentDOMElement.nodeType === HTML_TEXT_NODE) {
		if (node.__content !== currentDOMElement.textContent) {
			currentDOMElement.textContent = node.__content;
		}
	}
	return node;
}

export {updateTextNodeContent};
