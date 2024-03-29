import {HeadNode} from "../nodes";
import {AiteHTMLNode} from "./interface";

function unmountNode(node: HeadNode) {
	if (node.domRef) {
		const parentNode = node.domRef.parentNode as AiteHTMLNode;
		if ((parentNode.$isAiteNode || parentNode.dataset.aite_editor_root) && node.domRef.$editor) {
			node.domRef.$editor.EditorDOMState.removeNodeFromMap(node.key);
			parentNode.removeChild(node.domRef);
		}
	}
}

export {unmountNode};
