import {createAiteNode, unmountNode} from '../index';
import type {AiteNode, AiteNodeOptions} from '../index';
import {BlockNode, NodeTypes} from '../BlockNode';
import {isDefined} from '../EditorUtils';

type stringURL = `https://${string}` | `http://prefix${string}`;

class LeafNode extends BlockNode {
	_children: NodeTypes[];
	constructor(parent?: BlockNode) {
		super(undefined, parent, 'link/leaf');
		this._children = [];
	}
}

class LinkNode extends LeafNode {
	__url: stringURL;
	constructor(url: stringURL) {
		super();
		this.__url = url;
	}

	removeNodeByKey(key: number): void {
		let index = this._children.findIndex((node) => node.key === key);
		if (index !== -1) {
			this._children.splice(index, 1);
		}
		if (this._children.length === 0) {
			this.remove();
		}
	}

	splitChild(startFromZero: boolean = true, start: number, end?: number, node?: NodeTypes | Array<NodeTypes>): void {
		let StartSlice = startFromZero === true ? this._children.slice(0, start) : this._children.slice(start);

		let EndSlice = isDefined(end) ? this._children.slice(end) : [];

		if (node === undefined) this._children = [...StartSlice, ...EndSlice];
		else {
			if (Array.isArray(node)) {
				this._children = [...StartSlice, ...node, ...EndSlice];
			} else this._children = [...StartSlice, node, ...EndSlice];
		}
	}

	removeDomNodes(startFromZero: boolean = true, start: number, end?: number): void {
		let slicedNodes: Array<NodeTypes> = [];
		if (end === undefined) {
			if (startFromZero === false) {
				slicedNodes = this._children.slice(0, start);
				this._children = this._children.slice(start);
			} else if (startFromZero === true) {
				slicedNodes = this._children.slice(start);
				this._children = this._children.slice(0, start);
			}
		} else if (end !== undefined) {
			if (startFromZero === false) {
				slicedNodes = [...this._children.slice(0, start), ...this._children.slice(end)];
				this._children = this._children.slice(start, end);
			} else {
				slicedNodes = this._children.slice(start, end);
				this._children = [...this._children.slice(0, start), ...this._children.slice(end)];
			}
		}
		if (slicedNodes.length > 0) {
			slicedNodes.forEach((node: NodeTypes) => {
				unmountNode(node);
			});
		}
		if (this._children.length === 0) {
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
		return this._children[this._children.length - 1];
	}

	getFirstChild() {
		return this._children[0];
	}

	getChildren(): NodeTypes[] {
		return this._children;
	}

	getChildrenByIndex(index: number): NodeTypes {
		return this._children[index];
	}

	getChildrenIndexByKey(key: number): number {
		return this._children.findIndex((node) => node.key === key);
	}

	$getNodeState(options?: AiteNodeOptions): AiteNode {
		let className = 'AITE_link_node';
		let props = {
			href: this.__url,
			className: className,
			'data-aite-node': true,
		};

		let children: Array<AiteNode> = [];
		this._children.forEach((node) => {
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
	} else return new LinkNode('https://');
}

export {LinkNode, createLinkNode, LeafNode};
