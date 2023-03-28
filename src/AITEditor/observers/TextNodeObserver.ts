import {updateTextNodeContent} from "../EditorDOM";
import {BreakLineNode, createTextNode, TextNode} from "../nodes";
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

function ObservableBreakline(node: BreakLineNode | Observable<BreakLineNode>): Observable<BreakLineNode> {
	return (Observe(node) as Observable<BreakLineNode>).catch(
		set((target: BreakLineNode, key: keyof BreakLineNode, value: string, observable: BreakLineNode) => {
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
