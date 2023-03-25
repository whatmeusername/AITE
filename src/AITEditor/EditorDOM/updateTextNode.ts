import {TextNode} from "../nodes";
import {HTML_TEXT_NODE} from "../ConstVariables";
import {NodeStatus} from "../nodes/interface";

function updateTextNodeContent(node: TextNode): TextNode {
	if (node.status === NodeStatus.MOUNTED && node.domRef && node.domRef?.firstChild?.nodeType === HTML_TEXT_NODE && node.content !== node.domRef.textContent) {
		node.domRef.firstChild.textContent = node.content;
	}
	return node;
}

export {updateTextNodeContent};
