import {ClassVariables} from './Interfaces';
import {TEXT_NODE, BREAK_LINE, BREAK_LINE_TYPE, ELEMENT_NODE_TYPE, TEXT_NODE_TYPE, STANDART_BLOCK_TYPE} from './ConstVariables';
import {findEditorFullPathToCharNode} from './EditorUtils';

import ContentNode from './ContentNode';
import type {BlockType} from './BlockNode';
import type BlockNode from './BlockNode';

interface blockNodeData {
	blockNode: HTMLElement | Node;
	index: Array<number>;
	elementType: string | null;
}
interface blockNodeDataExtended extends blockNodeData {
	charKey: number;
}

export type SelectionStateData = ClassVariables<SelectionState>;

export class BlockPath {
	path: Array<number>;

	constructor(path?: Array<number>) {
		this.path = path ?? [0];
	}

	set(path: Array<number> | undefined): void {
		if (path !== undefined) this.path = path;
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

	getPathIndexByIndex(index: number): number {
		if (index < 0) {
			return this.path[this.length() + index];
		}
		return this.path[index];
	}

	getSlicedPath(sliceTo: number): Array<number> {
		if (sliceTo < 0) {
			return this.path.slice(0, this.length() + sliceTo);
		} else return this.path.slice(0, sliceTo);
	}

	setLastPathIndex(index: number): void {
		this.path[this.path.length - 1] = index;
	}

	getPathBeforeLast(): Array<number> {
		if (this.length() > 1) {
			return this.path.slice(0, this.length() - 1);
		}
		return this.path;
	}

	decrementLastPathIndex(to: number): void {
		this.path[this.path.length - 1] -= to;
	}

	incrementLastPathIndex(to: number): void {
		this.path[this.path.length - 1] += to;
	}
}

export class SelectionState {
	anchorOffset: number;
	focusOffset: number;

	anchorKey: BlockPath;
	focusKey: BlockPath;

	anchorCharKey: number;
	focusCharKey: number;

	_anchorNode: Node | number | null;
	_focusNode: Node | number | null;

	anchorType: string | null;
	focusType: string | null;

	isCollapsed: boolean;
	isDirty: boolean;

	constructor() {
		this.anchorOffset = 0;
		this.focusOffset = 0;

		this.anchorKey = new BlockPath();
		this.focusKey = new BlockPath();

		this.anchorCharKey = 0;
		this.focusCharKey = 0;

		this._anchorNode = null;
		this._focusNode = null;

		this.anchorType = null;
		this.focusType = null;

		this.isCollapsed = false;
		this.isDirty = false;
	}

	set anchorNode(Node: Node | number | null) {
		if (typeof Node === 'number') {
			this.isDirty = true;
			this._anchorNode = Node;
		} else {
			this.isDirty = false;
			this._anchorNode = Node;
		}
	}

	set focusNode(Node: Node | number | null) {
		if (typeof Node === 'number') {
			this.isDirty = true;
			this._focusNode = Node;
		} else {
			this.isDirty = false;
			this._focusNode = Node;
		}
	}

	get anchorNode() {
		return this._anchorNode;
	}

	get focusNode() {
		return this._focusNode;
	}

	resetSelection(): void {
		this.anchorOffset = 0;
		this.focusOffset = 0;

		this.anchorKey = new BlockPath();
		this.focusKey = new BlockPath();

		this.anchorCharKey = 0;
		this.focusCharKey = 0;

		this._anchorNode = null;
		this._focusNode = null;

		this.anchorType = null;
		this.focusType = null;

		this.isCollapsed = false;
		this.isDirty = false;
	}

	moveSelectionToNextSibling(ContentNode: ContentNode, step?: number): void {
		let blockIndex = this.focusKey;
		let focusChar = this.focusCharKey + 1;

		let FocusBlock = ContentNode.getBlockByPath(this.focusKey.get()) as BlockType;
		let nextNode = (FocusBlock as BlockNode).CharData[focusChar] ?? undefined;

		if (nextNode === undefined) {
			while (nextNode === undefined) {
				blockIndex.incrementLastPathIndex(1);
				ContentNode.getBlockByPath(this.focusKey.get());
				if (FocusBlock === undefined) break;
				else if (FocusBlock.getType() === STANDART_BLOCK_TYPE) {
					nextNode = (FocusBlock as BlockNode).CharData[0];
					focusChar = 0;
					break;
				}
			}
		}
		if (nextNode !== undefined) {
			let anchorOffset = step !== undefined ? (nextNode.returnContentLength() < step ? nextNode.returnContentLength() : step) : 0;

			this.anchorKey = blockIndex;
			this.focusKey = blockIndex;

			this._anchorNode = focusChar;
			this._focusNode = focusChar;

			this.anchorOffset = anchorOffset;
			this.focusOffset = anchorOffset;

			this.anchorCharKey = focusChar;
			this.focusCharKey = focusChar;

			this.anchorType = nextNode.returnType();
			this.focusType = nextNode.returnType();

			this.isDirty = true;
		}
	}

	moveSelectionToPreviousSibling(ContentNode: ContentNode): void {
		let blockIndex = this.anchorKey;
		let acnhorChar = this.anchorCharKey - 1;

		let anchorBlock = ContentNode.getBlockByPath(blockIndex.get());
		let nextNode = acnhorChar > -1 ? (anchorBlock as BlockNode).CharData[acnhorChar] : undefined;

		if (nextNode === undefined) {
			while (nextNode === undefined) {
				blockIndex.decrementLastPathIndex(1);
				ContentNode.getBlockByPath(this.anchorKey.get());
				if (anchorBlock === undefined) break;
				if (anchorBlock.getType() === STANDART_BLOCK_TYPE) {
					nextNode = (anchorBlock as BlockNode).CharData[(anchorBlock as BlockNode).lastNodeIndex()];
					acnhorChar = (anchorBlock as BlockNode).lastNodeIndex();
					break;
				}
			}
		}
		if (nextNode !== undefined) {
			this.anchorKey = blockIndex;
			this.focusKey = blockIndex;

			this._anchorNode = acnhorChar;
			this._focusNode = acnhorChar;

			this.anchorOffset = nextNode.returnContentLength();
			this.focusOffset = nextNode.returnContentLength();

			this.anchorCharKey = acnhorChar;
			this.focusCharKey = acnhorChar;

			this.anchorType = nextNode.returnType() !== 'text' ? 'element' : 'text';
			this.focusType = this.anchorType;

			this.isDirty = true;
		}
	}

	pathIsEqual(): boolean {
		let focusKeyArr = this.focusKey.get();
		let anchorKeyArr = this.anchorKey.get();
		for (let i = 0; i < this.anchorKey.length(); i++) {
			if (anchorKeyArr[i] !== focusKeyArr[i]) return false;
		}
		return true;
	}

	moveSelectionForward(): void {
		this.anchorOffset += 1;
		this.focusOffset += 1;
	}

	moveSelectionBack(): void {
		this.anchorOffset -= 1;
		this.focusOffset -= 1;
	}

	convertBreakLineToText(): void {
		this.isDirty = true;
		this.anchorNode = this.anchorCharKey;
		this.focusNode = this.anchorCharKey;

		this.anchorType = TEXT_NODE_TYPE;
		this.focusType = TEXT_NODE_TYPE;
	}

	isFullBlockSelected(): boolean {
		if (
			(this.anchorCharKey === 0 || this.anchorCharKey === -1) &&
			this.anchorOffset === 0 &&
			this.anchorKey !== this.focusKey &&
			(this.focusCharKey === 0 || this.focusCharKey === -1) &&
			this.focusOffset === 0
		)
			return true;
		else return false;
	}

	toggleCollapse(focus: boolean = false): void {
		this.isCollapsed = true;
		if (focus === true) {
			this.anchorOffset = this.focusOffset;
			this.anchorNode = this.focusNode;
			this.anchorCharKey = this.focusCharKey;
			this.anchorType = this.focusType;
			this.anchorKey = this.focusKey;
		} else {
			this.focusType = this.anchorType;
			this.focusKey = this.anchorKey;
			this.focusOffset = this.anchorOffset;
			this.focusNode = this.anchorNode;
			this.focusCharKey = this.anchorCharKey;
		}
	}

	$getNodeType(node: Node | HTMLElement): string | null {
		let type = null;

		while (node.firstChild !== null) {
			node = node.firstChild;
		}
		if (node.nodeType === TEXT_NODE || node.nodeName === BREAK_LINE_TYPE) {
			type = TEXT_NODE_TYPE;
		} else if (node.nodeType === 1) {
			type = ELEMENT_NODE_TYPE;
		}
		return type;
	}

	selectionIsBackward(sel: Selection) {
		let pos = sel?.anchorNode?.compareDocumentPosition(sel.focusNode as HTMLElement);
		if ((!pos && sel.anchorOffset > sel.focusOffset) || pos === Node.DOCUMENT_POSITION_PRECEDING) return true;
		return false;
	}

	__reverseBackwardSelection() {
		let selectionCopy = {...this};

		this.focusNode = selectionCopy.anchorNode;
		this.anchorNode = selectionCopy.focusNode;

		this.focusNode = selectionCopy.anchorOffset;
		this.anchorNode = selectionCopy.focusOffset;

		this.focusCharKey = selectionCopy.anchorCharKey;
		this.anchorCharKey = selectionCopy.focusCharKey;

		this.focusKey = selectionCopy.anchorKey;
		this.anchorKey = selectionCopy.focusKey;

		this.focusType = selectionCopy.anchorType;
		this.anchorType = selectionCopy.focusType;
	}

	__getBlockNode<S>(node: Node, returnCharKey?: S extends boolean ? boolean : undefined): S extends boolean ? blockNodeDataExtended : blockNodeData;
	__getBlockNode(node: Node, returnCharKey?: boolean | undefined): blockNodeDataExtended | blockNodeData {
		let currentBlockData = findEditorFullPathToCharNode(node as HTMLElement);
		if (returnCharKey === true && currentBlockData !== undefined) {
			let ElementType = null;
			let charIndex = currentBlockData.charIndex ?? -1;

			if (node?.firstChild?.nodeName === BREAK_LINE) {
				ElementType = BREAK_LINE_TYPE;
				charIndex = 0;
			} else {
				ElementType = this.$getNodeType(node);
			}

			let Result: blockNodeDataExtended = {
				blockNode: currentBlockData.blockNode as HTMLElement,
				index: currentBlockData.blockPath,
				elementType: ElementType,
				charKey: charIndex,
			};
			return Result;
		} else if (returnCharKey === undefined && currentBlockData !== undefined) {
			let Result: blockNodeData = {
				blockNode: currentBlockData.blockNode as HTMLElement,
				elementType: this.$getNodeType(node),
				index: currentBlockData.blockPath,
			};
			return Result;
		} else throw new Error(`Not returned return value during condition check`);
	}

	$normailizeDirtySelection(EditorRef: React.MutableRefObject<HTMLDivElement>): void {
		let EditorNode: HTMLDivElement = EditorRef.current;
		let EditorNodes = Array.from(EditorNode.children);

		function __getCharNode(path: BlockPath, currentNode: HTMLElement): HTMLElement | undefined {
			let currentBlock: HTMLElement | undefined;
			let pathArray = path.get();
			for (let i = 1; i < path.length(); i++) {
				let childrens = Array.from(currentNode.children);
				let nextNode = childrens[pathArray[i]] as HTMLElement;
				let nextChildrenDataset = nextNode?.dataset;
				if (
					i === path.length() - 1 &&
					(currentNode?.dataset?.aite_block_node === undefined || currentNode?.dataset?.aite_block_content_node !== undefined)
				) {
					currentBlock = childrens.find((node) => {
						if ((node as HTMLElement).dataset.aite_block_node !== undefined || (node as HTMLElement).dataset.aite_block_content_node !== undefined)
							return true;
						return false;
					}) as HTMLElement;
					if (currentBlock !== undefined) {
						return (currentBlock = Array.from(currentBlock.children)[pathArray[i]] as HTMLElement);
					}
				} else if (nextChildrenDataset?.aite_block_node !== undefined || nextChildrenDataset?.aite_block_content_node !== undefined) {
					currentNode = childrens[pathArray[i]] as HTMLElement;
				} else {
					if (nextNode.children.length === 0) {
						currentNode = childrens.find((node) => {
							if (
								(node as HTMLElement).dataset.aite_block_node !== undefined ||
								(node as HTMLElement).dataset.aite_block_content_node !== undefined
							)
								return true;
							return false;
						}) as HTMLElement;
						currentNode = Array.from(currentNode.children)[pathArray[i]] as HTMLElement;
					} else currentNode = childrens[pathArray[i]] as HTMLElement;
				}
			}
			return currentBlock;
		}

		let anchorNodeBlock = undefined,
			focusNodeBlock = undefined;

		if (this.anchorKey.length() === 1) anchorNodeBlock = EditorNodes[this.anchorKey.get()[0]];
		else anchorNodeBlock = __getCharNode(this.anchorKey, EditorNodes[this.anchorKey.get()[0]] as HTMLElement);

		if (this.anchorKey.length() === 1) focusNodeBlock = EditorNodes[this.focusKey.get()[0]];
		else focusNodeBlock = __getCharNode(this.focusKey, EditorNodes[this.focusKey.get()[0]] as HTMLElement);

		let anchorNode = undefined;
		let focusNode = undefined;

		if (anchorNodeBlock !== undefined) anchorNode = Array.from(anchorNodeBlock.children)[this.anchorCharKey] as HTMLElement;
		if (focusNodeBlock !== undefined) focusNode = Array.from(focusNodeBlock.children)[this.focusCharKey] as HTMLElement;

		if (anchorNode !== undefined && focusNode !== undefined) {
			if (anchorNode?.firstChild?.nodeType !== TEXT_NODE) this.anchorNode = anchorNode;
			else this.anchorNode = anchorNode.firstChild;

			if (focusNode?.firstChild?.nodeType !== TEXT_NODE) this.focusNode = anchorNode;
			else this.focusNode = anchorNode.firstChild;
			this.isDirty = false;
		}
	}

	$getCountToBlock(nodeIndex: number, BlockNode: Array<Node>): number {
		let SlicedBlockNodes = BlockNode.slice(0, nodeIndex + 1);
		let LetterCount = 0;
		SlicedBlockNodes.forEach((node: Node) => {
			LetterCount += node.textContent?.length ?? 0;
		});
		return LetterCount;
	}
	$getCaretPosition(forceRange?: Range | undefined): void {
		let selection = window.getSelection();
		if (selection !== null) {
			if (selection.anchorNode === null) return;

			let range = forceRange ?? selection.getRangeAt(0);

			let isCollapsed = selection.isCollapsed;
			this.isCollapsed = isCollapsed;
			let isBackward = this.selectionIsBackward(selection);

			let anchorTextNode = range.startContainer;
			let focusTextNode = range.endContainer;

			let anchorBlockNode = this.__getBlockNode<boolean>(anchorTextNode, true);

			if (anchorBlockNode.blockNode !== null) {
				this.anchorNode = anchorTextNode;
				this.anchorType = anchorBlockNode.elementType;
				this.anchorCharKey = anchorBlockNode.charKey;
				this.anchorKey.set(anchorBlockNode.index);

				this.anchorOffset = isBackward ? selection.focusOffset : selection.anchorOffset;

				if (isCollapsed) this.toggleCollapse();
			}

			if (!isCollapsed) {
				let focusBlockNode = this.__getBlockNode<boolean>(focusTextNode, true);

				this._focusNode = focusTextNode;
				this.focusType = focusBlockNode.elementType;
				this.focusCharKey = focusBlockNode.charKey;
				this.focusKey.set(focusBlockNode.index);

				this.focusOffset = isBackward ? selection.anchorOffset : selection.focusOffset;

				if (anchorBlockNode.index.length !== focusBlockNode.index.length) {
					this.toggleCollapse();
					this.focusOffset = (this.focusNode as HTMLElement).textContent?.length ?? this.focusOffset;
				}
			}
		}
	}
	setCaretPosition(): void {
		let selection = window.getSelection();

		if (selection && this.anchorNode !== null && this.focusNode !== null && this.isDirty === false) {
			let range = document.createRange();

			if (this.anchorType === TEXT_NODE_TYPE) {
				let anchorNodeText = (this.anchorNode as Node).textContent;
				if (anchorNodeText !== null) {
					if (this.anchorOffset > anchorNodeText.length) {
						this.anchorOffset = anchorNodeText.length;
					}
					range.setStart(this.anchorNode as Node, this.anchorOffset);
				}
			} else if (this.anchorType === ELEMENT_NODE_TYPE || this.anchorType === BREAK_LINE_TYPE) {
				range.setStart(this.anchorNode as HTMLElement as Node, this.anchorOffset);
			}

			if (this.focusType === TEXT_NODE_TYPE) {
				let focusNodeText = (this.focusNode as Node).textContent;
				if (focusNodeText !== null) {
					if (this.focusOffset > focusNodeText.length) {
						this.focusOffset = focusNodeText.length;
					}
					range.setEnd(this.focusNode as Node, this.focusOffset);
				}
			} else if (this.focusType === ELEMENT_NODE_TYPE || this.anchorType === BREAK_LINE_TYPE) {
				range.setEnd(this.focusNode as HTMLElement as Node, this.focusOffset);
			}

			selection.removeAllRanges();
			selection.addRange(range);
		}
	}
}
