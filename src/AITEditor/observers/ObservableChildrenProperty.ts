import type {BlockNode} from "../BlockNode";
import type {ContentNode} from "../ContentNode";
import {filterNode, filterBlock} from "../EditorDOM";
import {isBlockNode} from "../EditorUtils";
import {Observe, Observable} from "./Observable/Observable";
import {ObservableChildren} from "./ObservableChildren";
import {set} from "./Observable";
import {NodeStatus} from "../nodes/interface";

function ObservableChildrenProperty<T extends BlockNode | ContentNode>(node: T | Observable<T>): Observable<T> {
	node = Observe(node) as Observable<T>;

	return node.catch(
		set(function (target: T, key: keyof T, value: any, recevier: any, observable: Observable<T>) {
			if (key === "children") {
				const nodes = isBlockNode(observable.instance) ? filterNode.apply(observable.instance, value) : filterBlock.apply(observable.instance, value);
				target.children = ObservableChildren(observable.instance, nodes);
				target.children.forEach((node) => {
					if (node.status === NodeStatus.UNMOUNTED) {
						node.mount();
					}
				});
			} else {
				target[key] = value;
			}
			return true;
		}),
	);
}

export {ObservableChildrenProperty};
