import {BaseNode} from "./BaseNode";
import {BREAK_LINE_TYPE} from "../ConstVariables";
import {BlockNode, createAiteNode, createBlockNode} from "../index";
import type {AiteNode, AiteNodeOptions} from "../index";

class BreakLine extends BaseNode {
	constructor() {
		super(BREAK_LINE_TYPE);
	}

	public $getNodeState(options?: AiteNodeOptions): AiteNode {
		const className = "AITE_breakline";
		const props = {
			className: className,
			"data-aite-node": true,
		};
		if (options) options.AiteNodeType = "breakline";
		else options = {AiteNodeType: "breakline"};

		return createAiteNode(this, "br", props, null, {...options, isAiteWrapper: false});
	}

	public getContentLength() {
		return 0;
	}

	public createSelfNode() {
		return new BreakLine();
	}
}

function createBreakLine(): BlockNode {
	return createBlockNode().append(new BreakLine());
}

export {BreakLine, createBreakLine};
