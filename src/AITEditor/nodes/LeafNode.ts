import {BlockNode} from "./BlockNode";

abstract class LeafNode extends BlockNode {
	constructor() {
		super(undefined, "leaf");
	}
}

export {LeafNode};
