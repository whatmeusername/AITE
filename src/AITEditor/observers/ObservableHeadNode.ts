import type {HeadNode} from "../nodes";
import {NodeStatus} from "../nodes/interface";

function ObservableHeadNode(node: HeadNode): HeadNode {
	return new Proxy(node, {
		get(target: HeadNode, key: keyof HeadNode) {
			if (key === "remove") {
				return function () {
					target.status = NodeStatus.REMOVED;
					return target.remove();
				};
			} else if (key === "mount" || key === "remount") {
				if (target.status === NodeStatus.MOUNTED) {
					return function () {
						return target.remount();
					};
				} else {
					return function () {
						target.status = NodeStatus.MOUNTED;
						return target.mount();
					};
				}
			} else {
				return target[key];
			}
		},
	});
}

export {ObservableHeadNode};
