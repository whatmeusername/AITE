import type {Nullable} from "../Interfaces";
import {BREAK_LINE_TAGNAME, BREAK_LINE_TYPE, ELEMENT_NODE_TYPE, TEXT_NODE_TYPE} from "../ConstVariables";
import {AiteHTMLNode, BlockNode, AiteHTML, AiteRange, SelectedNodeData, NodeInsertionDeriction} from "../index";
import {BaseNode, BreakLineNode, ContentNode, createBreakLine, createBreakLineNode, HeadNode, NodeTypes} from "../nodes/index";
import {getSelection, isSelectionBackward} from "./utils";
import {ObservableSelection} from "../observers";
import {isBlockNode, isHorizontalRuleNode, isTextNode} from "../typeguards";
import {NodeStatus} from "../nodes/interface";

// TEMPERARY
function isBreakLine(node: any): node is BreakLineNode {
	return node instanceof BreakLineNode;
}

class SelectionState {
	private _anchorOffset: number;
	private _focusOffset: number;

	public anchorKey: Nullable<number>;
	public focusKey: Nullable<number>;

	public anchorType: string | null;
	public focusType: string | null;

	public isCollapsed: boolean;
	public sameBlock: boolean;

	public anchorNode: Nullable<HeadNode>;
	public focusNode: Nullable<HeadNode>;

	public previousSibling: Nullable<HeadNode>;
	public nextSibling: Nullable<HeadNode>;

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

		this.previousSibling = null;
		this.nextSibling = null;

		return ObservableSelection(this).value();
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

	public stabilize(): void {
		const isAM = this.anchorNode?.status === NodeStatus.MOUNTED;
		const isFM = this.focusNode?.status === NodeStatus.MOUNTED;

		if (isAM) this.toggleCollapse();
		else if (isFM) this.toggleCollapse(true).offsetToZero();
		else {
			const nextNode = this.previousSibling;
			if (!nextNode) this.getCaretPosition();
			else nextNode.focus();
		}
	}

	/**
	 * Checks if selection anchor is on begging of block
	 * @returns boolean
	 */
	public isAnchorOn(on: "end" | "start", forceBlock?: BlockNode): boolean {
		if ((on === "start" && this.anchorOffset > 0) || (on === "end" && this.anchorOffset < (this.anchorNode as BaseNode).length)) return false;

		const top = forceBlock ?? this.anchorNode?.getContentNode().blockNode;
		const firstNode = on === "start" ? top?.getFirstChild(true) : top?.getLastChild(true);
		if (!firstNode) return false;

		return this.anchorNode?.key === firstNode.key;
	}

	/**
	 * Checks if selection focus is on begging of block
	 * @returns boolean
	 */
	public isFocusOn(on: "end" | "start", forceBlock?: BlockNode): boolean {
		if ((on === "start" && this.focusOffset > 0) || (on === "end" && this.focusOffset < (this.focusNode as BaseNode).length)) return false;

		const top = forceBlock ?? this.focusNode?.getContentNode().blockNode;
		const firstNode = on === "start" ? top?.getFirstChild(true) : top?.getLastChild(true);
		if (!firstNode) return false;

		return this.focusNode?.key === firstNode.key;
	}

	/**
	 * Checks if selection focus and anchor is on begging of block
	 * @returns boolean
	 */
	public isOffsetOnStart(forceBlock?: BlockNode): boolean {
		if (!this.isCollapsed || (this.anchorOffset > 0 && this.focusOffset > 0)) return false;
		else if (this.anchorType === BREAK_LINE_TYPE) return true;

		const firstNode = forceBlock ? forceBlock.getFirstChild(true) : this.anchorNode?.getContentNode().blockNode?.getFirstChild(true);
		if (!firstNode) return false;

		return this.anchorNode?.key === firstNode.key;
	}

	/**
	 * Checks if selection focus and anchor is on end of block
	 * @returns boolean
	 */
	public isOffsetOnEnd(forceBlock?: BlockNode): boolean {
		if (!this.isCollapsed || (this.anchorOffset < (this.anchorNode as BaseNode).length && this.focusOffset < (this.focusNode as BaseNode).length)) return false;
		else if (this.anchorType === BREAK_LINE_TYPE) return true;

		const firstNode = forceBlock ? forceBlock.getLastChild(true) : this.anchorNode?.getContentNode().parentBlockNode?.getLastChild(true);
		if (!firstNode) return false;

		return this.anchorNode?.key === firstNode.key;
	}

	/**
	 * Settings anchor and focus offsets to zero
	 * @returns SelectionState - returning self
	 */
	public offsetToZero(): SelectionState {
		this.anchorOffset = 0;
		this.focusOffset = 0;
		return this;
	}

	public setNode(node: HeadNode): SelectionState {
		this.anchorNode = node;
		this.focusNode = node;
		return this;
	}

	/**
	 * Moving selection to next node or block
	 * @param  {ContentNode} ContentNode - ContentNode where next node will be searched
	 * @returns SelectionState - Self return
	 */
	public moveSelectionToNextSibling(options?: {preventUpdate?: boolean; NodeBlockLevel?: boolean; startFromFocusNode?: boolean}): Nullable<NodeTypes> {
		function getAvailableNextAncestor(node: Nullable<BaseNode>) {
			if (!node) return node;
			while (node.parent) {
				const next = node.nextSibling();
				if (options?.NodeBlockLevel && node.parent.type === "content") {
					return null;
				} else if (next) return next;
				node = node.parent;
			}
		}

		function getFocusableNode(ancestor: BlockNode): BaseNode {
			for (let i = 0; i < ancestor.children.length; i++) {
				const node = ancestor.children[i];
				if (isBlockNode(node)) {
					return getFocusableNode(node);
				} else if (node.isFocusable) {
					return node;
				}
			}
			return ancestor;
		}

		let nextNode = (options?.startFromFocusNode ? this.focusNode : this.anchorNode)?.nextSibling();
		if (!nextNode) nextNode = getAvailableNextAncestor(this.anchorNode);

		while (nextNode && !nextNode.isFocusable && nextNode.type !== "content") {
			nextNode = isBlockNode(nextNode) ? getFocusableNode(nextNode) : nextNode;
			if (nextNode.isFocusable) break;
			const nNode = nextNode.nextSibling();
			nextNode = !nNode ? getAvailableNextAncestor(nNode) : nNode;
		}

		if (!options?.preventUpdate && nextNode) {
			//TODO: FIX BUG WHEN CANT PLACE CARET ON 0:0 OFFSET
			this.anchorOffset = 0;
			this.focusOffset = 0;
			this.anchorNode = nextNode;
			this.focusNode = nextNode;
		}

		return nextNode;
	}

	/**
	 * Moving selection to previous node or block
	 * @param  {ContentNode} ContentNode -  ContentNode where previous node will be searched
	 * @returns SelectionState - Self return
	 */
	public moveSelectionToPreviousSibling(options?: {preventUpdate?: boolean; NodeBlockLevel?: boolean; startFromFocusNode?: boolean}): Nullable<NodeTypes> {
		function getAvailablePreviousAncestor(node: Nullable<BaseNode>) {
			if (!node) return node;
			while (node.parent) {
				const prev = node.previousSibling();
				if (options?.NodeBlockLevel && node.parent.type === "content") {
					return null;
				} else if (prev) return prev;
				node = node.parent;
			}
		}

		function getFocusableNode(ancestor: BlockNode): BaseNode {
			for (let i = ancestor.children.length - 1; i >= 0; i--) {
				const node = ancestor.getChildrenByIndex(i);
				if (isBlockNode(node)) {
					return getFocusableNode(node);
				} else if (node.isFocusable) {
					return node;
				}
			}
			return ancestor;
		}

		let nextNode = (options?.startFromFocusNode ? this.focusNode : this.anchorNode)?.previousSibling();
		if (!nextNode) nextNode = getAvailablePreviousAncestor(this.anchorNode);

		while (nextNode && !nextNode.isFocusable && nextNode.type !== "content") {
			nextNode = isBlockNode(nextNode) ? getFocusableNode(nextNode) : nextNode;
			if (nextNode.isFocusable) break;
			const prevNode = nextNode.previousSibling();
			nextNode = !prevNode ? getAvailablePreviousAncestor(nextNode) : prevNode;
		}

		if (!options?.preventUpdate && nextNode) {
			this.anchorOffset = nextNode.length;
			this.focusOffset = nextNode.length;
			this.anchorNode = nextNode;
			this.focusNode = nextNode;
		}
		return nextNode;
	}

	/**
	 * Moving selection offset forward by 1
	 * @returns SelectionState - Self return
	 */
	public moveSelectionForward(): SelectionState {
		this.anchorOffset += 1;
		this.focusOffset += 1;
		return this;
	}

	/**
	 * Moving selection offset backward by 1
	 * @returns SelectionState - Self return
	 */
	public moveSelectionBackward(): SelectionState {
		this.anchorOffset -= 1;
		this.focusOffset -= 1;
		return this;
	}

	/**
	 * Collapsing selection
	 * @param  {boolean=false} focus - Collapse using focus data
	 * @returns SelectionState - Self return
	 */
	public toggleCollapse(focus: boolean = false): SelectionState {
		this.isCollapsed = true;
		if (focus === true) {
			this.anchorOffset = this.focusOffset;
			this.anchorNode = this.focusNode;
		} else {
			this.focusNode = this.anchorNode;
			this.focusOffset = this.anchorOffset;
		}
		this.sameBlock = true;
		return this;
	}

	/**
	 * Gets data from selected node
	 * @param  {Node} node - node which data should be getted
	 * @returns SelectedNodeData type
	 */
	public getNodeData(node: AiteHTML): SelectedNodeData {
		if ((node as AiteHTMLNode)?.dataset?.["aite_editor_root"]) {
			node = node.firstChild as AiteHTML;
		} else if (node instanceof Text) {
			node = node.parentNode as AiteHTMLNode;
		}

		if (node !== undefined) {
			if (node?.firstChild?.nodeName === BREAK_LINE_TAGNAME) {
				node = node.firstChild as AiteHTMLNode;
			}

			return {
				node: node as AiteHTMLNode,
				nodeKey: node.$AiteNodeKey,
			};
		} else throw new Error("Not returned return value during condition check");
	}

	/**
	 * Get current caret data by selection
	 * @param  {Range|undefined} forceRange - forced Range which data will be used to set selectionState data
	 * @returns void
	 */
	public getCaretPosition(forceRange?: AiteRange): void {
		const selection = getSelection();

		if (forceRange === undefined && (!selection.anchorNode || !selection.focusNode)) return;

		const range = forceRange ?? selection.getRangeAt(0);

		if (!range || !range.startContainer || !range.endContainer || !range.startContainer.$isAiteNode || !range.endContainer.$isAiteNode) return;

		this.isCollapsed = range.collapsed;
		const isBackward = isSelectionBackward(range);

		const anchorNodeData = this.getNodeData(range.startContainer);

		this.anchorNode = anchorNodeData.node.$ref;
		this.anchorOffset = isBackward ? range.endOffset : range.startOffset;

		if (this.isCollapsed) this.toggleCollapse();
		else {
			const focusNodeData = this.getNodeData(range.endContainer);

			this.focusNode = focusNodeData.node.$ref;
			this.focusOffset = isBackward ? range.startOffset : range.endOffset;

			this.sameBlock = this.isSameBlockNode(anchorNodeData.node, focusNodeData.node);

			// if (!this.isSameContentNode(anchorNodeData.node, focusNodeData.node)) {
			// 	this.toggleCollapse();
			// 	this.focusOffset = focusNodeData.node.textContent?.length ?? this.focusOffset;
			// 	this.setCaretPosition();
			// }
		}
	}

	public isSameBlockNode(node: AiteHTMLNode, secondNode: AiteHTMLNode): boolean {
		return node.$ref?.getContentNode().blockNode?.key === secondNode.$ref?.getContentNode().blockNode?.key;
	}

	/**
	 * Set caret position using
	 * @returns void
	 */
	public setCaretPosition(): void {
		try {
			const selection = window.getSelection();
			if (!selection) return;

			const range = document.createRange();
			const anchorNode = this.anchorNode?.domRef;
			const focusNode = this.focusNode?.domRef;

			if (!anchorNode || !focusNode) {
				this.getCaretPosition();
				return;
			}

			if (this.anchorType === TEXT_NODE_TYPE) {
				const anchorNodeText = anchorNode.textContent;
				if (anchorNodeText) {
					this.anchorOffset = this.anchorOffset > anchorNodeText.length ? anchorNodeText.length : this.anchorOffset;
					range.setStart(anchorNode?.firstChild, this.anchorOffset);
				}
			} else if (this.anchorType === ELEMENT_NODE_TYPE || this.anchorType === BREAK_LINE_TYPE) {
				range.setStart(anchorNode, 0);
			}

			if (this.focusType === TEXT_NODE_TYPE) {
				const focusNodeText = focusNode.textContent;
				if (focusNodeText !== null) {
					this.focusOffset = this.focusOffset > focusNodeText.length ? focusNodeText.length : this.focusOffset;

					range.setEnd(focusNode?.firstChild, this.focusOffset);
				}
			} else if (this.focusType === ELEMENT_NODE_TYPE || this.focusType === BREAK_LINE_TYPE) {
				range.setEnd(focusNode, 0);
			}

			selection.removeAllRanges();
			selection.addRange(range);
		} catch (_) {
			this.getCaretPosition();
		}
	}

	// TODO: MOVE METHOD TO SELECTION AS METHOD
	public insertLetter(KeyBoardEvent?: KeyboardEvent) {
		const isSelectionOnSameNode = this.isSameNode;
		let SliceFrom = this.anchorOffset;
		const SliceTo = this.focusOffset;

		const isRemove = KeyBoardEvent === undefined;

		let key = isRemove ? "" : KeyBoardEvent ? KeyBoardEvent.key : "";

		const anchorNode: BaseNode = this.anchorNode as BaseNode;
		const focusNode: BaseNode = this.focusNode as BaseNode;

		const anchorBlock: BlockNode = anchorNode.parent as BlockNode;
		const focusBlock: BlockNode = focusNode.parent as BlockNode;

		const {contentNode, blockNode}: {contentNode: ContentNode | undefined; blockNode: BlockNode | undefined} = anchorNode.getContentNode();

		const handleOffsetStart = (): void => {
			if (!blockNode) return;

			const previousBlock = blockNode?.previousSibling();
			if (!previousBlock) return;

			if (isHorizontalRuleNode(previousBlock) || isBreakLine(previousBlock)) {
				previousBlock.remove();
			} else if (anchorBlock.isBreakLine) {
				anchorBlock.remove();
			} else if (isBlockNode(previousBlock)) {
				if (contentNode) {
					contentNode.MergeBlockNode(previousBlock, blockNode);
				}
			}
		};

		if (isRemove && !blockNode?.isBreakLine && blockNode?.children && this.isAnchorOn("start") && this.isFocusOn("end")) {
			const breakLine = createBreakLineNode();
			blockNode.children = [breakLine];
			breakLine.focus();
		} else if (this.isCollapsed && isRemove && this.isOffsetOnStart(blockNode)) handleOffsetStart();
		else if (this.sameBlock && (this.isCollapsed || isSelectionOnSameNode) && isTextNode(anchorNode)) {
			SliceFrom = isRemove && this.isCollapsed ? this.anchorOffset - 1 : this.anchorOffset;

			if (this.isCollapsed) {
				if (KeyBoardEvent?.which === 229 && key === " ") {
					key = ".";
					SliceFrom -= 1;
				} else if (!isRemove) this.moveSelectionForward();
				else if (isRemove) this.moveSelectionBackward();
			} else if (!isRemove) {
				this.moveSelectionForward();
			}
			anchorNode.sliceContent(SliceFrom, SliceTo, key);
		} else if (this.sameBlock && isTextNode(anchorNode) && isTextNode(focusNode)) {
			anchorBlock.getNodesBetween(anchorNode.key, focusNode.key).original.forEach((node) => node.remove());
			anchorNode.sliceContent(SliceFrom, -1, key);
			focusNode.sliceContent(SliceTo);

			if (isBreakLine(anchorBlock)) this.toggleCollapse().setNode(anchorBlock.getFirstChild(true));
			else {
				if (!isRemove) this.moveSelectionForward();
			}
		} else if (!this.sameBlock && contentNode) {
			contentNode.getBlockNodesBetween(anchorBlock, focusBlock).forEach((node) => node.remove());

			anchorBlock.getNodesBetween(anchorNode.key).original.forEach((node) => node.remove());
			isTextNode(anchorNode) ? anchorNode.sliceContent(SliceFrom, -1, key) : anchorNode.remove();

			focusBlock.getNodesBetween(-1, focusNode.key).original.forEach((node) => node.remove());
			isTextNode(focusNode) ? focusNode.sliceContent(SliceTo) : focusNode.remove();

			contentNode.MergeBlockNode(anchorBlock, focusBlock);

			if (!isRemove) this.moveSelectionForward();
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

	public insertEnter(): void {
		if (!this.anchorNode || !this.focusNode) return;

		const onStart = this.isOffsetOnStart();
		const onEnd = this.isOffsetOnEnd();

		if (onStart || onEnd) {
			const newBreakLine = createBreakLine();
			const {contentNode, index} = this.anchorNode.getContentNode();
			if (contentNode) {
				contentNode.insertNode(newBreakLine, index, onStart ? NodeInsertionDeriction.BEFORE : NodeInsertionDeriction.AFTER);
				if (!onStart) {
					this.setNode(newBreakLine.children[0]).offsetToZero();
				}
			}
		} else if (this.isCollapsed) {
			const anchorParent = this.anchorNode.parent as BlockNode;
			const focusParent = this.anchorNode.parent as BlockNode;
			const {contentNode, index, blockNode} = this.anchorNode.getContentNode();
			if (blockNode) {
				const nodesAfterPointer = anchorParent.getNodesBetween(this.anchorNode.key, -1, false, false, undefined, true);
				nodesAfterPointer.original.forEach((node) => node.remove());
				const newBlockNode = blockNode.clone();

				if (isTextNode(this.anchorNode)) {
					const textNodePart = this.anchorNode.sliceToTextNode(this.anchorOffset, -1);
					//TODO: MOVE TO GETNODESBETWEEN
					newBlockNode.append(textNodePart);
				} else this.anchorNode.remove();

				newBlockNode.append(...nodesAfterPointer.modified);
				contentNode?.insertNode(newBlockNode, index, NodeInsertionDeriction.AFTER);
				newBlockNode.getFirstChild().focus(true);
			}
		}
	}
}

export {SelectionState};
