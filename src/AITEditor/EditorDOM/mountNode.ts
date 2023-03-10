import {BaseBlockNode} from "../nodes/BlockNode";
import {getEditorState} from "../EditorState";
import {NodeInsertionDeriction} from "./interface";
import {NodeStatus} from "../nodes/interface";
import {BaseNode} from "../nodes";
import {createDOMElement} from "./helpers";

function mountNode(node: BaseNode | BaseBlockNode): void {
	const prevSibling = node.previousSibling();
	const siblingNode = prevSibling ? prevSibling : node.nextSibling();
	const insertDirection: NodeInsertionDeriction = prevSibling ? NodeInsertionDeriction.AFTER : NodeInsertionDeriction.BEFORE;

	if (siblingNode) {
		const siblingDOMElement = getEditorState().EditorDOMState.getNodeFromMap(siblingNode.key);
		if (siblingDOMElement && node.status === NodeStatus.MOUNTED) {
			if (insertDirection === NodeInsertionDeriction.AFTER) {
				siblingDOMElement.parentNode?.insertBefore(createDOMElement(node.createNodeState()), siblingDOMElement.nextSibling);
			} else if (insertDirection === NodeInsertionDeriction.BEFORE) {
				siblingDOMElement.parentNode?.insertBefore(createDOMElement(node.createNodeState()), siblingDOMElement);
			}
		}
	} else {
		const parentNode = node.parent;
		if (parentNode && parentNode.status === NodeStatus.MOUNTED) {
			parentNode.remount();
		}
	}
}

export {mountNode};
