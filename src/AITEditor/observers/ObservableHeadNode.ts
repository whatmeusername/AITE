import {BlockNode} from "../BlockNode";
import {ContentNode} from "../ContentNode";
import type {HeadNode} from "../nodes";
import {NodeStatus} from "../nodes/interface";
import {Observe, Observable} from "./Observable/Observable";
import {get} from "./Observable/traps";

function ObservableHeadNode(node: HeadNode | Observable<HeadNode>): Observable<HeadNode> {
	node = Observe(node) as Observable<HeadNode>;
	return node.catch(
		get((target: HeadNode, key: keyof HeadNode) => {
			if (key === "remove") {
				return function () {
					const res = (target as any).remove();
					target.status = NodeStatus.REMOVED;
					((target as any).parent as BlockNode | ContentNode).children?.splice(target.getSelfIndex(), 1);
					return res;
				};
			} else if (key === "mount" || key === "remount") {
				if (target.status === NodeStatus.MOUNTED) {
					return function () {
						return target.remount();
					};
				} else {
					return function () {
						target.status = NodeStatus.MOUNTED;
						return (target as any).mount();
					};
				}
			}
			return target[key];
		}),
	);
}

export {ObservableHeadNode};
