import {HORIZONTAL_RULE_BLOCK_TYPE} from "../ConstVariables";
import {AiteNode, createAiteNode} from "../EditorDOM";
import {BaseBlockNode} from "./BlockNode";

class HorizontalRuleNode extends BaseBlockNode {
	constructor() {
		super(HORIZONTAL_RULE_BLOCK_TYPE, []);
	}

	public createNodeState(): AiteNode {
		const className = "AITE_editor_horizontal-rule";
		const props = {
			class: className,
		};

		return createAiteNode(this, "div", {contenteditable: false}, [createAiteNode(null, "hr", props, [])]);
	}

	public get length(): number {
		return -1;
	}

	public clone(): HorizontalRuleNode {
		return new HorizontalRuleNode();
	}
}

function createHorizontalRule() {
	return new HorizontalRuleNode();
}

export {HorizontalRuleNode, createHorizontalRule};
