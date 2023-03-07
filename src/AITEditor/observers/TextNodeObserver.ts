import {updateTextNodeContent} from "../EditorDOM";
import {TextNode} from "../nodes";
import {Observable, Observe} from "./Observable/Observable";
import {Handle} from "./Observable";

function ObservableTextNode(node: TextNode | Observable<TextNode>): Observable<TextNode> {
	node = Observe(node) as Observable<TextNode>;

	node.catch(
		Handle({
			set(target: TextNode, key: keyof TextNode, value: string) {
				if (key === "content") {
					if (value === "") {
						target.remove();
					} else if (target.content !== value) {
						target.content = value;
						updateTextNodeContent(target);
					}
				} else (target as any)[key] = value;
				return true;
			},
		}),
	);
	return node;
}

export {ObservableTextNode};
