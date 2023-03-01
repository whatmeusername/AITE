import {BlockNode, NodeTypes} from "../BlockNode";
import {ObservableChildren} from "../observers";

class LeafNode extends BlockNode {
	children: NodeTypes[];
	constructor(parent?: BlockNode) {
		super(undefined, parent, "link/leaf");
		this.children = ObservableChildren(this, []);
	}

	public getContentLength(): number {
		return -1;
	}
}

export {LeafNode};
