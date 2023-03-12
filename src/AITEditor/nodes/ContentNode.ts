import {TextNode, createLinkNode, createTextNode, createBreakLine, HeadNode} from "./index";

import {createBlockNode, createHorizontalRule} from "./BlockNode";

import {BlockType, BlockNode, NodeInsertionDeriction, createAiteNode, AiteNode} from "../index";
import {isBlockNode, isLeafNode} from "../EditorUtils";
import {ObservableChildren, ObservableChildrenProperty} from "../observers";
import {NodeStatus} from "./interface";

class ContentNode extends HeadNode {
	children: BlockType[];

	constructor() {
		super("content");

		this.children = ObservableChildren(this, [
			createBlockNode({blockWrapper: "header-two"}).append(createTextNode("Тестовый текст для редактора")),
			createHorizontalRule(),
			createHorizontalRule(),
			createHorizontalRule(),
			createBreakLine(),
			createBlockNode({blockWrapper: "standart"}).append(
				createTextNode(
					"Программи́рование — процесс создания компьютерных программ. По выражению одного из основателей языков программирования Никлауса Вирта «Программы = алгоритмы + структуры данных». Программирование основывается на использовании языков программирования, на которых записываются исходные тексты программ.",
					["ITALIC"],
				),
				createTextNode("some amazing text number 1 ", ["ITALIC", "BOLD"]),
				createTextNode("some amazing text number 2", ["ITALIC", "UNDERLINE", "BOLD"]),
			),
			createBlockNode({blockWrapper: "header-one"}).append(
				createLinkNode("https://yandex.ru").append(
					createTextNode("начало ", ["ITALIC", "UNDERLINE"]),
					createTextNode("середина ", []),
					createTextNode("конец", ["UNDERLINE"]),
				),
				createTextNode("Языки программирования", ["STRIKETHROUGH", "UNDERLINE"]),
				createLinkNode("https://yandex.ru").append(
					createTextNode("начало ", ["ITALIC", "UNDERLINE"]),
					createTextNode("середина ", []),
					createTextNode("конец", ["UNDERLINE"]),
				),
				createTextNode(" текст после ссылки", ["ITALIC", "UNDERLINE"]),
			),
		]);
		return ObservableChildrenProperty(this).value();
	}

	public clone(): ContentNode {
		return new ContentNode();
	}

	get length(): number {
		return this.children.length;
	}

	public append(...nodes: any[]): this {
		this.children.push(...nodes);
		return this;
	}

	public insertNode(node: BlockType, index: number, direction: NodeInsertionDeriction): void {
		if (index < 0) return;

		index = direction === NodeInsertionDeriction.AFTER ? index + 1 : index;
		this.children = [...this.children.slice(0, index), node, ...this.children.slice(index)];
	}

	public removeNodeByKey(key: number) {
		const index = this.children.findIndex((block) => block.key === key);
		if (index !== -1) this.children.splice(index, 1);
	}

	public insertNodeBetween(block: BlockType, start: number, end?: number): void {
		if (end !== undefined) {
			this.children = [...this.children.slice(0, start), block, ...this.children.slice(end ?? start)];
		} else {
			this.children = [...this.children.slice(0, start), block];
		}
	}

	public getTextNodeOffset(node: TextNode, offset: number): number {
		const TextContentLength = node.length;
		if (offset === -1) {
			offset = TextContentLength;
		} else if (offset > TextContentLength) {
			offset = TextContentLength;
		}
		return offset;
	}

	/**
	 * Adding letters to nodes and then updating them
	 * @param  {KeyboardEvent} KeyBoardEvent
	 * @param  {SelectionState} selectionState
	 * @returns void
	 */

	public getBlockNodesBetween(startNode: BlockType, endNode: BlockType, returnAllIfNotFound?: boolean): BlockType[] {
		let startFound = false;
		const nodes: BlockType[] = [];

		const startKey = isLeafNode(startNode) ? (startNode.parent as BlockNode).key : startNode.key;
		const endKey = isLeafNode(endNode) ? (endNode.parent as BlockNode).key : endNode.key;

		if (startKey === endKey) return [];

		for (let i = 0; i < this.children.length; i++) {
			const node = this.children[i];

			if (node.key === startKey) {
				startFound = !startFound;
				continue;
			}
			if (node.key === endKey) {
				break;
			}

			if (startFound || startKey === -1) nodes.push(node);
		}

		return returnAllIfNotFound && nodes.length === 0 ? this.children : nodes;
	}

	// TODO: MOVE METHOD TO BLOCK NODE AS METHOD
	public MergeBlockNode(connectingNode: BlockNode, joinNode: BlockNode): void {
		connectingNode = (isLeafNode(connectingNode) ? connectingNode.parent : connectingNode) as BlockNode;
		joinNode = (isLeafNode(joinNode) ? joinNode.parent : joinNode) as BlockNode;

		if (isBlockNode(connectingNode) && isBlockNode(joinNode)) {
			if (connectingNode.isBreakLine) {
				connectingNode.remove();
			} else if (joinNode.isBreakLine) {
				joinNode.remove();
			} else if (connectingNode.status === NodeStatus.MOUNTED && joinNode.status === NodeStatus.MOUNTED) {
				connectingNode.children.push(...joinNode.children);
				joinNode.remove();
				connectingNode.remount();
			}
		}
	}

	public createNodeState(): AiteNode {
		return createAiteNode(
			null,
			"div",
			{},
			this.children.map((node) => node.createNodeState()),
		);
	}
}

function createContentNode() {
	const node = new ContentNode();
	return node;
}

export {createContentNode, ContentNode};
