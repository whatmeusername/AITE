import {BlockNode} from "../BlockNode";

class LeafNode extends BlockNode {
	constructor() {
		super(undefined, "link/leaf");
	}

	public getContentLength(): number {
		return -1;
	}
}

export {LeafNode};
