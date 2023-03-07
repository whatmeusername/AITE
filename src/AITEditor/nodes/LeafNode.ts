import {BlockNode} from "../BlockNode";

abstract class LeafNode extends BlockNode {
	constructor() {
		super(undefined, "link/leaf");
	}

	abstract get length(): number;
}

export {LeafNode};
