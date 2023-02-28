import {BlockNode, NodeTypes} from "../BlockNode";

class LeafNode extends BlockNode {
	children: NodeTypes[];
	constructor(parent?: BlockNode) {
		super(undefined, parent, "link/leaf");
		this.children = [];
	}

	public removeNodeByKey(key: number): void {
		const index = this.children.findIndex((node) => node.key === key);
		if (index !== -1) {
			this.children.splice(index, 1);
		}
		if (this.children.length === 0) {
			this.remove();
		}
	}

	public getContentLength(): number {
		return -1;
	}
}

export {LeafNode};
