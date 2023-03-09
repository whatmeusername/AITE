import {BlockNode} from "./BlockNode";

abstract class LeafNode extends BlockNode {
	constructor() {
		super(undefined, "leaf");
	}

	abstract get length(): number;
}

export {LeafNode};
