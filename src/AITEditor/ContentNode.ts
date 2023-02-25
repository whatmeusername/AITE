import {BREAK_LINE_TYPE, TEXT_NODE_TYPE} from './ConstVariables';
import {TextNode, createLinkNode, createTextNode, BaseNode, createBreakLine} from './AITE_nodes/index';

import {createBlockNode, createHorizontalRule} from './BlockNode';

import {unmountNode, BlockType, SelectionState, NodePath, BlockNode, HorizontalRuleNode, getSelectionState, mountNode, NodeInsertionDeriction} from './index';
import {isLeafNode} from './EditorUtils';

interface contentNodeConf {
	BlockNodes?: Array<BlockType>;
}

//eslint-disable-next-line

function createContentNode(initData?: contentNodeConf) {
	return new ContentNode(initData);
}

function isTextNode(node: any): node is TextNode {
	return node instanceof TextNode;
}

function isHorizontalRuleNode(node: any): node is HorizontalRuleNode {
	return node instanceof HorizontalRuleNode;
}

function isBlockNode(node: any): node is BlockNode {
	return node instanceof BlockNode;
}

function isContentNode(node: any): node is ContentNode {
	return node instanceof ContentNode;
}

function isBreakLine(node: any): node is BlockNode {
	if (isLeafNode(node)) return false;
	return (
		node.children.length <= 1 &&
		(node.children[0].getType() === BREAK_LINE_TYPE || (node.children[0].getType() === TEXT_NODE_TYPE && node.children[0].getContentLength() === 0))
	);
}

class ContentNode {
	blocksLength: () => number;
	children: Array<BlockType>;

	constructor(initData?: contentNodeConf) {
		this.blocksLength = () => {
			return this.children.length;
		};
		this.children = initData?.BlockNodes ?? [
			createBlockNode({blockWrapper: 'header-two'}).append(createTextNode('Тестовый текст для редактора')),
			createHorizontalRule(),
			createHorizontalRule(),
			createHorizontalRule(),
			createBreakLine(),
			createBlockNode({blockWrapper: 'standart'}).append(
				createTextNode(
					'Программи́рование — процесс создания компьютерных программ. По выражению одного из основателей языков программирования Никлауса Вирта «Программы = алгоритмы + структуры данных». Программирование основывается на использовании языков программирования, на которых записываются исходные тексты программ.',
					['ITALIC'],
				),
				createTextNode('some amazing text number 1 ', ['ITALIC', 'BOLD']),
				createTextNode('some amazing text number 2', ['ITALIC', 'UNDERLINE', 'BOLD']),
			),
			createBlockNode({blockWrapper: 'header-one'}).append(
				createLinkNode('https://yandex.ru').append(
					createTextNode(`начало `, ['ITALIC', 'UNDERLINE']),
					createTextNode(`середина `, []),
					createTextNode(`конец`, ['UNDERLINE']),
				),
				createTextNode(`Языки программирования`, ['STRIKETHROUGH', 'UNDERLINE']),
				createLinkNode('https://yandex.ru').append(
					createTextNode(`начало `, ['ITALIC', 'UNDERLINE']),
					createTextNode(`середина `, []),
					createTextNode(`конец`, ['UNDERLINE']),
				),
				createTextNode(` текст после ссылки`, ['ITALIC', 'UNDERLINE']),
			),
		];

		this.children.forEach((node) => {
			node.parent = this;
		});
	}

	removeDomNodes(startFromZero: boolean = true, start: number, end?: number): void {
		let slicedNodes: Array<BlockType> = [];
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
			slicedNodes.forEach((node: BlockType) => {
				unmountNode(node);
			});
		}
	}

	insertNodeBefore<T extends BlockType>(index: number, node: T): T {
		let insertOffset = index > 0 ? index - 1 : index;
		let previousSibling = this.children[index];
		this.insertBlockNodeBetween(node, insertOffset, insertOffset);
		if (previousSibling) mountNode(previousSibling, node, NodeInsertionDeriction.before);
		return node;
	}

	insertNodeAfter<T extends BlockType>(index: number, node: T): T {
		let insertOffset = index + 1;
		let previousSibling = this.children[index];

		this.insertBlockNodeBetween(node, insertOffset, insertOffset);
		if (previousSibling) mountNode(previousSibling, node, NodeInsertionDeriction.before);
		return node;
	}

	insertNode(node: BlockType, index: number | 'last' | 'first', direction: NodeInsertionDeriction) {
		if (index < 0) return;

		node.parent = this;
		let blocksLength = this.children.length - 1;
		if ((index === 0 && direction !== 'after') || index === 'first') {
			this.insertNodeBefore(0, node);
		} else if (index === blocksLength || index === 'last') {
			this.insertNodeAfter(blocksLength, node);
		} else {
			let previousSibling = this.children[index];
			index = direction === 'after' ? index + 1 : (index as number);
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
				let currentContentNode = this.getBlockByPath(nodePath.getContentNode()) as any;
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

	TextNodeSlice(char: TextNode, CharToInsert: string = '', start: number, end?: number): void {
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
		let index = this.children.findIndex((block) => block.key === key);
		if (index !== -1) this.children.splice(index, 1);
	}

	removeBlock(blockIndex: number): void {
		this.children.splice(blockIndex, 1);
	}

	sliceBlockFromContent(start: number, end?: number): void {
		this.children = [...this.children.slice(0, start), ...this.children.slice(end ?? start)];
	}

	insertBlockNodeBetween(block: BlockType, start: number, end?: number): void {
		if (end !== undefined) {
			this.children = [...this.children.slice(0, start), block, ...this.children.slice(end ?? start)];
		} else {
			this.children = [...this.children.slice(0, start), block];
		}
	}

	getTextNodeOffset(node: TextNode, offset: number): number {
		let TextContentLength = node.getContentLength();
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
		let nodes: BlockType[] = [];

		let startKey = isLeafNode(startNode) ? (startNode.parent as BlockNode).key : startNode.key;
		let endKey = isLeafNode(endNode) ? (endNode.parent as BlockNode).key : startNode.key;

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

	MergeBlockNode(connectingNode: BlockNode, joinNode: BlockNode, selectionState: SelectionState): void {
		connectingNode = (isLeafNode(connectingNode) ? connectingNode.parent : connectingNode) as BlockNode;
		joinNode = (isLeafNode(joinNode) ? joinNode.parent : joinNode) as BlockNode;

		if (isBlockNode(connectingNode) && isBlockNode(joinNode)) {
			const applyChilds = joinNode.children;
			connectingNode.children = [...connectingNode.children, ...applyChilds];
			connectingNode.remount();
			joinNode.remove();
		}
	}

	insertLetter(KeyBoardEvent?: KeyboardEvent) {
		const selectionState = getSelectionState();
		const isSelectionOnSameNode = selectionState.isNodesSame();
		let SliceFrom = selectionState.anchorOffset;
		let SliceTo = selectionState.focusOffset;

		const isRemove = KeyBoardEvent === undefined;
		let key = isRemove ? '' : KeyBoardEvent ? KeyBoardEvent.key : '';

		let anchorNode: BaseNode = selectionState.anchorNode as BaseNode;
		let focusNode: BaseNode = selectionState.focusNode as BaseNode;

		let anchorBlock: BlockNode = anchorNode.parent as BlockNode;
		let focusBlock: BlockNode = focusNode.parent as BlockNode;

		if (selectionState.anchorType === 'breakline' && isBlockNode(anchorNode)) {
			anchorNode = anchorNode.convertFromBreakLine();
			anchorBlock = anchorNode.parent as BlockNode;
			selectionState.setNodeKey(anchorNode);
		}
		if (selectionState.focusType === 'breakline' && !selectionState.isCollapsed && isBlockNode(focusNode)) {
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

			const previousBlock = anchorBlock.previousSibling();
			if (!previousBlock) return;

			if (isHorizontalRuleNode(previousBlock) || (isBlockNode(previousBlock) && isBreakLine(previousBlock))) {
				previousBlock.remove();
			} else if (isBlockNode(previousBlock)) {
				if (contentNode) {
					this.MergeBlockNode(previousBlock, anchorBlock, selectionState);
				}
			}
		};

		if (selectionState.isCollapsed && isRemove && selectionState.isOffsetOnStart()) {
			handleOffsetStart();
		} else if (selectionState.sameBlock && (selectionState.isCollapsed || isSelectionOnSameNode) && isTextNode(anchorNode)) {
			SliceFrom = isRemove && selectionState.isCollapsed ? selectionState.anchorOffset - 1 : selectionState.anchorOffset;

			if (selectionState.isCollapsed) {
				if (key === ' ' && KeyBoardEvent?.which === 229) {
					key = '.';
					SliceFrom -= 1;
				} else if (!isRemove) selectionState.moveSelectionForward();
				else if (isRemove) selectionState.moveSelectionBackward();
			} else {
				selectionState.toggleCollapse();
				if (!isRemove) selectionState.moveSelectionForward();
			}

			anchorNode.sliceContent(SliceFrom, SliceTo, key);

			if (isBreakLine(anchorBlock)) selectionState.toggleCollapse().setNodeKey(anchorBlock.getFirstChild(true));
			else if (anchorNode.status === 0) selectionState.moveSelectionToPreviousSibling();
		} else if (selectionState.sameBlock && isTextNode(anchorNode) && isTextNode(focusNode)) {
			anchorBlock.getNodesBetween(anchorNode.key, focusNode.key).forEach((node) => node.remove());

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

			this.MergeBlockNode(anchorBlock, focusBlock, selectionState);
			selectionState.toggleCollapse(!anchorNode.status ? true : false);
			if (!anchorNode.status && focusNode.status) selectionState.offsetToZero();
			else if (!focusNode.status && !anchorNode.status) selectionState.moveSelectionToPreviousSibling();
			else if (!isRemove) selectionState.moveSelectionForward();
		}
	}

	// insertLetterIntoTextNode(KeyBoardEvent?: KeyboardEvent): void {
	// 	const remove = KeyBoardEvent === undefined;
	// 	let Key = remove ? '' : KeyBoardEvent ? KeyBoardEvent.key : '';

	// 	const selectionState = getSelectionState();
	// 	const anchorPath = selectionState.anchorPath;
	// 	const focusPath = selectionState.focusPath;

	// 	let anchorBlockNode = this.getBlockByPath(anchorPath.getBlockPath()) as BlockNode;
	// 	let focusBlockNode;

	// 	let anchorNodeData = anchorBlockNode.getChildrenByIndex ? anchorBlockNode.getChildrenByIndex(anchorPath.getLastIndex()) : undefined;
	// 	let focusNodeData: NodeTypes | undefined;

	// 	const handleOffsetStart = () => {
	// 		if (selectionState.isOffsetOnStart()) {
	// 			let isDecoratorAnchor = isDecoratorNode(anchorBlockNode);
	// 			if (focusPath.getBlockIndex() !== 0 || (isDecoratorAnchor && focusPath.getContentNodeIndex() !== 0)) {
	// 				if (isDecoratorAnchor) {
	// 					anchorPath.set(selectionState.anchorPath.getBlockPath());
	// 					anchorBlockNode = this.getBlockByPath(anchorPath.getBlockPath());
	// 				}

	// 				let previousBlockPath = new NodePath([...selectionState.anchorPath.get()]);
	// 				previousBlockPath.addOrRemoveToBlock('dec', 1);

	// 				let previousBlock = this.getBlockByPath(previousBlockPath.getBlockPath());

	// 				if (!(previousBlock instanceof BlockNode)) {
	// 					previousBlock.remove();
	// 					selectionState.anchorPath.addOrRemoveToBlock('dec', 1);
	// 					selectionState.setAnchorKey(anchorBlockNode.getFirstChild().key).offsetToZero();
	// 				} else if (
	// 					(anchorBlockNode.isBreakLine() && previousBlock.isBreakLine()) ||
	// 					(anchorBlockNode.isBreakLine() === false && previousBlock.isBreakLine())
	// 				) {
	// 					previousBlock.remove();
	// 					selectionState.anchorPath.addOrRemoveToBlock('dec', 1);
	// 					selectionState.setAnchorKey(anchorBlockNode.getFirstChild().key).toggleCollapse();
	// 				} else if (anchorBlockNode.isBreakLine() && previousBlock.isBreakLine() === false) {
	// 					selectionState.moveSelectionToPreviousBlock(this);
	// 					anchorBlockNode.remove();
	// 				} else {
	// 					let currentContentNode: ContentNode | undefined = undefined;
	// 					if (selectionState.anchorPath.length() === 1) currentContentNode = this;
	// 					else currentContentNode = this.getBlockByPath(anchorPath.getContentNode());

	// 					currentContentNode = (currentContentNode as any).ContentNode ?? currentContentNode;

	// 					if (currentContentNode) {
	// 						selectionState.anchorPath.addOrRemoveToBlock('dec', 1);
	// 						this.MergeBlocks(currentContentNode.BlockNodes, 'up', 'backward');
	// 					}
	// 				}
	// 			}
	// 		}
	// 	};

	// 	// DOING SOME WORK TO OPTIMIZE FUNCTION AND REPLACING BREAK LINES IF SELECTED
	// 	if (anchorNodeData?.getType() === BREAK_LINE_TYPE && !remove) {
	// 		anchorNodeData = createTextNode();
	// 		anchorBlockNode.replaceNode(0, anchorNodeData);
	// 		selectionState.setAnchorKey(anchorBlockNode.getFirstChild().key);
	// 		anchorBlockNode.remount();
	// 	}
	// 	if (selectionState.isCollapsed === false) {
	// 		if (selectionState.isNodesPathEqual() === false) {
	// 			focusBlockNode = this.getBlockByPath(focusPath.getBlockPath()) as BlockNode;
	// 			focusNodeData = focusBlockNode.getChildrenByIndex ? focusBlockNode.getChildrenByIndex(focusPath.getLastIndex()) : undefined;
	// 		} else {
	// 			focusBlockNode = anchorBlockNode;
	// 			focusNodeData = anchorBlockNode.getChildrenByIndex(focusPath.getLastIndex());
	// 		}
	// 		if (focusNodeData && focusNodeData.getType() === BREAK_LINE_TYPE && !remove) {
	// 			focusNodeData = createTextNode();
	// 			selectionState.focusKey = focusNodeData.key;
	// 			focusBlockNode.replaceNode(anchorPath.getLastIndex(), focusNodeData);
	// 		}
	// 	} else {
	// 		focusBlockNode = anchorBlockNode;
	// 		focusNodeData = anchorNodeData;
	// 	}
	// 	if (anchorNodeData === undefined) return;

	// 	if (selectionState.isCollapsed) {
	// 		if (anchorNodeData instanceof TextNode) {
	// 			let SliceFrom = remove ? selectionState.anchorOffset - 1 : selectionState.anchorOffset;
	// 			let SliceTo = selectionState.focusOffset;

	// 			if (Key === ' ' && KeyBoardEvent?.which === 229) {
	// 				Key = '.';
	// 				SliceFrom -= 1;
	// 			} else if (!remove) selectionState.moveSelectionForward();

	// 			anchorNodeData.update((textNode) => {
	// 				textNode.sliceText(SliceFrom, SliceTo, Key);
	// 			});

	// 			if (remove) {
	// 				if (selectionState.isOffsetOnStart()) {
	// 					handleOffsetStart();
	// 				} else {
	// 					if (anchorBlockNode?.isBreakLine && anchorBlockNode?.isBreakLine()) {
	// 						selectionState.offsetToZero().toggleCollapse().setNodeKey(anchorBlockNode.getFirstChild()?.key);
	// 					} else if (anchorNodeData.getContent() === '') {
	// 						selectionState.moveSelectionToPreviousSibling(this);
	// 					} else selectionState.moveSelectionBackward();
	// 				}
	// 			}
	// 		} else if (selectionState.isOffsetOnStart() && remove) {
	// 			handleOffsetStart();
	// 		}
	// 	} else if (selectionState.sameBlock) {
	// 		if (selectionState.isNodesSame() === false) {
	// 			let NodeSplitStart = anchorPath.getLastIndex() + 1;
	// 			let NodeSplitEnd = focusPath.getLastIndex();

	// 			if (anchorNodeData instanceof TextNode) {
	// 				anchorNodeData.update(() => {
	// 					this.TextNodeSlice(anchorNodeData as TextNode, Key, selectionState.anchorOffset);
	// 				});
	// 				if (anchorNodeData.$getNodeStatus() === 0) NodeSplitStart += 1;
	// 			} else {
	// 				let previousSibling = anchorBlockNode.previousNodeSibling(anchorPath.getLastIndex());
	// 				if (previousSibling !== undefined && previousSibling instanceof TextNode) {
	// 					previousSibling.update(() => {
	// 						this.TextNodeSlice(previousSibling as TextNode, Key, -1);
	// 					});
	// 					if (previousSibling.$getNodeStatus() === 0) NodeSplitStart += 1;
	// 				} else NodeSplitStart -= 1;
	// 			}

	// 			if (focusNodeData instanceof TextNode) {
	// 				focusNodeData.update(() => {
	// 					this.TextNodeSlice(focusNodeData as TextNode, '', selectionState.focusOffset, -1);
	// 				});
	// 			} else NodeSplitEnd += 1;

	// 			const anchorIsDecorator = isDecoratorNode(anchorBlockNode);
	// 			if (NodeSplitEnd - NodeSplitStart > 0 && anchorPath.length() === focusPath.length()) {
	// 				anchorBlockNode.removeDomNodes(true, NodeSplitStart, NodeSplitEnd);
	// 			} else if (NodeSplitEnd - NodeSplitStart > 0) {
	// 				if (NodeSplitStart > 0) {
	// 					if (anchorIsDecorator === false) {
	// 						NodeSplitStart += isDecoratorNode(focusBlockNode) ? 1 : 0;
	// 						anchorBlockNode.removeDomNodes(true, NodeSplitStart, NodeSplitStart);
	// 					} else anchorBlockNode.removeDomNodes(true, NodeSplitStart);
	// 				}
	// 				if (NodeSplitEnd > 0) focusBlockNode.removeDomNodes(anchorIsDecorator ? true : false, NodeSplitEnd + 1);
	// 			}

	// 			if (anchorBlockNode instanceof BlockNode && anchorBlockNode.isBreakLine()) {
	// 				selectionState.setAnchorKey(anchorBlockNode.getFirstChild().key).toggleCollapse();
	// 			} else selectionState.moveSelectionForward().toggleCollapse();
	// 		} else {
	// 			if (anchorNodeData instanceof TextNode) {
	// 				anchorNodeData.update(() => {
	// 					this.TextNodeSlice(anchorNodeData as TextNode, Key, selectionState.anchorOffset, selectionState.focusOffset);
	// 				});
	// 				if (remove) {
	// 					if (anchorBlockNode instanceof BlockNode && anchorBlockNode.isBreakLine()) {
	// 						selectionState.offsetToZero().setNodeKey(anchorBlockNode?.getFirstChild()?.key);
	// 					} else selectionState.toggleCollapse();
	// 				} else selectionState.toggleCollapse().moveSelectionForward();
	// 			} else anchorNodeData.remove();
	// 		}
	// 	} else if (selectionState.sameBlock === false) {
	// 		let NodeSplitStart = anchorPath.getLastIndex() + 1;
	// 		let NodeSplitEnd = focusPath.getLastIndex();

	// 		if (isDefined(anchorNodeData)) {
	// 			if (anchorNodeData instanceof TextNode) {
	// 				this.TextNodeSlice(anchorNodeData, Key, selectionState.anchorOffset);
	// 			} else {
	// 				let previousSibling = anchorBlockNode.previousNodeSibling(anchorPath.getBlockIndex());
	// 				if (previousSibling instanceof TextNode) {
	// 					this.TextNodeSlice(previousSibling, Key, -1);
	// 				} else anchorBlockNode.splitChild(false, NodeSplitStart, NodeSplitStart + 1, createTextNode());
	// 				NodeSplitStart -= 1;
	// 			}

	// 			if (NodeSplitStart > 0 && !isDecoratorNode(anchorBlockNode)) {
	// 				anchorBlockNode.splitChild(true, NodeSplitStart);
	// 			} else {
	// 				if (isDecoratorNode(anchorBlockNode)) {
	// 					if (NodeSplitStart > 0) anchorBlockNode.splitChild(true, NodeSplitStart);
	// 					if (anchorPath.getBlockIndex() > 0) {
	// 						this.getBlockByPath(anchorPath.getContentNode()).splitChild(true, anchorPath.getBlockIndex());
	// 					}
	// 				}
	// 			}
	// 		}

	// 		if (isDefined(focusNodeData)) {
	// 			if (focusNodeData instanceof TextNode) {
	// 				this.TextNodeSlice(focusNodeData, anchorNodeData === undefined ? Key : '', selectionState.focusOffset, -1);
	// 			} else NodeSplitEnd += 1;

	// 			if (NodeSplitEnd > 0 && !isDecoratorNode(focusBlockNode)) {
	// 				focusBlockNode.splitChild(false, NodeSplitEnd);
	// 			} else {
	// 				if (isDecoratorNode(focusBlockNode)) {
	// 					if (NodeSplitEnd > 0) focusBlockNode.splitChild(false, NodeSplitEnd);
	// 					if (focusPath.getBlockIndex() > 0 && NodeSplitEnd <= focusPath.getBlockIndex()) {
	// 						this.getBlockByPath(focusPath.getContentNode()).splitChild(false, focusPath.getBlockIndex());
	// 					}
	// 				}
	// 			}
	// 		}
	// 		if (isDefined(anchorNodeData) && isDefined(focusNodeData)) {
	// 			let ParentNode;
	// 			let anchorBlockSlice;
	// 			let focusBlockSlice = isDecoratorNode(focusBlockNode) ? focusPath.getContentNodeIndex() : focusPath.getBlockIndex();

	// 			if (isDecoratorNode(anchorBlockNode)) {
	// 				ParentNode = this;
	// 				anchorBlockSlice = anchorPath.getContentNodeIndex() + 1;
	// 			} else {
	// 				ParentNode = this.getBlockByPath(anchorPath.getContentNode());
	// 				anchorBlockSlice = anchorPath.getBlockIndex() + 1;
	// 			}

	// 			let ParentContentNode: ContentNode = ParentNode.ContentNode ? ParentNode.ContentNode : ParentNode;
	// 			if (focusBlockSlice - anchorBlockSlice > 0) {
	// 				ParentContentNode.removeDomNodes(true, anchorBlockSlice, focusBlockSlice);
	// 			}

	// 			this.MergeBlocks(ParentContentNode, 'up', 'forward');
	// 			selectionState.moveSelectionForward();
	// 		} else if (anchorNodeData !== undefined) selectionState.moveSelectionForward();
	// 		else if (focusNodeData !== undefined) selectionState.offsetToZero().toggleCollapse(true);
	// 	}
	// }
	/**
	 * Removing letters from nodes and updates them
	 * @param  {SelectionState} selectionState
	 * @returns void
	 */
	removeLetter(): void {
		this.insertLetter(undefined);
	}

	handleEnterTest(): void {
		let selectionState = getSelectionState();
		let anchorNode = selectionState.anchorNode;
		let focusNode = selectionState.focusNode;
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

export {createContentNode, ContentNode, isTextNode, isBlockNode, isContentNode};
