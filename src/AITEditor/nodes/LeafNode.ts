import {BlockNode, NodeTypes} from "../BlockNode";

class LeafNode extends BlockNode {
	children: NodeTypes[];
	constructor(parent?: BlockNode) {
		super(undefined, parent, "link/leaf");
		this.children = [];
	}

	public getContentLength(): number {
		return -1;
	}
}

export {LeafNode};
