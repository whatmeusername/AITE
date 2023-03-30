import {ContentNode, createBreakLine, LeafNode, BlockNode, createBreakLineNode} from "../nodes";
import {NodeStatus} from "../nodes/interface";
import {MergeSameNodes} from "../EditorUtils";

function ObservableChildren<T extends BlockNode | ContentNode, U extends T["children"]>(parent: T, children: U): U {
	const childrenProxyObject = new Proxy(MergeSameNodes(children), {
		get: (target: U, key: string) => {
			if (key === "push" || key === "unshift") {
				return function (...items: U) {
					items.forEach((node) => {
						node.parent = parent;
						if (parent.status === NodeStatus.MOUNTED && node.status === NodeStatus.UNMOUNTED) {
							node.mount();
						}
					});
					(target[key] as (...items: U) => number).apply(target, items);
				};
			}
			return (target as any)[key];
		},
		set(target: U, key: string, value: any): boolean {
			if (key === "length" && value === 0 && parent.status === NodeStatus.MOUNTED) {
				if (parent instanceof LeafNode) {
					parent.remove();
				}
			}
			(target as any)[key] = value;
			return true;
		},
	});

	childrenProxyObject.forEach((node) => {
		node.parent = parent;
	});

	return childrenProxyObject;
}

export {ObservableChildren};
