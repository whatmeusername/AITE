import {BlockNode} from "../BlockNode";

class LeafNode extends BlockNode {
	constructor(parent?: BlockNode) {
		super(undefined, parent, "link/leaf");
	}

	public getContentLength(): number {
		return -1;
	}
}

export {LeafNode};
