import {updateTextNodeContent} from "../EditorDOM";
import {BreakLine, createTextNode, TextNode} from "../nodes";
import {isBlockNode} from "../typeguards";
import {set, Observable, Observe} from "./Observable";

function ObservableTextNode(node: TextNode | Observable<TextNode>): Observable<TextNode> {
	return (Observe(node) as Observable<TextNode>).catch(
		set((target: TextNode, key: keyof TextNode, value: string) => {
			if (key === "content") {
				if (value === "") {
					target.remove();
				} else if (target.content !== value) {
					target.content = value;
					updateTextNodeContent(target);
				}
			} else (target as any)[key] = value;
			return true;
		}),
	);
}

function ObservableBreakline(node: BreakLine | Observable<BreakLine>): Observable<BreakLine> {
	return (Observe(node) as Observable<BreakLine>).catch(
		set((target: BreakLine, key: keyof BreakLine, value: string, observable: BreakLine) => {
			if (key === "content" && value !== "" && isBlockNode(target.parent)) {
				const selectionState = target.domRef?.$editor?.selectionState;
				const nextNode = createTextNode(value);
				if (selectionState && selectionState.anchorKey === target.key) {
					selectionState.setNode(nextNode);
				}
				target.parent.replace(observable, nextNode);
			} else (target as any)[key] = value;
			return true;
		}),
	);
}

export {ObservableTextNode, ObservableBreakline};
