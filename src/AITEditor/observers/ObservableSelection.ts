import {filterBlock, filterNode} from "../EditorDOM";
import {isBlockNode} from "../EditorUtils";
import {BaseNode} from "../nodes";
import {SelectionState} from "../Selection";
import {Observable, Observe, set} from "./Observable";
import {ObservableChildren} from "./ObservableChildren";

function ObservableSelection<T extends SelectionState>(node: T | Observable<T>): Observable<T> {
	return (Observe(node) as Observable<T>).catch(
		set(function (target: T, key: keyof T, value: any, recevier: any, observable: Observable<T>) {
			if (value instanceof BaseNode) {
				if (key === "anchorNode") {
					target.anchorNode = value;
					target.anchorKey = value.key;
					target.anchorIndex = value.getSelfIndex();
				} else if (key === "focusNode") {
					target.focusNode = value;
					target.focusKey = value.key;
					target.focusIndex = value.getSelfIndex();
				}
			} else target[key] = value;

			return true;
		}),
	);
}

export {ObservableSelection};
