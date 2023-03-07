import {TextNode, createLinkNode, createTextNode, BaseNode, createBreakLine, HeadNode} from "./nodes/index";

import {createBlockNode, createHorizontalRule} from "./BlockNode";

import {BlockType, BlockNode, getSelectionState, NodeInsertionDeriction} from "./index";
import {isBlockNode, isBreakLine, isHorizontalRuleNode, isLeafNode, isTextNode} from "./EditorUtils";
import {ObservableChildren, ObservableChildrenProperty} from "./observers";
import {NodeStatus} from "./nodes/interface";
import {createImageNode} from "./packages/AITE_Image/imageNode";

interface ContentNodeInit {
	BlockNodes?: Array<BlockType>;
}

class ContentNode extends HeadNode {
	children: Array<BlockType>;

	constructor(initData?: ContentNodeInit) {
		super("contentNode");

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
		return ObservableChildrenProperty(this).value();
	}

	insertNode(node: BlockType, index: number, direction: NodeInsertionDeriction): void {
		if (index < 0) return;

		index = direction === NodeInsertionDeriction.AFTER ? index + 1 : index;
		this.insertBlockNodeBetween(node, index, index);
	}

	// TODO: MOVE TO TextNode

	TextNodeSlice(char: TextNode, CharToInsert: string = "", start: number, end?: number): void {
		if (start === -1) {
			char.content = char.content + CharToInsert;
		} else if (end !== undefined && end !== -1) {
			char.content = char.content.slice(0, start) + CharToInsert + char.content.slice(end);
		} else if (end === -1) {
			char.content = char.content.slice(start) + CharToInsert;
		} else {
			char.content = char.content.slice(0, start) + CharToInsert;
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

	getBlockNodesBetween(startNode: BlockType, endNode: BlockType, returnAllIfNotFound?: boolean): BlockType[] {
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

		if (selectionState.isCollapsed && isRemove && selectionState.isOffsetOnStart(blockNode)) {
			handleOffsetStart();
		} else if (selectionState.sameBlock && (selectionState.isCollapsed || isSelectionOnSameNode) && isTextNode(anchorNode)) {
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
			this.getBlockNodesBetween(anchorBlock, focusBlock).forEach((node) => node.remove());

			anchorBlock.getNodesBetween(anchorNode.key).forEach((node) => node.remove());
			if (isTextNode(anchorNode)) {
				anchorNode.sliceContent(SliceFrom, -1, key);
			} else anchorNode.remove();

			focusBlock.getNodesBetween(-1, focusNode.key).forEach((node) => node.remove());
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
	removeLetter(): void {
		this.insertLetter();
	}

	handleEnterTest(): void {
		const selectionState = getSelectionState();
		const anchorNode = selectionState.anchorNode;
		const focusNode = selectionState.focusNode;
		if (!anchorNode) return;

		const onStart = selectionState.isOffsetOnStart();
		const onEnd = selectionState.isOffsetOnEnd();

		if (onStart || onEnd) {
			const newBreakLine = createBreakLine();
			const {contentNode, index} = anchorNode.getContentNode();
			if (contentNode) {
				contentNode.insertNode(newBreakLine, index, onStart ? NodeInsertionDeriction.BEFORE : NodeInsertionDeriction.AFTER);
			}
		}
	}
}

function createContentNode(initData?: ContentNodeInit) {
	const node = new ContentNode(initData);
	return node;
}

export {createContentNode, ContentNode};
