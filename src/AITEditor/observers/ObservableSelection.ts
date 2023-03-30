import {BREAK_LINE_TYPE} from "../ConstVariables";
import {BaseNode} from "../nodes";
import {SelectionState} from "../SelectionState";
import {Observable, Observe, set} from "./Observable";

function ObservableSelection<T extends SelectionState>(node: T | Observable<T>): Observable<T> {
	return (Observe(node) as Observable<T>).catch(
		set(function (target: T, key: keyof T, value: any) {
			if (value instanceof BaseNode) {
				if (key === "anchorNode") {
					target.previousSibling = target.moveSelectionToPreviousSibling({
						preventUpdate: true,
						NodeBlockLevel: value.type !== BREAK_LINE_TYPE,
					});

					target.anchorNode = value;
					target.anchorKey = value.key;
					target.anchorType = value.type;
				} else if (key === "focusNode") {
					target.nextSibling = target.moveSelectionToNextSibling({
						preventUpdate: true,
						startFromFocusNode: true,
						NodeBlockLevel: value.type !== BREAK_LINE_TYPE,
					});

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
