import {BaseNode} from "../nodes";
import {SelectionState} from "../SelectionState";
import {Observable, Observe, set} from "./Observable";

function ObservableSelection<T extends SelectionState>(node: T | Observable<T>): Observable<T> {
	return (Observe(node) as Observable<T>).catch(
		set(function (target: T, key: keyof T, value: any) {
			if (value instanceof BaseNode) {
				if (key === "anchorNode") {
					target.anchorNode = value;
					target.anchorKey = value.key;
					target.anchorType = value.type;
				} else if (key === "focusNode") {
					target.focusNode = value;
					target.focusKey = value.key;
					target.focusType = value.type;
				}
			} else target[key] = value;

			return true;
		}),
	);
}

export {ObservableSelection};
