import {BREAK_LINE_TYPE} from "../ConstVariables";
import {HeadNode} from "../nodes";
import {NodeStatus} from "../nodes/interface";
import {AiteHTMLNode} from "./interface";

function unmountNode(node: HeadNode) {
	if (node.domRef) {
		const parentNode = node.domRef.parentNode as AiteHTMLNode;
		if ((parentNode.$isAiteNode || parentNode.dataset.aite_editor_root) && node.domRef.$editor) {
			node.domRef.$editor.EditorDOMState.removeNodeFromMap(node.key);
			parentNode.removeChild(node.domRef);
			const selection = node.domRef.$editor.selectionState;

			const isBreakLine = selection.anchorType === BREAK_LINE_TYPE && selection.focusType === BREAK_LINE_TYPE;
			if (selection.anchorKey === node.key || selection.focusKey === node.key || isBreakLine) {
				if (!isBreakLine && selection.anchorNode?.status === NodeStatus.MOUNTED) selection.toggleCollapse();
				else {
					const nextNode = selection.moveSelectionToPreviousSibling({NodeBlockLevel: !isBreakLine});
					if (!nextNode && selection.focusNode?.status === NodeStatus.MOUNTED) selection.toggleCollapse(true).offsetToZero();
					else if (!nextNode) selection.getCaretPosition();
				}
			}
		}
	}
}

export {unmountNode};
