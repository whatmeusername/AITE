import {TextNode, createLinkNode, createTextNode, BaseNode, createBreakLine, HeadNode} from "./nodes/index";

import {createBlockNode, createHorizontalRule} from "./BlockNode";

import {BlockType, BlockNode, getSelectionState, mountNode, NodeInsertionDeriction} from "./index";
import {isBlockNode, isBreakLine, isHorizontalRuleNode, isLeafNode, isTextNode} from "./EditorUtils";
import {ObservableChildren} from "./observers";
import {NodeStatus} from "./nodes/interface";

interface ContentNodeInit {
	BlockNodes?: Array<BlockType>;
}

class ContentNode extends HeadNode {
	blocksLength: () => number;
	children: Array<BlockType>;

	constructor(initData?: ContentNodeInit) {
		super("contentNode");
		this.blocksLength = () => {
			return this.children.length;
		};
		this.children = ObservableChildren(
			this,
			initData?.BlockNodes ?? [
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
			],
		);
	}

	insertNodeBefore<T extends BlockType>(index: number, node: T): T {
		const insertOffset = index > 0 ? index - 1 : index;
		const previousSibling = this.children[index];
		this.insertBlockNodeBetween(node, insertOffset, insertOffset);
		if (previousSibling) node.mount();
		//mountNode(previousSibling, node, NodeInsertionDeriction.BEFORE);
		return node;
	}

	insertNodeAfter<T extends BlockType>(index: number, node: T): T {
		const insertOffset = index + 1;
		const previousSibling = this.children[index];

		this.insertBlockNodeBetween(node, insertOffset, insertOffset);
		if (previousSibling) mountNode(previousSibling, node, NodeInsertionDeriction.BEFORE);
		return node;
	}

	insertNode(node: BlockType, index: number | "last" | "first", direction: NodeInsertionDeriction) {
		if (index < 0) return;

		const blocksLength = this.children.length - 1;
		if ((index === 0 && direction !== "after") || index === "first") {
			this.insertNodeBefore(0, node);
		} else if (index === blocksLength || index === "last") {
			this.insertNodeAfter(blocksLength, node);
		} else {
			const previousSibling = this.children[index];
			index = direction === "after" ? index + 1 : (index as number);
			this.insertBlockNodeBetween(node, index, index);
			if (previousSibling) mountNode(previousSibling, node, direction);
		}
	}

	// TODO: MOVE TO TextNode

	TextNodeSlice(char: TextNode, CharToInsert: string = "", start: number, end?: number): void {
		if (start === -1) {
			char.__content = char.__content + CharToInsert;
		} else if (end !== undefined && end !== -1) {
			char.__content = char.__content.slice(0, start) + CharToInsert + char.__content.slice(end);
		} else if (end === -1) {
			char.__content = char.__content.slice(start) + CharToInsert;
		} else {
			char.__content = char.__content.slice(0, start) + CharToInsert;
		}
	}

	removeNodeByKey(key: number) {
		const index = this.children.findIndex((block) => block.key === key);
		if (index !== -1) this.children.splice(index, 1);
	}

	insertBlockNodeBetween(block: BlockType, start: number, end?: number): void {
		if (end !== undefined) {
			this.children = [...this.children.slice(0, start), block, ...this.children.slice(end ?? start)];
		} else {
			this.children = [...this.children.slice(0, start), block];
		}
	}

	getTextNodeOffset(node: TextNode, offset: number): number {
		const TextContentLength = node.getContentLength();
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

	getBlockNodesBetween(startNode: BlockType, endNode: BlockType, returnAllIfNotFound?: boolean): BlockType[] {
		let startFound = false;
		const nodes: BlockType[] = [];

		const startKey = isLeafNode(startNode) ? (startNode.parent as BlockNode).key : startNode.key;
		const endKey = isLeafNode(endNode) ? (endNode.parent as BlockNode).key : startNode.key;

		for (let i = 0; i < this.children.length; i++) {
			const node = this.children[i];
			const nodeKey = node.key;
			if (nodeKey === startKey) {
				startFound = !startFound;
				continue;
			} else if (nodeKey === endKey) {
				break;
			}
			if (startFound || startKey === -1) nodes.push(node);
		}

		return returnAllIfNotFound && nodes.length === 0 ? this.children : nodes;
	}

	// TODO: MOVE METHOD TO BLOCK NODE AS METHOD
	MergeBlockNode(connectingNode: BlockNode, joinNode: BlockNode): void {
		connectingNode = (isLeafNode(connectingNode) ? connectingNode.parent : connectingNode) as BlockNode;
		joinNode = (isLeafNode(joinNode) ? joinNode.parent : joinNode) as BlockNode;

		if (isBlockNode(connectingNode) && isBlockNode(joinNode)) {
			if (joinNode.isBreakLine) {
				joinNode.remove();
				return;
			} else {
				const applyChilds = joinNode.children;
				connectingNode.children.push(...applyChilds);
				connectingNode.remount();
				joinNode.remove();
			}
		}
	}

	// TODO: MOVE METHOD TO SELECTION AS METHOD
	insertLetter(KeyBoardEvent?: KeyboardEvent) {
		const selectionState = getSelectionState();
		const isSelectionOnSameNode = selectionState.isSameNode;
		let SliceFrom = selectionState.anchorOffset;
		const SliceTo = selectionState.focusOffset;

		const isRemove = KeyBoardEvent === undefined;

		let key = isRemove ? "" : KeyBoardEvent ? KeyBoardEvent.key : "";

		let anchorNode: BaseNode = selectionState.anchorNode as BaseNode;
		let focusNode: BaseNode = selectionState.focusNode as BaseNode;

		let anchorBlock: BlockNode = anchorNode.parent as BlockNode;
		let focusBlock: BlockNode = focusNode.parent as BlockNode;

		if (selectionState.anchorType === "breakline" && isBlockNode(anchorNode)) {
			anchorNode = anchorNode.convertFromBreakLine();
			anchorBlock = anchorNode.parent as BlockNode;
			selectionState.setNodeKey(anchorNode);
		}
		if (selectionState.focusType === "breakline" && !selectionState.isCollapsed && isBlockNode(focusNode)) {
			focusNode = focusNode.convertFromBreakLine();
			focusBlock = focusNode.parent as BlockNode;
			selectionState.setNodeKey(focusNode);
		}

		const {contentNode, blockNode}: {contentNode: ContentNode | undefined; blockNode: BlockNode | undefined} = anchorNode.getContentNode();

		const handleOffsetStart = (): void => {
			if (anchorBlock.isBreakLine) {
				selectionState.moveSelectionToPreviousSibling(anchorBlock);
				anchorBlock.remove();
				return;
			}

			if (!blockNode) return;

			const previousBlock = blockNode?.previousSibling();
			if (!previousBlock) return;

			if (isHorizontalRuleNode(previousBlock) || (isBlockNode(previousBlock) && isBreakLine(previousBlock))) {
				previousBlock.remove();
			} else if (isBlockNode(previousBlock)) {
				if (contentNode) {
					this.MergeBlockNode(previousBlock, blockNode);
				}
			}
		};

		if (selectionState.isCollapsed && isRemove && selectionState.isOffsetOnStart(blockNode)) {
			handleOffsetStart();
		} else if (selectionState.sameBlock && (selectionState.isCollapsed || isSelectionOnSameNode) && isTextNode(anchorNode)) {
			SliceFrom = isRemove && selectionState.isCollapsed ? selectionState.anchorOffset - 1 : selectionState.anchorOffset;

			if (selectionState.isCollapsed) {
				if (key === " " && KeyBoardEvent?.which === 229) {
					key = ".";
					SliceFrom -= 1;
				} else if (!isRemove) selectionState.moveSelectionForward();
				else if (isRemove) selectionState.moveSelectionBackward();
			} else {
				selectionState.toggleCollapse();
				if (!isRemove) selectionState.moveSelectionForward();
			}

			const isOffsetOnStart = selectionState.isOffsetOnStart(blockNode);

			anchorNode.sliceContent(SliceFrom, SliceTo, key);

			if (isBreakLine(anchorBlock)) selectionState.toggleCollapse().setNodeKey(anchorBlock.getFirstChild(true));
			else if (anchorNode.status === NodeStatus.REMOVED && !isOffsetOnStart) {
				selectionState.moveSelectionToPreviousSibling();
			}
		} else if (selectionState.sameBlock && isTextNode(anchorNode) && isTextNode(focusNode)) {
			anchorBlock.getNodesBetween(anchorNode.key, focusNode.key, false).forEach((node) => node.remove());
			anchorNode.sliceContent(SliceFrom, -1, key);
			focusNode.sliceContent(SliceTo);

			if (isBreakLine(anchorBlock)) selectionState.toggleCollapse().setNodeKey(anchorBlock.getFirstChild(true));
			else if (anchorNode.status === NodeStatus.REMOVED && anchorNode.status === NodeStatus.REMOVED) selectionState.moveSelectionToNextSibling();
			else {
				selectionState.toggleCollapse();
				if (!isRemove) selectionState.moveSelectionForward();
			}
		} else if (!selectionState.sameBlock) {
			const blocksBetween = this.getBlockNodesBetween(anchorBlock, focusBlock);

			if (isTextNode(anchorNode)) {
				anchorBlock.getNodesBetween(anchorNode.key).forEach((node) => node.remove());
				anchorNode.sliceContent(SliceFrom, -1, key);
			} else anchorNode.remove();

			if (isTextNode(focusNode)) {
				focusBlock.getNodesBetween(-1, focusNode.key).forEach((node) => node.remove());
				focusNode.sliceContent(SliceTo);
			} else focusNode.remove();

			blocksBetween.forEach((node) => node.remove());

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
	removeLetter(): void {
		this.insertLetter(undefined);
	}

	handleEnterTest(): void {
		const selectionState = getSelectionState();
		const anchorNode = selectionState.anchorNode;
		const focusNode = selectionState.focusNode;
		if (!anchorNode) return;

		if (selectionState.isOffsetOnStart()) {
			const newBreakLine = createBreakLine();
			const {contentNode, index} = anchorNode.getContentNode();
			if (contentNode) {
				contentNode.insertNode(newBreakLine, index, NodeInsertionDeriction.BEFORE);
			}
		}
	}
}

function createContentNode(initData?: ContentNodeInit) {
	return new ContentNode(initData);
}

export {createContentNode, ContentNode};
