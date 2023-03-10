import type {BlockNode} from "../nodes/BlockNode";
import type {ContentNode} from "../nodes";
import {NodeStatus} from "../nodes/interface";

function ObservableChildren<T extends BlockNode | ContentNode, U extends T["children"]>(parent: T, children: U): U {
	const childrenProxyObject = new Proxy(children, {
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
