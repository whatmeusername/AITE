import {ClassVariables, Nullable} from "../Interfaces";
import {HTML_TEXT_NODE, BREAK_LINE_TAGNAME, BREAK_LINE_TYPE, ELEMENT_NODE_TYPE, TEXT_NODE_TYPE} from "../ConstVariables";
import {getIndexPathFromKeyPath, isLeafNode, isBaseNode} from "../EditorUtils";
import {AiteHTML, getKeyPathNodeByNode, isBlockNode, isTextNode} from "../index";

import {getEditorState, AiteHTMLNode, BlockNode, ContentNode} from "../index";

import {BaseNode, BreakLine, HeadNode, TextNode} from "../nodes/index";

interface blockchildrenExtended {
	node: AiteHTMLNode;
	nodePath: Array<number>;
	elementType: string | null;
	nodeKey: Nullable<number>;
}

interface selectionData {
	nodeKey: Nullable<number>;
	node: AiteHTMLNode;
	nodePath: Array<number>;
}

type granularity = "character" | "word" | "sentence" | "line" | "lineboundary" | "sentenceboundary";

/**
 * Checks if selection is backward direction
 * @returns boolean
 */
const isSelectionBackward = (rangeOrSelection: Selection | Range) => {
	if (rangeOrSelection instanceof Selection) {
		const pos = rangeOrSelection?.anchorNode?.compareDocumentPosition(rangeOrSelection.focusNode as HTMLElement);
		return (!pos && rangeOrSelection.anchorOffset > rangeOrSelection.focusOffset) || pos === Node.DOCUMENT_POSITION_PRECEDING;
	} else {
		const pos = rangeOrSelection?.startContainer?.compareDocumentPosition(rangeOrSelection.endContainer as HTMLElement);
		return (!pos && rangeOrSelection.startOffset > rangeOrSelection.endOffset) || pos === Node.DOCUMENT_POSITION_PRECEDING;
	}
};
/**
 * Returns window getSelection()
 * @returns Selection
 */
const getSelection = (): Selection => window.getSelection() as Selection;

function isBreakLine(node: any): node is BreakLine {
	return node instanceof BreakLine;
}
/**
 * Returns window getSelection() with applied modifications to selection
 * @returns Selection
 */
const getMutatedSelection = (alter: "move" | "extend", granularity: granularity, direction?: "backward" | "forward"): Selection => {
	const selection = getSelection();
	(selection as any).modify(alter, direction ? direction : isSelectionBackward(selection) ? "backward" : "forward", granularity);

	return selection;
};

class NodePath {
	path: Array<number>;

	constructor(path?: Array<number>) {
		this.path = path ?? [];
	}

	set(path: Array<number> | undefined): void {
		if (path !== undefined) this.path = path;
	}

	getContentNode() {
		const length = this.length() - 1;
		if (length <= 1) {
			return [];
		} else if (length > 1) {
			return this.path.slice(0, length - 1);
		} else return [];
	}

	getBlockPath() {
		const length = this.length() - 1;
		if (length > 0) {
			return this.path.slice(0, length);
		} else return this.path;
	}

	getBlockIndex() {
		const length = this.length() - 1;
		if (length > 0) {
			return this.path[length - 1];
		} else return this.getLastIndex();
	}

	addOrRemoveToBlock(operator: "dec" | "inc", value: number) {
		const length = this.length() - 1;
		if (length > 0) {
			if (operator === "dec") {
				this.path[length - 1] -= value;
			} else this.path[length - 1] += value;
		} else {
			if (operator === "dec") {
				this.path[length] -= value;
			} else this.path[length] += value;
		}
	}

	addOrRemoveToContent(operator: "dec" | "inc", value: number) {
		const length = this.length() - 1;
		if (length > 1) {
			if (operator === "dec") {
				this.path[length - 1] -= value;
			} else this.path[length - 1] += value;
		}
	}

	addOrRemoveToNode(operator: "dec" | "inc", value: number) {
		const length = this.length() - 1;
		if (length >= 0) {
			if (operator === "dec") {
				this.path[length] -= value;
			} else this.path[length] += value;
		}
	}

	getContentNodeIndex() {
		const length = this.length() - 1;
		if (length <= 1) {
			return 0;
		} else if (length > 1) {
			return this.path[length - 2];
		} else return 0;
	}

	get() {
		return this.path;
	}

	length() {
		return this.path.length;
	}

	getLastIndex(): number {
		return this.path[this.path.length - 1];
	}

	setLastPathIndex(index: number): void {
		this.path[this.path.length - 1] = index;
	}
}

class SelectionState {
	_anchorOffset: number;
	_focusOffset: number;

	anchorKey: Nullable<number>;
	focusKey: Nullable<number>;

	anchorType: string | null;
	focusType: string | null;

	isCollapsed: boolean;
	sameBlock: boolean;

	anchorNode: Nullable<HeadNode>;
	focusNode: Nullable<HeadNode>;

	anchorIndex: number;
	focusIndex: number;

	constructor() {
		this._anchorOffset = 0;
		this._focusOffset = 0;

		this.anchorKey = undefined;
		this.focusKey = undefined;

		this.anchorType = null;
		this.focusType = null;

		this.isCollapsed = false;
		this.sameBlock = false;

		this.anchorNode = null;
		this.focusNode = null;

		this.anchorIndex = -1;
		this.focusIndex = -1;
	}

	set anchorOffset(value: number) {
		this._anchorOffset = value < 0 ? 0 : value;
	}

	get anchorOffset(): number {
		return this._anchorOffset;
	}

	set focusOffset(value: number) {
		this._focusOffset = value < 0 ? 0 : value;
	}

	get focusOffset(): number {
		return this._focusOffset;
	}

	isNodesSame(): boolean {
		return this.anchorNode?.key === this.focusNode?.key;
	}

	/**
	 * Checks if selection anchor is on begging of block
	 * @returns boolean
	 */
	isAnchorOnStart(forceBlock?: BlockNode): boolean {
		if (this.anchorOffset > 0) return false;

		const firstNode = forceBlock ? forceBlock.getFirstChild(true) : this.anchorNode?.getContentNode().blockNode?.getFirstChild();
		if (!firstNode) return false;

		return this.anchorNode?.key === firstNode.key;
	}

	/**
	 * Checks if selection focus is on begging of block
	 * @returns boolean
	 */
	isFocusOnStart(forceBlock?: BlockNode): boolean {
		if (this.focusOffset > 0) return false;

		const firstNode = forceBlock ? forceBlock.getFirstChild(true) : this.focusNode?.getContentNode().blockNode?.getFirstChild();
		if (!firstNode) return false;

		return this.focusNode?.key === firstNode.key;
	}

	/**
	 * Checks if selection focus and anchor is on begging of block
	 * @returns boolean
	 */
	isOffsetOnStart(forceBlock?: BlockNode): boolean {
		if (!this.isCollapsed || (this.anchorOffset > 0 && this.focusOffset > 0)) return false;

		const firstNode = forceBlock ? forceBlock.getFirstChild(true) : this.anchorNode?.getContentNode().blockNode?.getFirstChild();
		if (!firstNode) return false;

		return this.anchorNode?.key === firstNode.key;
	}

	/**
	 * Resets SelectionState to it initial state
	 * @returns SelectionState - собственный возрат
	 */
	resetSelection(): SelectionState {
		this.anchorNode = null;
		this.focusNode = null;

		this.anchorOffset = 0;
		this.focusOffset = 0;

		this.anchorKey = undefined;
		this.focusKey = undefined;

		this.anchorType = null;
		this.focusType = null;

		this.isCollapsed = false;
		this.sameBlock = false;
		return this;
	}

	/**
	 * Settings anchor and focus offsets to zero
	 * @returns SelectionState - returning self
	 */
	offsetToZero(): SelectionState {
		this.anchorOffset = 0;
		this.focusOffset = 0;
		return this;
	}

	/**
	 * Finding path to node, that can used in Object Nodes
	 * @param  {AiteHTMLNode} node  - Node which requires path
	 * @returns selectionData - self return
	 */
	getPathToNodeByNode(node: AiteHTMLNode): selectionData | undefined {
		if (node.$$isAiteNode === true) {
			if (node.dataset?.aite_decorator_node === undefined) {
				node = node.firstChild ? (node.firstChild as AiteHTMLNode) : node;
			}

			if (node instanceof Text) {
				node = node.parentNode as AiteHTMLNode;
			}

			const data: selectionData = {
				nodeKey: node.$$AiteNodeKey,
				node: node,
				nodePath: getIndexPathFromKeyPath(getKeyPathNodeByNode(node)) ?? [],
			};

			return data;

			// while(node !== undefined) {
			// 	let parentNode = node.parentNode as AiteHTMLNode
			// 	if(parentNode?.dataset?.aite_editor_root !== undefined){
			// 		let nodeIndex = Array.from(parentNode.children).indexOf(node);
			// 		data.nodePath.unshift(nodeIndex)
			// 		return data
			// 	}
			// 	if(parentNode.$$isAiteWrapper === false){
			// 		if(node.dataset.aite_content_node === undefined){
			// 			let nodeIndex = Array.from(parentNode.children).indexOf(node);
			// 			data.nodePath.unshift(nodeIndex)
			// 		}
			// 		if(parentNode?.dataset?.aite_editor_root !== undefined){
			// 			return data
			// 		}
			// 	}
			// 	node = parentNode
			// }
		}
		return undefined;
	}

	setAnchorKey(KeyOrNode: BaseNode): SelectionState;
	setAnchorKey(KeyOrNode: number | undefined): SelectionState;
	setAnchorKey(KeyOrNode: number | BaseNode | undefined): SelectionState {
		this.anchorKey = isBaseNode(KeyOrNode) ? KeyOrNode.key : KeyOrNode;
		return this;
	}

	setFocusKey(KeyOrNode: BaseNode): SelectionState;
	setFocusKey(KeyOrNode: number | undefined): SelectionState;
	setFocusKey(KeyOrNode: number | BaseNode | undefined): SelectionState {
		this.focusKey = isBaseNode(KeyOrNode) ? KeyOrNode.key : KeyOrNode;
		return this;
	}

	setNodeKey(KeyOrNode: BaseNode): SelectionState;
	setNodeKey(KeyOrNode: number | undefined): SelectionState;
	setNodeKey(KeyOrNode: number | BaseNode | undefined): SelectionState {
		const isNode = isBaseNode(KeyOrNode);
		this.focusKey = isNode ? KeyOrNode.key : KeyOrNode;
		this.anchorKey = isNode ? KeyOrNode.key : KeyOrNode;
		return this;
	}

	/**
	 * Moving selection to next node or block
	 * @param  {ContentNode} ContentNode - ContentNode where next node will be searched
	 * @param  {number} step - How much nodes should be skipped
	 * @returns SelectionState - Self return
	 */
	moveSelectionToNextSibling(startNode?: BlockNode): SelectionState {
		let anchorBlock: BlockNode = startNode ?? ((this.anchorNode as BaseNode).parent as BlockNode);
		let nextNode;
		let shouldSearch = false;

		let currentNode = anchorBlock.getNodeByKey(this.anchorKey ?? -1) as BaseNode;
		currentNode = (currentNode ? currentNode.nextSibling() : anchorBlock.children[this.anchorIndex + 1]) as BaseNode;

		if (isLeafNode(anchorBlock) && !currentNode) {
			const index = anchorBlock.getSelfIndex();
			anchorBlock = anchorBlock.parent as BlockNode;
			nextNode = anchorBlock.getChildrenByIndex(index + 1);
			if (!nextNode) shouldSearch = true;
		} else if (isLeafNode(currentNode)) {
			anchorBlock = currentNode as BlockNode;
			nextNode = anchorBlock.getFirstChild();
		} else if (currentNode) {
			anchorBlock = currentNode.parent as BlockNode;
			nextNode = currentNode;
		} else {
			shouldSearch = true;
		}

		const getTextNode = (node: BlockNode): TextNode | null => {
			for (let i = 0, l = node.getLength(); i < l; i++) {
				const node = anchorBlock.getChildrenByIndex(i);
				if (isLeafNode(node)) {
					return getTextNode(node);
				} else if (isTextNode(node)) {
					return node;
				}
			}
			return null;
		};

		if (shouldSearch || !isTextNode(nextNode)) {
			while (anchorBlock) {
				anchorBlock = anchorBlock.nextSibling() as BlockNode;
				if (!isBlockNode(anchorBlock)) continue;
				nextNode = getTextNode(anchorBlock);
				if (nextNode) break;
			}
		}

		if (nextNode) {
			this.setNodeKey(nextNode.key);

			this.anchorOffset = 1;
			this.focusOffset = 1;

			this.anchorType = nextNode.getType() !== "text" ? "element" : "text";
			this.focusType = this.anchorType;
		}
		return this;
	}

	/**
	 * Moving selection to previous node or block
	 * @param  {ContentNode} ContentNode - ContentNode where previous node will be searched
	 * @returns SelectionState - Self return
	 */
	moveSelectionToPreviousBlock(ContentNode: ContentNode): SelectionState {
		// TODO REWRITE

		// blockIndex.addOrRemoveToBlock("dec", 1);
		// let anchorBlock = ContentNode.getBlockByPath(blockIndex.getBlockPath());

		// if (isLeafNode(anchorBlock)) {
		// 	anchorBlock = ContentNode.getBlockByPath(blockIndex.getContentNode());
		// 	blockIndex = new NodePath(blockIndex.getContentNode());
		// }

		// let lastNode;
		// let lastNodeIndex: number | undefined;

		// if (anchorBlock instanceof BlockNode) {
		// 	lastNode = anchorBlock.getChildrenByIndex(anchorBlock.getLastChildIndex());
		// 	lastNodeIndex = anchorBlock.getLastChildIndex();
		// } else {
		// 	while (anchorBlock !== undefined) {
		// 		blockIndex.addOrRemoveToBlock("dec", 1);
		// 		anchorBlock = ContentNode.getBlockByPath(blockIndex.getBlockPath());
		// 		if (anchorBlock instanceof BlockNode) {
		// 			lastNode = anchorBlock.getChildrenByIndex(anchorBlock.getLastChildIndex());
		// 			lastNodeIndex = anchorBlock.getLastChildIndex();
		// 		}
		// 	}
		// }
		// if (lastNode && isDefined(lastNodeIndex)) {
		// 	this.anchorOffset = lastNode.getContentLength();
		// 	this.focusOffset = lastNode.getContentLength();

		// 	this.setNodeKey(lastNode.key);

		// 	this.anchorPath.setLastPathIndex(lastNodeIndex ?? 0);
		// 	this.focusPath.setLastPathIndex(lastNodeIndex ?? 0);

		// 	this.anchorType = lastNode.getType() !== "text" ? "element" : "text";
		// 	this.focusType = this.anchorType;
		// }
		return this;
	}

	/**
	 * Moving selection to next block
	 * @param  {ContentNode} ContentNode -  ContentNode where next block will be searched
	 * @returns SelectionState - Self return
	 */
	moveSelectionToNextBlock(ContentNode: ContentNode): SelectionState {
		// TODO REWRITE

		// let blockIndex = this.anchorPath;

		// blockIndex.addOrRemoveToBlock("dec", 1);
		// let anchorBlock = ContentNode.getBlockByPath(blockIndex.getBlockPath());

		// let firstNode;

		// if (isLeafNode(anchorBlock)) {
		// 	anchorBlock = ContentNode.getBlockByPath(blockIndex.getContentNode());
		// 	blockIndex = new NodePath(blockIndex.getContentNode());
		// }

		// if (anchorBlock instanceof BlockNode) {
		// 	firstNode = anchorBlock.getChildrenByIndex(0);
		// } else {
		// 	while (anchorBlock !== undefined) {
		// 		blockIndex.addOrRemoveToBlock("dec", 1);
		// 		anchorBlock = ContentNode.getBlockByPath(blockIndex.getBlockPath());
		// 		if (anchorBlock instanceof BlockNode) {
		// 			firstNode = anchorBlock.getChildrenByIndex(0);
		// 		}
		// 	}
		// }
		// if (firstNode) {
		// 	this.anchorPath = blockIndex;
		// 	this.focusPath = blockIndex;

		// 	this.anchorOffset = 0;
		// 	this.focusOffset = 0;

		// 	this.setNodeKey(firstNode.key);

		// 	this.anchorPath.setLastPathIndex(0);
		// 	this.focusPath.setLastPathIndex(0);

		// 	this.anchorType = firstNode.getType() !== "text" ? "element" : "text";
		// 	this.focusType = this.anchorType;
		// }
		return this;
	}

	/**
	 * Moving selection to previous block
	 * @param  {ContentNode} ContentNode -  ContentNode where previous block will be searched
	 * @returns SelectionState - Self return
	 */
	moveSelectionToPreviousSibling(startNode?: BlockNode): SelectionState {
		let anchorBlock: BlockNode = startNode ?? ((this.anchorNode as BaseNode).parent as BlockNode);
		let nextNode;
		let shouldSearch = false;

		let currentNode = anchorBlock.getNodeByKey(this.anchorKey ?? -1) as BaseNode;
		currentNode = (currentNode ? currentNode.previousSibling() : anchorBlock.children[this.anchorIndex - 1]) as BaseNode;

		if (isLeafNode(anchorBlock) && !currentNode) {
			const index = anchorBlock.getSelfIndex();
			anchorBlock = anchorBlock.parent as BlockNode;
			nextNode = anchorBlock.getChildrenByIndex(index - 1);
			if (!nextNode) shouldSearch = true;
		} else if (isLeafNode(currentNode)) {
			anchorBlock = currentNode as BlockNode;
			nextNode = anchorBlock.getLastChild();
		} else if (currentNode) {
			anchorBlock = currentNode.parent as BlockNode;
			nextNode = currentNode;
		} else {
			shouldSearch = true;
		}

		const getTextNode = (node: BlockNode): TextNode | BreakLine | null => {
			for (let i = node.getLength() - 1, l = node.getLength(); i < l; i++) {
				const node = anchorBlock.getChildrenByIndex(i);
				if (isLeafNode(node)) {
					return getTextNode(node);
				} else if (isTextNode(node) || isBreakLine(node)) {
					return node;
				}
			}
			return null;
		};

		if (shouldSearch || !isTextNode(nextNode)) {
			while (anchorBlock) {
				anchorBlock = anchorBlock.previousSibling() as BlockNode;
				if (!isBlockNode(anchorBlock)) continue;
				nextNode = getTextNode(anchorBlock);
				if (nextNode) break;
			}
		}

		if (nextNode) {
			this.setNodeKey(nextNode.key);

			this.anchorOffset = (nextNode as any)?.getContentLength() ?? 0;
			this.focusOffset = (nextNode as any).getContentLength() ?? 0;

			this.anchorType = nextNode.getType() !== "text" ? "element" : "text";
			this.focusType = this.anchorType;
		}
		return this;
	}

	/**
	 * Moving selection offset forward by 1
	 * @returns SelectionState - Self return
	 */
	moveSelectionForward(): SelectionState {
		this.anchorOffset += 1;
		this.focusOffset += 1;
		return this;
	}

	/**
	 * Moving selection offset backward by 1
	 * @returns SelectionState - Self return
	 */
	moveSelectionBackward(): SelectionState {
		this.anchorOffset -= 1;
		this.focusOffset -= 1;
		return this;
	}

	getTextNode(node: HTMLElement): {isTextNode: boolean; TextNode: undefined | HTMLElement} {
		let childrenNode: HTMLElement | undefined = node;
		const data: {isTextNode: boolean; TextNode: undefined | HTMLElement} = {isTextNode: false, TextNode: undefined};
		while (childrenNode !== undefined) {
			if (childrenNode?.nodeType === HTML_TEXT_NODE || childrenNode?.tagName === BREAK_LINE_TAGNAME) {
				data.isTextNode = true;
				data.TextNode = childrenNode;
				return data;
			} else childrenNode = childrenNode?.firstChild as HTMLElement;
			if (childrenNode === undefined) break;
		}
		return data;
	}

	/**
	 * Collapsing selection
	 * @param  {boolean=false} focus - Collapse using focus data
	 * @returns SelectionState - Self return
	 */
	toggleCollapse(focus: boolean = false): SelectionState {
		this.isCollapsed = true;
		if (focus === true) {
			this.anchorOffset = this.focusOffset;
			this.anchorKey = this.focusKey;
			this.anchorType = this.focusType;
		} else {
			this.focusType = this.anchorType;
			this.focusOffset = this.anchorOffset;
			this.focusKey = this.anchorKey;
		}
		this.sameBlock = true;
		return this;
	}

	/**
	 * Defines node type
	 * @param  {Node|HTMLElement|AiteHTMLNode} node - Node which type shoul be defined
	 * @returns string - Node type
	 */
	$getNodeType(node: Node | HTMLElement | AiteHTMLNode): string | null {
		if (node.nodeName === BREAK_LINE_TAGNAME) return BREAK_LINE_TYPE;
		else if (node.nodeType === HTML_TEXT_NODE) return TEXT_NODE_TYPE;
		else {
			while (node.firstChild !== null) {
				node = node.firstChild;
			}

			if (node.nodeType === HTML_TEXT_NODE || node.nodeName === BREAK_LINE_TYPE) return TEXT_NODE_TYPE;
			else if (node.nodeName === BREAK_LINE_TAGNAME) return BREAK_LINE_TYPE;
			else if (node.nodeType === 1) return ELEMENT_NODE_TYPE;

			return null;
		}
	}

	/**
	 * Unfolds current selection data
	 * @returns void
	 */
	__reverseSelection(): void {
		const selectionCopy = {...this};

		this.anchorKey = selectionCopy.anchorKey;
		this.focusKey = selectionCopy.focusKey;

		this.focusType = selectionCopy.anchorType;
		this.anchorType = selectionCopy.focusType;
	}

	/**
	 * Gets data from selected node
	 * @param  {Node} node - node which data should be getted
	 * @returns blockchildrenExtended
	 */
	__getBlockNode(node: AiteHTML): blockchildrenExtended {
		const currentBlockData = this.getPathToNodeByNode(node as AiteHTMLNode);
		if (currentBlockData !== undefined) {
			let ElementType = null;
			if (node?.firstChild?.nodeName === BREAK_LINE_TAGNAME) {
				ElementType = BREAK_LINE_TYPE;
			} else {
				ElementType = node.$$AiteNodeType ? node.$$AiteNodeType : this.$getNodeType(node);
			}

			const Result: blockchildrenExtended = {
				node: currentBlockData.node,
				nodePath: currentBlockData.nodePath,
				elementType: ElementType,
				nodeKey: currentBlockData.nodeKey,
			};
			return Result;
			// TODO: REPLACE WITH onError METHOD
		} else throw new Error("Not returned return value during condition check");
	}

	removeSelection(): void {
		const selection = getSelection();
		if (selection) {
			selection.removeAllRanges();
		}
	}

	/**
	 * Get current caret data by selection
	 * @param  {Range|undefined} forceRange - forced Range which data will be used to set selectionState data
	 * @returns void
	 */
	getCaretPosition(forceRange?: Range): void {
		const selection = getSelection();

		if (forceRange === undefined && (!selection.anchorNode || !selection.focusNode)) return;

		const range = forceRange ?? selection.getRangeAt(0);
		const anchorNode = range?.startContainer as AiteHTML;
		const focusNode = range?.endContainer as AiteHTML;

		if (range !== undefined) {
			if (!anchorNode || !focusNode || !anchorNode.$$isAiteNode || !anchorNode.$$isAiteNode) return;

			this.isCollapsed = range.collapsed;
			const isBackward = isSelectionBackward(range);

			this.anchorNode = anchorNode.$$ref;
			this.anchorIndex = anchorNode.$$ref?.getSelfIndex() ?? -1;
			const anchorNodeData = this.__getBlockNode(anchorNode);

			if (anchorNodeData) {
				this.anchorKey = anchorNodeData.nodeKey;
				this.anchorType = anchorNodeData.elementType;

				this.anchorOffset = isBackward ? range.endOffset : range.startOffset;
			}

			if (this.isCollapsed) {
				this.toggleCollapse();
				this.sameBlock = true;
				this.focusNode = anchorNode.$$ref;
			} else {
				this.focusNode = focusNode.$$ref;
				this.focusIndex = focusNode.$$ref?.getSelfIndex() ?? -1;
				const focusNodeData = this.__getBlockNode(focusNode);

				this.focusKey = focusNodeData.nodeKey;
				this.focusType = focusNodeData.elementType;

				this.focusOffset = isBackward ? range.startOffset : range.endOffset;

				this.sameBlock = this.isSameBlockNode(anchorNodeData.node, focusNodeData.node);

				if (this.isSameContentNode(anchorNodeData.node, focusNodeData.node) === false) {
					this.toggleCollapse();
					this.focusOffset = (focusNode as HTMLElement).textContent?.length ?? this.focusOffset;
					this.setCaretPosition();
				}
			}
		}
	}

	isSameContentNode(node: AiteHTMLNode, secondNode: AiteHTMLNode): boolean {
		return node.closest("[data-aite_content_node]") === secondNode.closest("[data-aite_content_node]");
	}

	isSameBlockNode(node: AiteHTMLNode, secondNode: AiteHTMLNode): boolean {
		return node.closest("[data-aite-block-node]") === secondNode.closest("[data-aite-block-node]");
	}

	/**
	 * Set caret position using
	 * @returns void
	 */
	setCaretPosition(): void {
		const selection = window.getSelection();

		if (selection) {
			const range = document.createRange();
			const EditorState = getEditorState();

			const anchorNode = EditorState?.__editorDOMState.getNodeFromMap(this.anchorKey);

			if (anchorNode === undefined) {
				this.getCaretPosition();
				return;
			}

			this.anchorNode = anchorNode.$$ref;
			this.anchorIndex = anchorNode.$$ref?.getSelfIndex() ?? -1;

			const anchorType = this.$getNodeType(anchorNode);

			let focusNode;
			let focusType;

			if (this.isCollapsed) {
				focusNode = anchorNode;
				this.focusNode = this.anchorNode;
				this.focusIndex = this.anchorIndex;
			} else {
				const focusNode = EditorState?.__editorDOMState.getNodeFromMap(this.focusKey);
				if (focusNode === undefined) return;

				this.focusNode = focusNode.$$ref;
				this.focusIndex = focusNode.$$ref?.getSelfIndex() ?? -1;
				focusType = this.$getNodeType(focusNode);
			}

			if (anchorType === TEXT_NODE_TYPE) {
				const anchorNodeText = (anchorNode as Node).textContent;
				if (anchorNodeText !== null) {
					if (this.anchorOffset > anchorNodeText.length) {
						this.anchorOffset = anchorNodeText.length;
					}
					range.setStart(anchorNode?.firstChild as Node, this.anchorOffset);
				}
			} else if (anchorType === ELEMENT_NODE_TYPE || anchorType === BREAK_LINE_TYPE) {
				range.setStart(anchorNode as HTMLElement as Node, this.anchorOffset);
			}

			if (focusType === TEXT_NODE_TYPE) {
				const focusNodeText = (focusNode as Node).textContent;
				if (focusNodeText !== null) {
					if (this.focusOffset > focusNodeText.length) {
						this.focusOffset = focusNodeText.length;
					}
					range.setEnd(focusNode?.firstChild as Node, this.focusOffset);
				}
			} else if (focusType === ELEMENT_NODE_TYPE || focusType === BREAK_LINE_TYPE) {
				range.setEnd(focusNode as HTMLElement as Node, this.focusOffset);
			}

			selection.removeAllRanges();
			selection.addRange(range);
		}
	}

	/**
	 * Get current selectionState data
	 * @returns insertSelection - selectionState Data
	 */
	get(): ClassVariables<SelectionState> {
		return {
			anchorOffset: this.anchorOffset,
			focusOffset: this.focusOffset,

			anchorType: this.anchorType,
			focusType: this.focusType,

			isCollapsed: this.isCollapsed,
			sameBlock: this.sameBlock,
		};
	}
}

export {SelectionState, NodePath, isSelectionBackward, getSelection, getMutatedSelection};

export type {selectionData};
