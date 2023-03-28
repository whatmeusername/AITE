import {BlockNode, createBlockNode} from "./BlockNode";
import {BREAK_LINE_TYPE} from "../ConstVariables";
import {AiteNode, createAiteNode} from "../EditorDOM";
import {ObservableBreakline} from "../observers/TextNodeObserver";
import {TextNode} from "./TextNode";

class BreakLineNode extends TextNode {
	constructor() {
		super({type: BREAK_LINE_TYPE});

		return ObservableBreakline(this).value();
	}

	public createNodeState(): AiteNode {
		const props = {
			className: "AITE_breakline",
		};

		return createAiteNode(this, "br", props, null);
	}

	get length(): number {
		return 0;
	}

	public clone(): BreakLineNode {
		return new BreakLineNode();
	}
}

function createBreakLine(): BlockNode {
	return createBlockNode().append(new BreakLineNode());
}

function createBreakLineNode(): BreakLineNode {
	return new BreakLineNode();
}

export {BreakLineNode, createBreakLine, createBreakLineNode};
