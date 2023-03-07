import type {ClassVariables, Nullable} from "../Interfaces";
import {HTML_TEXT_NODE, BREAK_LINE_TAGNAME, BREAK_LINE_TYPE, ELEMENT_NODE_TYPE, TEXT_NODE_TYPE} from "../ConstVariables";
import {isLeafNode, isBaseNode, isTextNode, isBlockNode} from "../EditorUtils";
import {getEditorState, AiteHTMLNode, BlockNode, AiteHTML, AiteRange, SelectedNodeData} from "../index";
import {BaseNode, BreakLine, HeadNode, TextNode} from "../nodes/index";
import {getSelection, isSelectionBackward} from "./utils";

// TEMPERARY
function isBreakLine(node: any): node is BreakLine {
	return node instanceof BreakLine;
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

	get isSameNode(): boolean {
		return this.anchorNode?.key === this.focusNode?.key;
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
		else if (this.anchorType === "breakline") return true;

		const firstNode = forceBlock ? forceBlock.getFirstChild(true) : this.anchorNode?.getContentNode().blockNode?.getFirstChild(true);
		if (!firstNode) return false;

		return this.anchorNode?.key === firstNode.key;
	}

	/**
	 * Checks if selection focus and anchor is on end of block
	 * @returns boolean
	 */
	isOffsetOnEnd(forceBlock?: BlockNode): boolean {
		if (!this.isCollapsed || (this.anchorOffset < (this.anchorNode as BaseNode).length && this.focusOffset < (this.focusNode as BaseNode).length)) return false;
		else if (this.anchorType === "breakline") return true;

		const firstNode = forceBlock ? forceBlock.getLastChild(true) : this.anchorNode?.getContentNode().blockNode?.getLastChild(true);
		if (!firstNode) return false;

		return this.anchorNode?.key === firstNode.key;
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
	 * @param  {ContentNode} ContentNode -  ContentNode where previous node will be searched
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

			this.anchorOffset = nextNode.length;
			this.focusOffset = nextNode.length;

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
			this.anchorNode = this.focusNode;
			this.anchorIndex = this.focusIndex;
		} else {
			this.focusType = this.anchorType;
			this.focusOffset = this.anchorOffset;
			this.focusKey = this.anchorKey;
			this.focusNode = this.anchorNode;
			this.focusIndex = this.anchorIndex;
		}
		this.sameBlock = true;
		return this;
	}

	/**
	 * Defines node type
	 * @param  {Node|HTMLElement|AiteHTMLNode} node - Node which type shoul be defined
	 * @returns string - Node type
	 */
	getNodeType(node: Node | HTMLElement | AiteHTMLNode): string | null {
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
	 * Gets data from selected node
	 * @param  {Node} node - node which data should be getted
	 * @returns SelectedNodeData type
	 */
	getNodeData(node: AiteHTML): SelectedNodeData {
		if ((node as AiteHTMLNode)?.dataset?.["aite_editor_root"]) {
			node = node.firstChild as AiteHTML;
		} else if (node instanceof Text) {
			node = node.parentNode as AiteHTMLNode;
		}

		if (node !== undefined) {
			let ElementType = null;
			if (node?.firstChild?.nodeName === BREAK_LINE_TAGNAME) {
				ElementType = BREAK_LINE_TYPE;
				node = node.firstChild as AiteHTMLNode;
			} else {
				ElementType = node.$AiteNodeType ? node.$AiteNodeType : this.getNodeType(node);
			}

			return {
				node: node as AiteHTMLNode,
				elementType: ElementType,
				nodeKey: node.$AiteNodeKey,
			};
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
	getCaretPosition(forceRange?: AiteRange): void {
		const selection = getSelection();

		if (forceRange === undefined && (!selection.anchorNode || !selection.focusNode)) return;

		const range = forceRange ?? selection.getRangeAt(0);
		const anchorNode = range?.startContainer;

		if (range !== undefined) {
			if (!range?.startContainer || !range?.endContainer || !range?.startContainer.$isAiteNode || !range?.endContainer.$isAiteNode) return;

			this.isCollapsed = range.collapsed;
			const isBackward = isSelectionBackward(range);

			const anchorNodeData = this.getNodeData(range.startContainer);
			const anchorNode = anchorNodeData.node;

			this.anchorNode = anchorNode.$ref;
			this.anchorIndex = anchorNode.$ref?.getSelfIndex() ?? -1;

			if (anchorNodeData) {
				this.anchorKey = anchorNodeData.nodeKey;
				this.anchorType = anchorNodeData.elementType;

				this.anchorOffset = isBackward ? range.endOffset : range.startOffset;
			}

			if (this.isCollapsed) {
				this.toggleCollapse();
				this.sameBlock = true;
				this.focusNode = anchorNode.$ref;
			} else {
				const focusNodeData = this.getNodeData(range.endContainer);
				const focusNode = focusNodeData.node;

				this.focusNode = focusNode.$ref;
				this.focusIndex = focusNode.$ref?.getSelfIndex() ?? -1;

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

			const anchorNode = EditorState?.EditorDOMState.getNodeFromMap(this.anchorKey);

			if (anchorNode === undefined) {
				this.getCaretPosition();
				return;
			}

			this.anchorNode = anchorNode.$ref;
			this.anchorIndex = anchorNode.$ref?.getSelfIndex() ?? -1;

			const anchorType = this.getNodeType(anchorNode);

			let focusNode;
			let focusType;

			if (this.isCollapsed) {
				focusNode = anchorNode;
				this.focusNode = this.anchorNode;
				this.focusIndex = this.anchorIndex;
			} else {
				focusNode = EditorState?.EditorDOMState.getNodeFromMap(this.focusKey);
				if (focusNode === undefined) return;

				this.focusNode = focusNode.$ref;
				this.focusIndex = focusNode.$ref?.getSelfIndex() ?? -1;
				focusType = this.getNodeType(focusNode);
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
				range.setStart(anchorNode as HTMLElement as Node, 0);
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
				range.setEnd(focusNode as HTMLElement, 0);
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

export {SelectionState};
