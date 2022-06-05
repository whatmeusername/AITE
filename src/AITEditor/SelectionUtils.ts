import {ClassVariables} from './Interfaces';
import {HTML_TEXT_NODE, BREAK_LINE_TAGNAME, BREAK_LINE_TYPE, ELEMENT_NODE_TYPE, TEXT_NODE_TYPE, STANDART_BLOCK_TYPE} from './ConstVariables';
import {getChildrenNodes, isDefined} from './EditorUtils';

import ContentNode from './ContentNode';
import type {BlockType} from './BlockNode';
import BlockNode from './BlockNode';

import {getEditorState} from './EditorState'

import {AiteHTMLNode} from './AITEreconciliation'

interface blockNodeDataExtended {
	node: HTMLElement | Node;
	nodePath: Array<number>;
	elementType: string | null;
}

export interface selectionData {
	charNode: HTMLElement;
	nodePath: Array<number>;
}


interface insertSelection extends Omit<ClassVariables<SelectionState>, 'anchorPath' | 'focusPath'>{
	anchorPath: Array<number>;
	focusPath: Array<number>;
}


export class BlockPath {
	path: Array<number>;

	constructor(path?: Array<number>) {
		this.path = path ?? [];
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
		else if(this.length() === 1) {
			return []
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

	anchorPath: BlockPath;
	focusPath: BlockPath;

	anchorNodeKey: number;
	focusNodeKey: number;

	_anchorNode: Node | number | null;
	_focusNode: Node | number | null;

	anchorType: string | null;
	focusType: string | null;

	isCollapsed: boolean;
	isDirty: boolean;

	constructor() {
		this.anchorOffset = 0;
		this.focusOffset = 0;

		this.anchorPath = new BlockPath();
		this.focusPath = new BlockPath();

		this.anchorNodeKey = 0; // TODO: MEGRGE WITH PATH
		this.focusNodeKey = 0; // TODO: MEGRGE WITH PATH

		this._anchorNode = null; // DEPRECATED / MAYBE CAN BE USED TO SPEEDUP PERFMONCE
		this._focusNode = null; // DEPRECATED / MAYBE CAN BE USED TO SPEEDUP PERFMONCE

		this.anchorType = null;
		this.focusType = null;

		this.isCollapsed = false;
		this.isDirty = false; // DEPRECATED / RANGE USING HTML FRAGMENT TO FIND NODES
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


	// DEPRECATED / TODO
	isNodesSame(): boolean {
		return this.focusNodeKey === this.anchorNodeKey
	}

	/**
	 * Проверяет навраления каретки на backward
	 * @returns boolean - возращает ответ от условия
	 */
	isSelectionBackward(sel: Selection) {
		let pos = sel?.anchorNode?.compareDocumentPosition(sel.focusNode as HTMLElement);
		if ((!pos && sel.anchorOffset > sel.focusOffset) || pos === Node.DOCUMENT_POSITION_PRECEDING) return true;
		return false;
	}

	/**
	 * Проверяет якорь ли фокус каретки в начале
	 * @returns boolean - возращает ответ от условия
	 */
	isAnchorOnStart(): boolean {
		return this.anchorNodeKey === 0 && this.anchorOffset === 0
	}

	/**
	 * Проверяет стоит ли фокус каретки в начале
	 * @returns boolean - возращает ответ от условия
	 */
	isFocusOnStart(): boolean {
		return this.focusNodeKey === 0 && this.focusOffset === 0
	}

	
	/**
	 * Проверяет стоит ли якори и фокус  каретки в начале
	 * @returns boolean - возращает ответ от условия
	 */
	isOffsetOnStart(): boolean {
		return (
			this.anchorNodeKey === 0 && 
			this.anchorOffset === 0 &&
			this.focusNodeKey === 0 && 
			this.focusOffset === 0
		)
	}

	// DEPRECATED / DONT USED
	isFullBlockSelected(): boolean {
		if (
			(this.anchorNodeKey === 0 || this.anchorNodeKey === -1) &&
			this.anchorOffset === 0 &&
			this.focusPath.getLastIndex() === this.anchorPath.getLastIndex() + 1 &&
			(this.focusNodeKey === 0 || this.focusNodeKey === -1) &&
			this.focusOffset === 0
		)
			return true;
		else return false;
	}

	// DEPRECATED / TODO: REMOVE
	enableDirty(): SelectionState{
		this.isDirty = true;
		return this
	}

	/**
	 * Обнуляет полностью весь SelectionState
	 * @returns SelectionState - собственный возрат
	 */
	resetSelection(): SelectionState {
		this.anchorOffset = 0;
		this.focusOffset = 0;

		this.anchorPath = new BlockPath();
		this.focusPath = new BlockPath();

		this.anchorNodeKey = 0;
		this.focusNodeKey = 0;

		this._anchorNode = null;
		this._focusNode = null;

		this.anchorType = null;
		this.focusType = null;

		this.isCollapsed = false;
		this.isDirty = false;
		return this;
	}
	/**
	 * Обнуляет позицию каретки в блоке до начала
	 * @returns SelectionState - собственный возрат
	 */
	offsetToZero(): SelectionState{
		this.anchorOffset = 0;
		this.focusOffset = 0;
		this.anchorNodeKey = 0;
		this.focusNodeKey = 0;
		return this
	}

	/**
	 * Выстраивает путь до узла соблюдая объектную структуру редактора 
	 * @param  {AiteHTMLNode} node  - узел для нахождения пути
	 * @returns selectionData - собственный возрат
	 */
	getPathToNodeByNode(node: AiteHTMLNode): selectionData | undefined{

		if(node.$$isAiteNode === true){
			node = node.firstChild ? (node.firstChild as AiteHTMLNode) : node;

			if(node instanceof Text){
				node = node.parentNode as AiteHTMLNode;
			}
		
			let data: selectionData = {
				charNode: node,
				nodePath: [],
			};


			while(node !== undefined) {
				let parentNode = node.parentNode as AiteHTMLNode
				if(parentNode?.dataset?.aite_editor_root !== undefined){
					let nodeIndex = Array.from(parentNode.children).indexOf(node);
					data.nodePath.unshift(nodeIndex)
					return data
				}
				if(parentNode.$$isAiteWrapper === false){
					if(node.dataset.aite_content_node === undefined){
						let nodeIndex = Array.from(parentNode.children).indexOf(node);
						data.nodePath.unshift(nodeIndex)
					}
					if(parentNode?.dataset?.aite_editor_root !== undefined){
						return data
					}
				}
				node = parentNode
			}	
		}
		return undefined
	}

	/**
	 * Сдвигает позицию каретки на следущией узел или блок
	 * @param  {ContentNode} ContentNode - ContentNode в котором будет искаться узла
	 * @param  {number} step - оступ для от начала узла
	 * @returns SelectionState - собственный возрат
	 */
	moveSelectionToNextSibling(ContentNode: ContentNode, step?: number): SelectionState {
		let blockIndex = this.focusPath;
		let focusChar = this.focusNodeKey + 1;

		let FocusBlock = ContentNode.getBlockByPath(this.focusPath.get()) as BlockType;
		let nextNode = (FocusBlock as BlockNode).NodeData[focusChar] ?? undefined;

		if (nextNode === undefined) {
			while (nextNode === undefined) {
				blockIndex.incrementLastPathIndex(1);
				FocusBlock = ContentNode.getBlockByPath(this.focusPath.get());
				if (FocusBlock === undefined) break;
				else if (FocusBlock.getType() === STANDART_BLOCK_TYPE) {
					nextNode = (FocusBlock as BlockNode).NodeData[0];
					focusChar = 0;
					break;
				}
			}
		}
		if (nextNode !== undefined) {
			let anchorOffset = step !== undefined ? (nextNode.returnContentLength() < step ? nextNode.returnContentLength() : step) : 0;

			this.anchorPath = blockIndex;
			this.focusPath = blockIndex;

			this._anchorNode = focusChar;
			this._focusNode = focusChar;

			this.anchorOffset = anchorOffset;
			this.focusOffset = anchorOffset;

			this.anchorNodeKey = focusChar;
			this.focusNodeKey = focusChar;

			this.anchorType = nextNode.returnType();
			this.focusType = nextNode.returnType();

			this.isDirty = true;
		}
		return this
	}


	/**
	 * Сдвигает позицию каретки на предыдущий блок
	 * @param  {ContentNode} ContentNode - ContentNode в котором будет искаться узла
	 * @returns SelectionState - собственный возрат
	 */
	moveSelectionToPreviousBlock(ContentNode: ContentNode): SelectionState{
		this.anchorPath.decrementLastPathIndex(1)
		let anchorBlock = ContentNode.getBlockByPath(this.anchorPath.get());

		let lastNode;
		let lastNodeIndex: number | undefined

		if(anchorBlock instanceof BlockNode){
			lastNode = anchorBlock.getNodeByIndex(anchorBlock.lastNodeIndex())
			lastNodeIndex = anchorBlock.lastNodeIndex();
		}
		else{
			while(anchorBlock !== undefined){
				this.anchorPath.decrementLastPathIndex(1)
				anchorBlock = ContentNode.getBlockByPath(this.anchorPath.get());
				if(anchorBlock instanceof BlockNode){
					lastNode = anchorBlock.getNodeByIndex(anchorBlock.lastNodeIndex())
					lastNodeIndex = anchorBlock.lastNodeIndex();
				}
			}
		}
		if(lastNode && isDefined(lastNodeIndex)){

			this.anchorOffset = lastNode.returnContentLength();
			this.focusOffset = lastNode.returnContentLength();

			this.anchorNodeKey = lastNodeIndex ?? 0;
			this.focusNodeKey = lastNodeIndex ?? 0;

			this.anchorType = lastNode.returnType() !== 'text' ? 'element' : 'text';
			this.focusType = this.anchorType;

			this.isDirty = true;
		}
		return this
	}

	/**
	 * Сдвигает позицию каретки на следущией блок
	 * @param  {ContentNode} ContentNode - ContentNode в котором будет искаться узла
	 * @returns SelectionState - собственный возрат
	 */
	moveSelectionToNextBlock(ContentNode: ContentNode): SelectionState{
		this.anchorPath.decrementLastPathIndex(1)
		let anchorBlock = ContentNode.getBlockByPath(this.anchorPath.get());

		let firstNode;

		if(anchorBlock instanceof BlockNode){
			firstNode = anchorBlock.getNodeByIndex(0)
		}
		else{
			while(anchorBlock !== undefined){
				this.anchorPath.decrementLastPathIndex(1)
				anchorBlock = ContentNode.getBlockByPath(this.anchorPath.get());
				if(anchorBlock instanceof BlockNode){
					firstNode = anchorBlock.getNodeByIndex(0)
				}
			}
		}
		if(firstNode){

			this.anchorOffset = 0
			this.focusOffset = 0

			this.anchorNodeKey = 0;
			this.focusNodeKey = 0;

			this.anchorType = firstNode.returnType() !== 'text' ? 'element' : 'text';
			this.focusType = this.anchorType;

			this.isDirty = true;
		}
		return this
	}

	
	/**
	 * Сдвигает позицию каретки на предыдущий узел или блок
	 * @param  {ContentNode} ContentNode - ContentNode в котором будет искаться узла
	 * @returns SelectionState - собственный возрат
	 */
	moveSelectionToPreviousSibling(ContentNode: ContentNode): SelectionState {
		let blockIndex = this.anchorPath;
		let acnhorChar = this.anchorNodeKey - 1;

		let anchorBlock = ContentNode.getBlockByPath(blockIndex.get());
		let nextNode = acnhorChar > -1 ? (anchorBlock as BlockNode).NodeData[acnhorChar] : undefined;

		if (nextNode === undefined) {
			while (nextNode === undefined) {
				blockIndex.decrementLastPathIndex(1);
				ContentNode.getBlockByPath(this.anchorPath.get());
				if (anchorBlock === undefined) break;
				if (anchorBlock.getType() === STANDART_BLOCK_TYPE) {
					nextNode = (anchorBlock as BlockNode).NodeData[(anchorBlock as BlockNode).lastNodeIndex()];
					acnhorChar = (anchorBlock as BlockNode).lastNodeIndex();
					break;
				}
			}
		}

		if (nextNode !== undefined) {
			this.anchorPath = blockIndex;
			this.focusPath = blockIndex;

			this._anchorNode = acnhorChar;
			this._focusNode = acnhorChar;

			this.anchorOffset = nextNode.returnContentLength();
			this.focusOffset = nextNode.returnContentLength();

			this.anchorNodeKey = acnhorChar;
			this.focusNodeKey = acnhorChar;

			this.anchorType = nextNode.returnType() !== 'text' ? 'element' : 'text';
			this.focusType = this.anchorType;

			this.isDirty = true;
		}
		return this
	}

	/**
	 * Двигает offset каретки на один
	 * @returns SelectionState - собственный возрат
	 */
	moveSelectionForward(): SelectionState {
		this.anchorOffset += 1;
		this.focusOffset += 1;
		return this
	}

	/**
	 * Сдвигает offset каретки на один
	 * @returns SelectionState - собственный возрат
	 */
	moveSelectionBackward(): SelectionState {
		this.anchorOffset -= 1;
		this.focusOffset -= 1;
		return this
	}

	/**
	 * Проверяет ли одинаковые пути фокуса и якоря
	 * @returns SelectionState - собственный возрат
	 */
	isBlockPathEqual(): boolean {
		let focusPathArr = this.focusPath.get();
		let anchorPathArr = this.anchorPath.get();
		for (let i = 0; i < this.anchorPath.length(); i++) {
			if (anchorPathArr[i] !== focusPathArr[i]) return false;
		}
		return true;
	}

	getTextNode(node: HTMLElement): {isTextNode: boolean, TextNode: undefined | HTMLElement} {
		let childrenNode: HTMLElement | undefined = node;
		let data: {isTextNode: boolean, TextNode: undefined | HTMLElement} = {isTextNode: false, TextNode: undefined}
		while(childrenNode !== undefined) {
			if(childrenNode?.nodeType === HTML_TEXT_NODE || childrenNode?.tagName === BREAK_LINE_TAGNAME){
				data.isTextNode = true
				data.TextNode = childrenNode
				return data
			}
			else childrenNode = childrenNode?.firstChild as HTMLElement
			if(childrenNode === undefined) break
		}
		return data
	}

	/**
	 * Установавливает collapse каретки
	 * @param  {boolean=false} focus - установить collapse каретки по фокусу
	 * @returns SelectionState - собственный возрат
	 */
	toggleCollapse(focus: boolean = false): SelectionState {
		this.isCollapsed = true;
		if (focus === true) {
			this.anchorOffset = this.focusOffset;
			this.anchorNode = this.focusNode;
			this.anchorNodeKey = this.focusNodeKey;
			this.anchorType = this.focusType;
			this.anchorPath = this.focusPath;
		} else {
			this.focusType = this.anchorType;
			this.focusPath = this.anchorPath;
			this.focusOffset = this.anchorOffset;
			this.focusNode = this.anchorNode;
			this.focusNodeKey = this.anchorNodeKey;
		}
		return this
	}

	/**
	 * Определяет тип узла
	 * @param  {Node|HTMLElement|AiteHTMLNode} node - узел тип которого надо определить
	 * @returns string - возращает текущей тип узла
	 */
	$getNodeType(node: Node | HTMLElement | AiteHTMLNode): string | null {

		if(node.nodeName === BREAK_LINE_TAGNAME) return BREAK_LINE_TYPE;
		else if(node.nodeType === HTML_TEXT_NODE) return TEXT_NODE_TYPE
		else{
			while (node.firstChild !== null) {
				node = node.firstChild;
			}

			if (node.nodeType === HTML_TEXT_NODE || node.nodeName === BREAK_LINE_TYPE) return TEXT_NODE_TYPE;
			else if(node.nodeName === BREAK_LINE_TAGNAME) return BREAK_LINE_TYPE;
			else if (node.nodeType === 1) return ELEMENT_NODE_TYPE;

			return null
		}
	}

	/**
	 * Разварачивает направление каретки с backwarf на forward
	 * @returns void
	 */
	__reverseBackwardSelection(): void {
		let selectionCopy = {...this};

		this.focusNode = selectionCopy.anchorNode; 
		this.anchorNode = selectionCopy.focusNode;

		this.focusNode = selectionCopy.anchorOffset;
		this.anchorNode = selectionCopy.focusOffset;

		this.focusNodeKey = selectionCopy.anchorNodeKey;
		this.anchorNodeKey = selectionCopy.focusNodeKey;

		this.focusPath = selectionCopy.anchorPath;
		this.anchorPath = selectionCopy.focusPath;

		this.focusType = selectionCopy.anchorType;
		this.anchorType = selectionCopy.focusType;
	}

	/**
	 * Получает текущее данные по выбранному узлу
	 * @param  {Node} node - узел по которому надо получить данные
	 * @returns blockNodeDataExtended - возращает путь, тип и сам узел
	 */
	__getBlockNode(node: Node): blockNodeDataExtended {
		let currentBlockData = this.getPathToNodeByNode(node as AiteHTMLNode);
		if (currentBlockData !== undefined) {
			let ElementType = null;
			if (node?.firstChild?.nodeName === BREAK_LINE_TAGNAME) {
				ElementType = BREAK_LINE_TYPE;
			} else {
				ElementType = this.$getNodeType(node);
			}

			let Result: blockNodeDataExtended = {
				node: currentBlockData.charNode as AiteHTMLNode,
				nodePath: currentBlockData.nodePath,
				elementType: ElementType,
			};
			return Result;
			// TODO: REPLACE WITH onError METHOD
		} else throw new Error(`Not returned return value during condition check`);
	}

	// DEPRECATED / TODO: TO REMOVE
	$normailizeDirtySelection(EditorRef: React.MutableRefObject<HTMLDivElement>): void {
		let EditorNode: HTMLDivElement = EditorRef.current;
		let EditorNodes = getChildrenNodes(EditorNode);


		function __getCharNode(path: BlockPath, currentNode: HTMLElement): HTMLElement | undefined {
			let currentBlock: HTMLElement | undefined;
			let pathArray = path.get();

			for (let i = 1; i < path.length(); i++) {
				let childrens = getChildrenNodes(currentNode);
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
						return (currentBlock = getChildrenNodes(currentBlock)[pathArray[i]] as HTMLElement);
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
						currentNode = getChildrenNodes(currentNode)[pathArray[i]] as HTMLElement;
					} else currentNode = childrens[pathArray[i]] as HTMLElement;
				}
			}
			return currentBlock;
		}

		let anchorNodeBlock = undefined;
		let focusNodeBlock = undefined;

		if (this.anchorPath.length() === 1) anchorNodeBlock = EditorNodes[this.anchorPath.get()[0]];
		else anchorNodeBlock = __getCharNode(this.anchorPath, EditorNodes[this.anchorPath.get()[0]] as HTMLElement);

		if (this.anchorPath.length() === 1) focusNodeBlock = EditorNodes[this.focusPath.get()[0]];
		else focusNodeBlock = __getCharNode(this.focusPath, EditorNodes[this.focusPath.get()[0]] as HTMLElement);


		
		let anchorNode = undefined;
		let focusNode = undefined;

		if (anchorNodeBlock !== undefined) anchorNode = getChildrenNodes(anchorNodeBlock)[this.anchorNodeKey] as HTMLElement;
		if (focusNodeBlock !== undefined) focusNode = getChildrenNodes(focusNodeBlock)[this.focusNodeKey] as HTMLElement;

		if (anchorNode !== undefined && focusNode !== undefined) {
			let textNode = this.getTextNode(anchorNode)


			if (textNode.isTextNode) this.anchorNode = textNode.TextNode as HTMLElement;
			else this.anchorNode = anchorNode.firstChild;

			if (textNode.isTextNode) this.focusNode = textNode.TextNode as HTMLElement;
			else this.focusNode = anchorNode.firstChild;
			this.isDirty = false;
		}
	}

	
	/**
	 * Получает текущее положение каретки используя
	 * @param  {Range|undefined} forceRange - устанавливает карертку по внесенной Range
	 * @returns void
	 */
	getCaretPosition(forceRange?: Range | undefined): void {

		let selection = window.getSelection();
		if (selection !== null) {
			if (selection.anchorNode === null || selection.focusNode === null) return;

			let range = forceRange ?? selection.getRangeAt(0);

			let isCollapsed = selection.isCollapsed;
			this.isCollapsed = isCollapsed;
			let isBackward = this.isSelectionBackward(selection);

			let anchorTextNode = range.startContainer;
			let focusTextNode = range.endContainer;

			let anchorNodeData = this.__getBlockNode(anchorTextNode);

			if (anchorNodeData) {

				this.anchorNode = anchorTextNode;
				this.anchorType = anchorNodeData.elementType;
				this.anchorNodeKey = anchorNodeData.nodePath[anchorNodeData.nodePath.length - 1];
				this.anchorPath = new BlockPath(anchorNodeData.nodePath.slice(0, anchorNodeData.nodePath.length - 1));

				this.anchorOffset = isBackward ? selection.focusOffset: selection.anchorOffset;

				if (isCollapsed) this.toggleCollapse();
			}

			if (!isCollapsed) {
				let focusNodeData = this.__getBlockNode(focusTextNode);

				this._focusNode = focusTextNode;
				this.focusType = focusNodeData.elementType;
				this.focusNodeKey = focusNodeData.nodePath[focusNodeData.nodePath.length - 1];
				this.focusPath = new BlockPath(focusNodeData.nodePath.slice(0, focusNodeData.nodePath.length - 1));

				this.focusOffset = isBackward ? selection.anchorOffset: selection.focusOffset;

				if (this.anchorPath.length() !== this.focusPath.length()) {
					this.toggleCollapse();
					this.focusOffset = (this.focusNode as HTMLElement).textContent?.length ?? this.focusOffset;
				}
			}
		}
	}
	
	/**
	 * Устанавливает текущее положение каретки используя собственные данные
	 * @returns void
	 */
	setCaretPosition(): void {
		let selection = window.getSelection();

		if (selection) {
			let range = document.createRange();
			let EditorState = getEditorState()

			let anchorPath = [...this.anchorPath.get(), this.anchorNodeKey]
			let anchorNode = EditorState?.__editorDOMState.getDOMNode(anchorPath)
			if(anchorNode === undefined) return;
			let anchorType = this.$getNodeType(anchorNode)

			let focusNode
			let focusType
			

			if(this.isCollapsed){
				focusNode = anchorNode
			}
			else{
				let focusPath = [...this.focusPath.get(), this.focusNodeKey]
				focusNode = EditorState?.__editorDOMState.getDOMNode(focusPath)
				if(focusNode === undefined) return;
				focusType = this.$getNodeType(focusNode)
			}



			if (anchorType === TEXT_NODE_TYPE) {
				let anchorNodeText = (anchorNode as Node).textContent;
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
				let focusNodeText = (focusNode as Node).textContent;
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
	 * Ручное внесение данных для каретки
	 * @param  {insertSelection} SelectionData - все доступные параметры каретки 
	 * @returns void
	 */
	insertSelection(SelectionData: insertSelection): void{

		if(SelectionData.anchorOffset && typeof SelectionData.anchorOffset === 'number') this.anchorOffset = SelectionData.anchorOffset < this.anchorOffset ? 0 : SelectionData.anchorOffset
		if(SelectionData.focusOffset && typeof SelectionData.anchorOffset === 'number') this.focusOffset = SelectionData.focusOffset < this.anchorOffset ? 0 : SelectionData.focusOffset
		
		if(SelectionData.anchorPath && Array.isArray(SelectionData.anchorPath) && !SelectionData.anchorPath.some(isNaN)) this.anchorPath.set(SelectionData.anchorPath)
		if(SelectionData.focusPath && Array.isArray(SelectionData.focusPath) && !SelectionData.focusPath.some(isNaN)) this.focusPath.set(SelectionData.focusPath)

		if(SelectionData.anchorNodeKey && typeof SelectionData.anchorNodeKey === 'number') this.anchorNodeKey = SelectionData.anchorNodeKey < this.anchorNodeKey ? 0 : SelectionData.anchorNodeKey
		if(SelectionData.focusNodeKey && typeof SelectionData.focusNodeKey === 'number') this.focusNodeKey = SelectionData.focusNodeKey < this.focusNodeKey ? 0 : SelectionData.focusNodeKey

		if(SelectionData.anchorType && (SelectionData.anchorType === 'text' || SelectionData.anchorType === 'element')) this.anchorType = SelectionData.anchorType
		if(SelectionData.focusType && (SelectionData.focusType === 'text' || SelectionData.focusType === 'element')) this.focusType = SelectionData.focusType

		this.isCollapsed = SelectionData.isCollapsed ?? this.isCollapsed;
		this.isDirty = SelectionData.isDirty ?? this.isDirty;
	}
}
