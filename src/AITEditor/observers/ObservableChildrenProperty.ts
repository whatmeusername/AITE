import type {BlockNode} from "../BlockNode";
import type {ContentNode} from "../ContentNode";
import {filterNode, filterBlock} from "../EditorDOM";
import {isBlockNode} from "../EditorUtils";
import {Observe, Observable} from "./Observable/Observable";
import {ObservableChildren} from "./ObservableChildren";
import {Handle} from "./Observable";

function ObservableChildrenProperty<T extends BlockNode | ContentNode>(node: T | Observable<T>): Observable<T> {
	node = Observe(node) as Observable<T>;

	return node.catch(
		Handle({
			set(target: T, key: string | symbol | keyof T, value: any) {
				if (key === "children") {
					const nodes = isBlockNode(target) ? filterNode.apply(target, value) : filterBlock.apply(target, value);
					(target as any)[key] = ObservableChildren(target, nodes);
				} else {
					(target as any)[key] = value;
				}
				return true;
			},
		}),
	);
}

export {ObservableChildrenProperty};
