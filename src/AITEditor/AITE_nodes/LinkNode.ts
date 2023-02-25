import {createAiteNode, unmountNode} from '../index';
import type {AiteNode, AiteNodeOptions} from '../index';
import {BlockNode, NodeTypes} from '../BlockNode';
import {isDefined} from '../EditorUtils';

type stringURL = `https://${string}` | `http://${string}`;

class LeafNode extends BlockNode {
	children: NodeTypes[];
	constructor(parent?: BlockNode) {
		super(undefined, parent, 'link/leaf');
		this.children = [];
	}
}

class LinkNode extends LeafNode {
	__url: stringURL;
	constructor(url: stringURL) {
		super();
		this.__url = url;
	}

	removeNodeByKey(key: number): void {
		let index = this.children.findIndex((node) => node.key === key);
		if (index !== -1) {
			this.children.splice(index, 1);
		}
		if (this.children.length === 0) {
			this.remove();
		}
	}

	splitChild(startFromZero: boolean = true, start: number, end?: number, node?: NodeTypes | Array<NodeTypes>): void {
		let StartSlice = startFromZero === true ? this.children.slice(0, start) : this.children.slice(start);

		let EndSlice = isDefined(end) ? this.children.slice(end) : [];

		if (node === undefined) this.children = [...StartSlice, ...EndSlice];
		else {
			if (Array.isArray(node)) {
				this.children = [...StartSlice, ...node, ...EndSlice];
			} else this.children = [...StartSlice, node, ...EndSlice];
		}
	}

	removeDomNodes(startFromZero: boolean = true, start: number, end?: number): void {
		let slicedNodes: Array<NodeTypes> = [];
		if (end === undefined) {
			if (startFromZero === false) {
				slicedNodes = this.children.slice(0, start);
				this.children = this.children.slice(start);
			} else if (startFromZero === true) {
				slicedNodes = this.children.slice(start);
				this.children = this.children.slice(0, start);
			}
		} else if (end !== undefined) {
			if (startFromZero === false) {
				slicedNodes = [...this.children.slice(0, start), ...this.children.slice(end)];
				this.children = this.children.slice(start, end);
			} else {
				slicedNodes = this.children.slice(start, end);
				this.children = [...this.children.slice(0, start), ...this.children.slice(end)];
			}
		}
		if (slicedNodes.length > 0) {
			slicedNodes.forEach((node: NodeTypes) => {
				unmountNode(node);
			});
		}
		if (this.children.length === 0) {
			this.remove();
		}
	}

	getContentLength(): number {
		return -1;
	}

	createSelfNode() {
		return new LinkNode(this.__url);
	}

	getLastChild() {
		return this.children[this.children.length - 1];
	}

	getChildren(): NodeTypes[] {
		return this.children;
	}

	getChildrenByIndex(index: number): NodeTypes {
		return this.children[index];
	}

	getChildrenIndexByKey(key: number): number {
		return this.children.findIndex((node) => node.key === key);
	}

	$getNodeState(options?: AiteNodeOptions): AiteNode {
		let className = 'AITE_link_node';
		let props = {
			href: this.__url,
			className: className,
			'data-aite-node': true,
		};

		let children: Array<AiteNode> = [];
		this.children.forEach((node) => {
			let $node = node.$getNodeState({...options});
			if ($node) children.push($node);
		});

		return createAiteNode(this, 'a', props, children, {...options, isAiteWrapper: false});
	}
}

function URLvalidator(url: stringURL): boolean {
	let urlString: URL | string = url;

	try {
		urlString = new URL(url);
	} catch (_) {
		return false;
	}

	return urlString.protocol === 'http:' || urlString.protocol === 'https:';
}

function createLinkNode(url: stringURL): LinkNode {
	if (URLvalidator(url)) {
		return new LinkNode(url);
	} else return new LinkNode('http://');
}

export {LinkNode, createLinkNode, LeafNode};
