import {TextNode, createLinkNode, createTextNode, BaseNode, createBreakLine} from "./nodes/index";

import {createBlockNode, createHorizontalRule} from "./BlockNode";

import {BlockType, NodePath, BlockNode, getSelectionState, mountNode, NodeInsertionDeriction} from "./index";
import {isBlockNode, isBreakLine, isHorizontalRuleNode, isLeafNode, isTextNode} from "./EditorUtils";
import {ObservableChildren} from "./observers";

interface contentNodeConf {
	BlockNodes?: Array<BlockType>;
}

//eslint-disable-next-line

function createContentNode(initData?: contentNodeConf) {
	return new ContentNode(initData);
}

class ContentNode {
	blocksLength: () => number;
	children: Array<BlockType>;

	constructor(initData?: contentNodeConf) {
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
		if (previousSibling) mountNode(previousSibling, node, NodeInsertionDeriction.before);
		return node;
	}

	insertNodeAfter<T extends BlockType>(index: number, node: T): T {
		const insertOffset = index + 1;
		const previousSibling = this.children[index];

		this.insertBlockNodeBetween(node, insertOffset, insertOffset);
		if (previousSibling) mountNode(previousSibling, node, NodeInsertionDeriction.before);
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

	/**
	 * Searching for ContentNode using NodePath in main ContentNode or returning self
	 * @param  {NodePath} NodePath
	 * @returns ContentNode
	 */

	// FULL DEPRECATION HOLDING UNTIL REMOVAL
	getCurrentContentNode(nodePath: NodePath): {ContentNode: ContentNode; NodePath: NodePath} {
		if (nodePath.length() !== 1) {
			let currentContentNode = this.getBlockByPath(nodePath.getContentNode()) as any;
			if (currentContentNode instanceof ContentNode) {
				const currentContentNode = this.getBlockByPath(nodePath.getContentNode()) as any;
				return {ContentNode: currentContentNode, NodePath: nodePath};
			} else if (currentContentNode instanceof BlockNode) {
				nodePath = new NodePath(nodePath.getBlockPath());
				currentContentNode = this.getBlockByPath(nodePath.getContentNode()) as any;
				if (currentContentNode.ContentNode !== undefined) return {ContentNode: currentContentNode.ContentNode, NodePath: nodePath};
				return {ContentNode: currentContentNode, NodePath: nodePath};
			} else if (currentContentNode.ContentNode !== undefined) return {ContentNode: currentContentNode.ContentNode, NodePath: nodePath};
			else {
				while (!(currentContentNode instanceof ContentNode) && currentContentNode) {
					nodePath = new NodePath(nodePath.getContentNode());
					currentContentNode = this.getBlockByPath(nodePath.getContentNode()) as any;
					if (currentContentNode.ContentNode !== undefined) return {ContentNode: currentContentNode.ContentNode, NodePath: nodePath};
				}
				return {ContentNode: currentContentNode.ContentNode, NodePath: nodePath};
			}
		}
		return {ContentNode: this, NodePath: nodePath};
	}
	/**
	 * Searching BlockNode using NodePath
	 * @param  {Array<number>} path
	 */
	getBlockByPath(path: Array<number>) {
		if (path.length === 0) {
			return this;
		} else if (path.length === 1) {
			return this.children[path[0]];
		} else {
			let currentBlock: any = this.children[path[0]];
			for (let i = 1; i < path.length; i++) {
				if (currentBlock instanceof BlockNode || currentBlock?.children !== undefined) {
					currentBlock = currentBlock.children[path[i]];
				} else if (!(currentBlock instanceof BlockNode)) {
					currentBlock = currentBlock.ContentNode !== undefined ? currentBlock.ContentNode.children[path[i]] : currentBlock?.children[path[i]];
				}
			}
			return currentBlock;
		}
	}

	// getBlockByKeyPath(keyPath: Array<string>): ContentNode | BlockType | undefined {
	// 	if (keyPath.length === 0) {
	// 		return this;
	// 	} else if (keyPath.length === 1) {
	// 		return this.children[this.children.findIndex((obj) => obj.key === keyPath[0])];
	// 	} else {
	// 		let index = this.children.findIndex((obj) => obj.key === keyPath[0]);
	// 		let currentNode: any = this.children[index];

	// 		for (let i = 1; i < keyPath.length; i++) {
	// 			if (currentNode instanceof BlockNode) {
	// 				let index = currentNode.children.findIndex((obj) => obj.key === keyPath[i]);
	// 				currentNode = currentNode.children[index];
	// 			} else if (currentNode instanceof ContentNode) {
	// 				let index = currentNode.children.findIndex((obj) => obj.key === keyPath[i]);
	// 				currentNode = currentNode.children[index];
	// 			} else if (currentNode && !(currentNode instanceof BlockNode) && !(currentNode instanceof ContentNode)) {
	// 				if (currentNode.ContentNode) {
	// 					let index = currentNode.ContentNode.children.findIndex((obj: BlockNode) => obj.key === keyPath[i]);
	// 					currentNode = currentNode.ContentNode.children[index];
	// 				} else if (currentNode.getChildren) {
	// 					let index = currentNode.getChildren().findIndex((obj: BlockNode) => obj.key === keyPath[i]);
	// 					currentNode = currentNode.getChildren()[index];
	// 				}
	// 			} else return undefined;
	// 		}
	// 		return currentNode;
	// 	}
	// }

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

	// MergeBlocks(BlockNodes: BlockType[] | NodeTypes[] | ContentNode, joiningBlockDirection: 'up' | 'down', joiningSideDirection: 'backward' | 'forward'): void {
	// 	const selectionState = getSelectionState();
	// 	let AnchorIndex = new NodePath([...selectionState.anchorPath.get()]);
	// 	let lastConnectingNode = undefined;

	// 	let anchorNodeIndex = 0;
	// 	let anchorNodeKey = undefined;

	// 	let newAnchorOffset = selectionState.anchorOffset;
	// 	let connectingBlockLength = 0;

	// 	if (joiningSideDirection === 'backward') {
	// 		let connectingBlock = this.getBlockByPath(selectionState.anchorPath.getBlockPath()) as BlockNode;

	// 		if (isDecoratorNode(connectingBlock)) {
	// 			connectingBlock = this.getBlockByPath(selectionState.anchorPath.getContentNode()) as BlockNode;
	// 			AnchorIndex = new NodePath([...selectionState.anchorPath.getBlockPath()]);
	// 		}

	// 		joiningBlockDirection === 'down' ? AnchorIndex.addOrRemoveToBlock('dec', 1) : AnchorIndex.addOrRemoveToBlock('inc', 1);
	// 		const joiningBlock = this.getBlockByPath(AnchorIndex.getBlockPath()) as BlockNode;

	// 		if (isDecoratorNode(joiningBlock)) {
	// 			connectingBlock = this.getBlockByPath(AnchorIndex.getContentNode()) as BlockNode;
	// 			AnchorIndex = new NodePath(AnchorIndex.getBlockPath());

	// 			joiningBlockDirection === 'down' ? AnchorIndex.addOrRemoveToBlock('inc', 1) : AnchorIndex.addOrRemoveToBlock('dec', 1);
	// 			joiningBlockDirection === 'down' ? AnchorIndex.addOrRemoveToNode('dec', 1) : AnchorIndex.addOrRemoveToNode('inc', 1);
	// 		}

	// 		connectingBlockLength = connectingBlock.getLastChildIndex() + 1;
	// 		lastConnectingNode = connectingBlock.getLastChild();
	// 		const lastConnectingNodeLength = lastConnectingNode.getContentLength();
	// 		const connectingMaxSize = connectingBlock.countToIndex(connectingBlockLength - 1);

	// 		connectingBlock.children = [...connectingBlock.children, ...joiningBlock.children];

	// 		if (BlockNodes instanceof ContentNode) BlockNodes.children.splice(AnchorIndex.getBlockIndex(), 1);
	// 		else BlockNodes.splice(AnchorIndex.getBlockIndex(), 1);

	// 		joiningBlock.remove();
	// 		connectingBlock.remount();

	// 		if (connectingBlock.children.length <= connectingBlockLength) {
	// 			let updatexAnchorNode = connectingBlock.findNodeByOffset(connectingMaxSize);

	// 			anchorNodeIndex = updatexAnchorNode.offsetKey;
	// 			newAnchorOffset = updatexAnchorNode.letterIndex;
	// 			anchorNodeKey = updatexAnchorNode.key;
	// 		} else {
	// 			anchorNodeIndex = connectingBlockLength - 1;
	// 			newAnchorOffset = lastConnectingNodeLength;
	// 			anchorNodeKey = connectingBlock.getChildrenByIndex(anchorNodeIndex).key;
	// 		}
	// 	} else {
	// 		let connectingBlock = this.getBlockByPath(selectionState.anchorPath.getBlockPath()) as BlockNode;
	// 		const isDecoratNode = isDecoratorNode(connectingBlock);

	// 		if (isDecoratNode) {
	// 			anchorNodeKey = connectingBlock.getLastChild().key;
	// 			connectingBlock = this.getBlockByPath(selectionState.anchorPath.getContentNode()) as BlockNode;
	// 			AnchorIndex = new NodePath([...selectionState.anchorPath.getBlockPath()]);
	// 		}

	// 		joiningBlockDirection === 'down' ? AnchorIndex.addOrRemoveToBlock('dec', 1) : AnchorIndex.addOrRemoveToBlock('inc', 1);
	// 		const joiningBlock = this.getBlockByPath(AnchorIndex.getBlockPath()) as BlockNode;

	// 		lastConnectingNode = connectingBlock.getLastChild();
	// 		connectingBlock.children = [...connectingBlock.children, ...joiningBlock.children];

	// 		if (BlockNodes instanceof ContentNode) {
	// 			BlockNodes.removeBlock(AnchorIndex.getBlockIndex());
	// 		} else BlockNodes.splice(AnchorIndex.getBlockIndex(), 1);

	// 		joiningBlock.remove();
	// 		connectingBlock.remount();

	// 		anchorNodeIndex = selectionState.anchorPath.getLastIndex();
	// 		anchorNodeKey = isDecoratNode ? anchorNodeKey : connectingBlock.getChildrenByIndex(anchorNodeIndex).key;

	// 		AnchorIndex.addOrRemoveToBlock('dec', 1);
	// 	}

	// 	selectionState.setAnchorKey(anchorNodeKey);
	// 	selectionState.setFocusKey(anchorNodeKey);

	// 	selectionState.focusPath = joiningSideDirection !== 'backward' ? AnchorIndex : selectionState.anchorPath;
	// 	selectionState.anchorPath = joiningSideDirection !== 'backward' ? AnchorIndex : selectionState.anchorPath;

	// 	selectionState.anchorPath.setLastPathIndex(anchorNodeIndex);
	// 	selectionState.focusPath.setLastPathIndex(anchorNodeIndex);

	// 	selectionState.anchorOffset = newAnchorOffset;
	// 	selectionState.focusOffset = newAnchorOffset;

	// 	selectionState.anchorType = lastConnectingNode.getType();
	// 	selectionState.focusType = lastConnectingNode.getType();

	// 	selectionState.sameBlock = true;
	// 	selectionState.isCollapsed = true;
	// }

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

	MergeBlockNode(connectingNode: BlockNode, joinNode: BlockNode): void {
		connectingNode = (isLeafNode(connectingNode) ? connectingNode.parent : connectingNode) as BlockNode;
		joinNode = (isLeafNode(joinNode) ? joinNode.parent : joinNode) as BlockNode;

		if (isBlockNode(connectingNode) && isBlockNode(joinNode)) {
			if (joinNode.isBreakLine) {
				joinNode.remove();
				return;
			} else {
				const applyChilds = joinNode.children;
				console.log(connectingNode.children);
				connectingNode.children = [...connectingNode.children, ...applyChilds];
				console.log(connectingNode.children);
				connectingNode.remount();
				joinNode.remove();
			}
		}
	}

	insertLetter(KeyBoardEvent?: KeyboardEvent) {
		const selectionState = getSelectionState();
		const isSelectionOnSameNode = selectionState.isNodesSame();
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
			else if (anchorNode.status === 0 && !isOffsetOnStart) {
				selectionState.moveSelectionToPreviousSibling();
			}
		} else if (selectionState.sameBlock && isTextNode(anchorNode) && isTextNode(focusNode)) {
			anchorBlock.getNodesBetween(anchorNode.key, focusNode.key, false).forEach((node) => node.remove());
			anchorNode.sliceContent(SliceFrom, -1, key);
			focusNode.sliceContent(SliceTo);

			if (isBreakLine(anchorBlock)) selectionState.toggleCollapse().setNodeKey(anchorBlock.getFirstChild(true));
			else if (anchorNode.status === 0 && anchorNode.status === 0) selectionState.moveSelectionToNextSibling();
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
				contentNode.insertNode(newBreakLine, index, NodeInsertionDeriction.before);
			}
		}
	}
	/**
	 * Handling enter event, slicing nodes to BlockNodes and then mount them
	 * @param  {SelectionState} selectionState
	 * @returns void
	 */
	// handleEnter(): void {
	// 	let selectionState = getSelectionState();
	// 	let anchorPath = selectionState.anchorPath;
	// 	let ContentNodeData = this.getCurrentContentNode(anchorPath);
	// 	let ContentNode = ContentNodeData.ContentNode;

	// 	if (selectionState.isOffsetOnStart()) {
	// 		let newBlockNode = createBreakLine();
	// 		ContentNode.insertNode(newBlockNode, ContentNodeData.NodePath.getBlockIndex(), NodeInsertionDeriction.before);
	// 		selectionState.toggleCollapse();
	// 	} else if (selectionState.isCollapsed) {
	// 		let CurrentBlock = this.getBlockByPath(anchorPath.getBlockPath());
	// 		let anchorNode = CurrentBlock.getChildrenByIndex(anchorPath.getLastIndex());
	// 		let isDecorator = isDecoratorNode(CurrentBlock);
	// 		let currentContentNode: ContentNode = this.getCurrentContentNode(anchorPath).ContentNode;

	// 		if (isDecorator) {
	// 			let ParentNode = this.getBlockByPath(anchorPath.getContentNode());
	// 			if (
	// 				ParentNode?.getLastChild()?.key === CurrentBlock.key &&
	// 				CurrentBlock.getLastChild()?.key === anchorNode.key &&
	// 				anchorNode?.getContentLength() === selectionState.anchorOffset
	// 			) {
	// 				let newBlockNode = new BlockNode({children: [new BreakLine()]}, this);
	// 				ContentNode.insertNode(newBlockNode, ContentNodeData.NodePath.getBlockIndex(), NodeInsertionDeriction.after);
	// 				selectionState.setNodeKey(newBlockNode.key).offsetToZero().toggleCollapse();
	// 				return;
	// 			}
	// 		} else if (
	// 			isDecorator === false &&
	// 			CurrentBlock.getLastChild()?.key === anchorNode.key &&
	// 			anchorNode?.getContentLength() === selectionState.anchorOffset
	// 		) {
	// 			let newBlockNode = new BlockNode({children: [new BreakLine()]}, this);
	// 			ContentNode.insertNode(newBlockNode, ContentNodeData.NodePath.getBlockIndex(), NodeInsertionDeriction.after);
	// 			selectionState.setNodeKey(newBlockNode.key).offsetToZero().toggleCollapse();
	// 			return;
	// 		}

	// 		let anchorNodeSlice = anchorPath.getLastIndex();
	// 		let SlicedNode: LinkNode | TextNode | undefined = undefined;

	// 		if (selectionState.anchorOffset !== 0) {
	// 			if (anchorNode instanceof TextNode) {
	// 				let SliceContent = anchorNode.getSlicedContent(false, selectionState.anchorOffset);
	// 				this.TextNodeSlice(anchorNode, '', selectionState.anchorOffset);
	// 				anchorNodeSlice += 1;
	// 				if (SliceContent !== '') {
	// 					SlicedNode = anchorNode.createSelfNode({plainText: SliceContent, styles: anchorNode.getNodeStyle()});
	// 				}
	// 			} else {
	// 				anchorNodeSlice += 1;
	// 				SlicedNode = undefined;
	// 			}
	// 		}

	// 		let SliceCharNodes;
	// 		if (isDecorator && CurrentBlock instanceof LinkNode) {
	// 			SliceCharNodes = CurrentBlock.children.slice(anchorNodeSlice);
	// 			CurrentBlock.splitChild(true, anchorNodeSlice);

	// 			if (SlicedNode) SlicedNode = CurrentBlock.createSelfNode().append(SlicedNode, ...SliceCharNodes);
	// 			if (SlicedNode !== undefined) SliceCharNodes = [SlicedNode];

	// 			let ParentNode = this.getBlockByPath(anchorPath.getContentNode());

	// 			let BlockSliceNodes = ParentNode?.children?.slice(anchorPath.getBlockIndex() + 1);
	// 			if (BlockSliceNodes.length > 0) ParentNode.splitChild(true, anchorPath.getBlockIndex() + 1);
	// 			if (BlockSliceNodes) SliceCharNodes = [...SliceCharNodes, ...BlockSliceNodes];

	// 			ParentNode.remount();

	// 			anchorPath = new NodePath(anchorPath.getContentNode());
	// 		} else {
	// 			SliceCharNodes = CurrentBlock.children.slice(anchorNodeSlice);
	// 			if (SliceCharNodes.length > 0) CurrentBlock.splitChild(true, anchorNodeSlice);
	// 			if (SlicedNode !== undefined) SliceCharNodes = [SlicedNode ?? [], ...SliceCharNodes];

	// 			CurrentBlock.remount();
	// 		}

	// 		if (SlicedNode === undefined && SliceCharNodes.length === 0) SliceCharNodes = [new BreakLine()];

	// 		let newBlockNode = new BlockNode(
	// 			{
	// 				children: SliceCharNodes,
	// 				blockWrapper: CurrentBlock.blockWrapper,
	// 			},
	// 			this,
	// 		);

	// 		currentContentNode.insertNode(newBlockNode, anchorPath.getBlockIndex(), NodeInsertionDeriction.after);
	// 		selectionState.setAnchorKey(newBlockNode.key).offsetToZero().toggleCollapse();
	// 	} else {
	// 		if (selectionState.isBlockPathEqual()) {
	// 			let currentContentNode: ContentNode = this.getCurrentContentNode(anchorPath).ContentNode;

	// 			let focusPath = selectionState.focusPath;
	// 			let AnchorBlock = this.getBlockByPath(anchorPath.getBlockPath()) as BlockNode;

	// 			let anchorNodeData = AnchorBlock.getChildrenByIndex(anchorPath.getLastIndex());
	// 			let focusNodeData = AnchorBlock.getChildrenByIndex(focusPath.getLastIndex());

	// 			let anchorNodeSlice = anchorPath.getLastIndex() + 1;
	// 			let focusNodeSlice = focusPath.getLastIndex() + 1;
	// 			let SlicedTextNode: undefined | TextNode = undefined;
	// 			if (anchorNodeSlice !== focusNodeSlice) {
	// 				if (anchorNodeData instanceof TextNode) {
	// 					this.TextNodeSlice(anchorNodeData, '', selectionState.anchorOffset);
	// 				} else focusNodeSlice += 1;

	// 				if (focusNodeData instanceof TextNode) {
	// 					SlicedTextNode = focusNodeData.createSelfNode({
	// 						plainText: focusNodeData.getSlicedContent(false, selectionState.focusOffset),
	// 						styles: focusNodeData.getNodeStyle(),
	// 					});
	// 					this.TextNodeSlice(focusNodeData, '', selectionState.focusOffset, -1);
	// 				} else focusNodeSlice += 1;
	// 			} else {
	// 				if (focusNodeData instanceof TextNode) {
	// 					SlicedTextNode = focusNodeData.createSelfNode({
	// 						plainText: focusNodeData.getSlicedContent(false, selectionState.focusOffset),
	// 						styles: focusNodeData.getNodeStyle(),
	// 					});
	// 					this.TextNodeSlice(focusNodeData, '', selectionState.anchorOffset);
	// 				} else focusNodeSlice += 1;
	// 			}

	// 			let SliceCharNodes = AnchorBlock.children.slice(focusNodeSlice);
	// 			if (SlicedTextNode !== undefined && SlicedTextNode.getContentLength() > 0) {
	// 				SliceCharNodes = [SlicedTextNode, ...SliceCharNodes];
	// 			}

	// 			if (SliceCharNodes.length > 0) {
	// 				AnchorBlock.splitChild(true, anchorNodeSlice);
	// 				AnchorBlock.remount();
	// 			} else if (anchorNodeData instanceof TextNode) {
	// 				anchorNodeData.update(() => {
	// 					this.TextNodeSlice(anchorNodeData as TextNode, '', selectionState.anchorOffset);
	// 				});
	// 				SliceCharNodes = [new BreakLine()];
	// 			}

	// 			let newBlockNode = new BlockNode(
	// 				{
	// 					children: SliceCharNodes,
	// 					blockType: AnchorBlock.blockType,
	// 				},
	// 				this,
	// 			);

	// 			currentContentNode.insertNode(newBlockNode, anchorPath.getBlockIndex(), NodeInsertionDeriction.before);
	// 			selectionState.setAnchorKey(newBlockNode.key).offsetToZero().toggleCollapse();
	// 		} else if (selectionState.isBlockPathEqual() === false) {
	// 			this.removeLetterFromBlock();
	// 		}
	// 	}
	// }
}

export {createContentNode, ContentNode};
