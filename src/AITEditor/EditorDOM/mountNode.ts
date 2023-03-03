import {BaseBlockNode, BlockType, NodeTypes} from "../BlockNode";
import {getEditorState} from "../EditorState";
import {NodeInsertionDeriction} from "./interface";
import {createDOMElement} from "./EditorDom";
import {NodeStatus} from "../nodes/interface";
import {BaseNode, HeadNode} from "../nodes";

// DEPRECATED
function mountNode(
	siblingNode: NodeTypes | BlockType,
	node: NodeTypes | BlockType,
	insertDirection: NodeInsertionDeriction = NodeInsertionDeriction.BEFORE,
): void {
	const currentDOMElement = getEditorState().EditorDOMState.getNodeFromMap(siblingNode.key);
	if (currentDOMElement && node.status === NodeStatus.MOUNTED) {
		if (insertDirection === NodeInsertionDeriction.AFTER) {
			currentDOMElement.parentNode?.insertBefore(createDOMElement(node.$getNodeState()), currentDOMElement.nextSibling);
		} else if (insertDirection === NodeInsertionDeriction.BEFORE) {
			currentDOMElement.parentNode?.insertBefore(createDOMElement(node.$getNodeState()), currentDOMElement);
		}
	}
}

function internalMountNode(node: BaseNode | BaseBlockNode): void {
	const prevSibling = node.previousSibling();
	const siblingNode = prevSibling ? prevSibling : node.nextSibling();
	const insertDirection: NodeInsertionDeriction = prevSibling ? NodeInsertionDeriction.BEFORE : NodeInsertionDeriction.AFTER;
	if (siblingNode) {
		const siblingDOMElement = getEditorState().EditorDOMState.getNodeFromMap(siblingNode.key);
		if (siblingDOMElement && node.status === NodeStatus.MOUNTED) {
			if (insertDirection === NodeInsertionDeriction.AFTER) {
				siblingDOMElement.parentNode?.insertBefore(createDOMElement(node.$getNodeState()), siblingDOMElement.nextSibling);
			} else if (insertDirection === NodeInsertionDeriction.BEFORE) {
				siblingDOMElement.parentNode?.insertBefore(createDOMElement(node.$getNodeState()), siblingDOMElement);
			}
		}
	} else {
		const parentNode = node.parent;
		if (parentNode && parentNode.status === NodeStatus.MOUNTED) {
			parentNode.remount();
		}
	}
}

export {mountNode, internalMountNode};
