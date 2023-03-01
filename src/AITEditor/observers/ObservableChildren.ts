import type {BlockNode} from "../BlockNode";
import type {ContentNode} from "../ContentNode";
import {mountNode} from "../EditorDOM";

function ObservableChildren<T extends ContentNode | BlockNode, U extends T["children"]>(parent: T, children: U): U {
	const childrenProxyObject = new Proxy(children, {
		get: (target: U, key: string) => {
			if (key === "splice") {
				return function (start: number, deleteCount: number, ...items: U) {
					const removedNodes = (target[key] as (...args: any[]) => U).call(target, start, deleteCount, ...items);
					removedNodes.forEach((node) => {
						if (node?.status === 1) {
							node.remove();
						}
					});
				};
			} else if (key === "push" || key === "unshift") {
				return function (...items: U) {
					items.forEach((node) => {
						node.parent = parent;
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
