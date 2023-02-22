import {HeadNode} from '../AITE_nodes';
import {getEditorState} from '../EditorState';
import {AiteHTML, AiteHTMLNode} from './interface';

function unmountNode(node: HeadNode) {
	let currentDOMElement: AiteHTML | undefined = getEditorState().__editorDOMState.getNodeFromMap(node.getNodeKey());
	if (currentDOMElement !== undefined) {
		let parentNode = currentDOMElement.parentNode as AiteHTMLNode;
		if (parentNode.$$isAiteNode || parentNode.dataset.aite_editor_root) {
			getEditorState().__editorDOMState.removeNodeFromMap(node.getNodeKey());
			parentNode.removeChild(currentDOMElement);
		}
	}
}

export {unmountNode};
