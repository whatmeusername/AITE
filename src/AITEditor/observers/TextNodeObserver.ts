import {updateTextNodeContent} from "../EditorDOM";
import {isBlockNode} from "../EditorUtils";
import {BreakLine, createTextNode, TextNode} from "../nodes";
import {set, Observable, Observe} from "./Observable";

function ObservableTextNode(node: TextNode | Observable<TextNode>): Observable<TextNode> {
	return Observe(node).catch(
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
	return Observe(node).catch(
		set((target: BreakLine, key: keyof BreakLine, value: string) => {
			if (key === "content" && value !== "") {
				if (isBlockNode(target.parent)) {
					target.parent.replace(target, createTextNode(value));
				}
			} else (target as any)[key] = value;
			return true;
		}),
	);
}

export {ObservableTextNode, ObservableBreakline};
