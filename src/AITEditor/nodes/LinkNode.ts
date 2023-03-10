import {createAiteNode, NodeTypes} from "../index";
import type {AiteNode} from "../index";
import {LeafNode} from "./LeafNode";

type stringURL = `https://${string}` | `http://${string}`;

class LinkNode extends LeafNode {
	__url: stringURL;
	constructor(url: stringURL) {
		super();
		this.__url = url;
	}

	get length(): number {
		return 0;
	}

	public createSelfNode() {
		return new LinkNode(this.__url);
	}

	public getChildren(): NodeTypes[] {
		return this.children;
	}

	public getChildrenByIndex(index: number): NodeTypes {
		return this.children[index];
	}

	public getChildrenIndexByKey(key: number): number {
		return this.children.findIndex((node) => node.key === key);
	}

	public createNodeState(): AiteNode {
		const className = "AITE_link_node";
		const props = {
			href: this.__url,
			className: className,
			"data-aite-node": true,
		};

		const children: Array<AiteNode> = [];
		this.children.forEach((node) => {
			const $node = node.createNodeState();
			if ($node) children.push($node);
		});

		return createAiteNode(this, "a", props, children);
	}
}

function createLinkNode(url: stringURL): LinkNode {
	let res = false;
	try {
		const urlString: URL = new URL(url);
		res = urlString.protocol === "http:" || urlString.protocol === "https:";
	} catch (_) {
		return new LinkNode("http://");
	}

	return res ? new LinkNode(url) : new LinkNode("http://");
}

export {LinkNode, createLinkNode, LeafNode};
