import {BaseBlockNode} from "../nodes/BlockNode";
import {NodeInsertionDeriction} from "./interface";
import {NodeStatus} from "../nodes/interface";
import {BaseNode} from "../nodes";
import {createDOMElement, PassContext} from "./helpers";

function mountNode(node: BaseNode | BaseBlockNode): void {
	const prevSibling = node.previousSibling();
	const siblingNode = prevSibling ? prevSibling : node.nextSibling();
	const insertDirection: NodeInsertionDeriction = prevSibling ? NodeInsertionDeriction.AFTER : NodeInsertionDeriction.BEFORE;

	if (siblingNode && siblingNode.domRef?.$editor) {
		if (siblingNode.domRef && node.status === NodeStatus.MOUNTED) {
			const nodeState = PassContext({editor: siblingNode.domRef.$editor}, node.createNodeState());
			if (insertDirection === NodeInsertionDeriction.AFTER) {
				siblingNode.domRef.parentNode?.insertBefore(createDOMElement(nodeState), siblingNode.domRef.nextSibling);
			} else if (insertDirection === NodeInsertionDeriction.BEFORE) {
				siblingNode.domRef.parentNode?.insertBefore(createDOMElement(nodeState), siblingNode.domRef);
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
