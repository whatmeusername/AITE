import {TextNode, createLinkNode, createTextNode, BaseNode, createBreakLine, HeadNode} from "../nodes/index";

import {createBlockNode, createHorizontalRule} from "./BlockNode";

import {BlockType, BlockNode, getSelectionState, NodeInsertionDeriction, createAiteNode, AiteNode} from "../index";
import {isBlockNode, isBreakLine, isHorizontalRuleNode, isLeafNode, isTextNode} from "../EditorUtils";
import {ObservableChildren, ObservableChildrenProperty} from "../observers";
import {NodeStatus} from "../nodes/interface";

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

	// TODO: MOVE METHOD TO SELECTION AS METHOD
	public insertLetter(KeyBoardEvent?: KeyboardEvent) {
		const selectionState = getSelectionState();
		const isSelectionOnSameNode = selectionState.isSameNode;
		let SliceFrom = selectionState.anchorOffset;
		const SliceTo = selectionState.focusOffset;

		const isRemove = KeyBoardEvent === undefined;

		let key = isRemove ? "" : KeyBoardEvent ? KeyBoardEvent.key : "";

		const anchorNode: BaseNode = selectionState.anchorNode as BaseNode;
		const focusNode: BaseNode = selectionState.focusNode as BaseNode;

		const anchorBlock: BlockNode = anchorNode.parent as BlockNode;
		const focusBlock: BlockNode = focusNode.parent as BlockNode;

		const {contentNode, blockNode}: {contentNode: ContentNode | undefined; blockNode: BlockNode | undefined} = anchorNode.getContentNode();

		const handleOffsetStart = (): void => {
			if (!blockNode) return;
			else if (anchorBlock.isBreakLine) {
				selectionState.moveSelectionToPreviousSibling(anchorBlock);
				anchorBlock.remove();
				return;
			}

			const previousBlock = blockNode?.previousSibling();
			if (!previousBlock) return;

			if (isHorizontalRuleNode(previousBlock) || isBreakLine(previousBlock)) {
				previousBlock.remove();
			} else if (isBlockNode(previousBlock)) {
				if (contentNode) {
					this.MergeBlockNode(previousBlock, blockNode);
				}
			}
		};

		if (selectionState.isCollapsed && isRemove && selectionState.isOffsetOnStart(blockNode)) handleOffsetStart();
		else if (selectionState.sameBlock && (selectionState.isCollapsed || isSelectionOnSameNode) && isTextNode(selectionState.anchorNode)) {
			SliceFrom = isRemove && selectionState.isCollapsed ? selectionState.anchorOffset - 1 : selectionState.anchorOffset;

			if (selectionState.isCollapsed) {
				if (KeyBoardEvent?.which === 229 && key === " ") {
					key = ".";
					SliceFrom -= 1;
				} else if (!isRemove) selectionState.moveSelectionForward();
				else if (isRemove) selectionState.moveSelectionBackward();
			} else {
				selectionState.toggleCollapse();
				if (!isRemove) selectionState.moveSelectionForward();
			}
			selectionState.anchorNode.sliceContent(SliceFrom, SliceTo, key);

			//TODO INSERT BREAKLINE WHEN BLOCK IS EMPTY

			if (selectionState.anchorNode?.status === NodeStatus.REMOVED && !selectionState.isOffsetOnStart(blockNode)) {
				selectionState.moveSelectionToPreviousSibling();
			}
		} else if (selectionState.sameBlock && isTextNode(anchorNode) && isTextNode(focusNode)) {
			anchorBlock.getNodesBetween(anchorNode.key, focusNode.key).original.forEach((node) => node.remove());
			anchorNode.sliceContent(SliceFrom, -1, key);
			focusNode.sliceContent(SliceTo);

			if (isBreakLine(anchorBlock)) selectionState.toggleCollapse().setNodeKey(anchorBlock.getFirstChild(true));
			else if (anchorNode.status === NodeStatus.REMOVED && anchorNode.status === NodeStatus.REMOVED) selectionState.moveSelectionToNextSibling();
			else {
				selectionState.toggleCollapse();
				if (!isRemove) selectionState.moveSelectionForward();
			}
		} else if (!selectionState.sameBlock) {
			this.getBlockNodesBetween(anchorBlock, focusBlock).forEach((node) => node.remove());

			anchorBlock.getNodesBetween(anchorNode.key).original.forEach((node) => node.remove());
			if (isTextNode(anchorNode)) {
				anchorNode.sliceContent(SliceFrom, -1, key);
			} else anchorNode.remove();

			focusBlock.getNodesBetween(-1, focusNode.key).original.forEach((node) => node.remove());
			if (isTextNode(focusNode)) {
				focusNode.sliceContent(SliceTo);
			} else focusNode.remove();

			this.MergeBlockNode(anchorBlock, focusBlock);
			selectionState.toggleCollapse(!anchorNode.status ? true : false);

			if (!anchorNode.status && focusNode.status) selectionState.offsetToZero();
			else if (!focusNode.status && !anchorNode.status) selectionState.moveSelectionToPreviousSibling();
			else if (!isRemove) selectionState.moveSelectionForward();
		}
	}

	/**
	 * Removing letters from nodes and updates them
	 * @param  {SelectionState} selectionState
	 * @returns void
	 */
	// TODO: MOVE METHOD TO SELECTION AS METHOD
	public removeLetter(): void {
		this.insertLetter();
	}

	public handleEnterTest(): void {
		const selectionState = getSelectionState();
		const anchorNode = selectionState.anchorNode as TextNode;
		const focusNode = selectionState.focusNode as TextNode;
		if (!anchorNode) return;

		const onStart = selectionState.isOffsetOnStart();
		const onEnd = selectionState.isOffsetOnEnd();

		if (onStart || onEnd) {
			const newBreakLine = createBreakLine();
			const {contentNode, index} = anchorNode.getContentNode();
			if (contentNode) {
				contentNode.insertNode(newBreakLine, index, onStart ? NodeInsertionDeriction.BEFORE : NodeInsertionDeriction.AFTER);
				if (!onStart) {
					selectionState.setNode(newBreakLine.children[0]).offsetToZero();
				}
			}
		} else if (selectionState.isCollapsed) {
			const anchorParent = anchorNode.parent as BlockNode;
			const focusParent = focusNode.parent as BlockNode;
			const {contentNode, index, blockNode} = anchorNode.getContentNode();
			if (blockNode) {
				const nodesAfterPointer = anchorParent.getNodesBetween(anchorNode.key, -1, false, false, undefined, true);
				nodesAfterPointer.original.forEach((node) => node.remove());
				const newBlockNode = blockNode.clone();

				if (isTextNode(anchorNode as any)) {
					const textNodePart = anchorNode.sliceToTextNode(selectionState.anchorOffset, -1);
					//TODO: MOVE TO GETNODESBETWEEN
					newBlockNode.append(textNodePart);
				} else anchorNode.remove();

				newBlockNode.append(...nodesAfterPointer.modified);
				contentNode?.insertNode(newBlockNode, index, NodeInsertionDeriction.AFTER);
				selectionState.moveSelectionToNextSibling();
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
