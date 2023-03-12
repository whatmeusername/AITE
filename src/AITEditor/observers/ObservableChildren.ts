import type {BlockNode} from "../nodes/BlockNode";
import {BaseNode, ContentNode} from "../nodes";
import {NodeStatus} from "../nodes/interface";
import {getSelectionState} from "../EditorState";

function MergeSameNodes<T extends BaseNode[]>(children: T): T {
	if (children.length <= 1) return children;

	const selection = getSelectionState();
	const newChildren: T = [] as unknown as T;
	for (let i = 0; i < children.length; i++) {
		const prevNode = newChildren[newChildren.length - 1];
		const nextNode = children[i];
		if (prevNode && prevNode.constructor === nextNode.constructor && prevNode.tryToMerge) {
			const node = prevNode.tryToMerge(nextNode);
			if (node) {
				const selectionOn = selection.anchorKey === prevNode.key ? prevNode : selection.focusKey === nextNode.key ? nextNode : null;
				const selectionNotOn = selection.anchorKey !== prevNode.key ? prevNode : selection.focusKey !== nextNode.key ? nextNode : null;

				//TODO: SET SELECTION
				// if (selectionOn && selectionNotOn) {
				// 	selection.setNode(node, selectionNotOn);
				// 	selection.anchorOffset += selectionNotOn.length;
				// 	selection.focusOffset += selectionNotOn.length;

				// 	console.log(selection);
				// }

				newChildren.splice(newChildren.length - 1, 1);
				newChildren.push(node);
			} else {
				newChildren.push(nextNode);
			}
		} else {
			newChildren.push(nextNode);
		}
	}

	return newChildren;
}

function ObservableChildren<T extends BlockNode | ContentNode, U extends T["children"]>(parent: T, children: U): U {
	const childrenProxyObject = new Proxy(MergeSameNodes(children), {
		get: (target: U, key: string) => {
			if (key === "push" || key === "unshift") {
				return function (...items: U) {
					items.forEach((node) => {
						node.parent = parent;
						if (node.status === NodeStatus.UNMOUNTED) {
							node.mount();
						}
					});
					(target[key] as (...items: U) => number).apply(target, items);
				};
			}
			return (target as any)[key];
		},
	});

	childrenProxyObject.forEach((node) => {
		node.parent = parent;
	});

	return childrenProxyObject;
}

export {ObservableChildren};
