import defaultBlocks from './defaultStyles/defaultBlocks';
import React from 'react';
import {TEXT_NODE_TYPE, STANDART_BLOCK_TYPE, HORIZONTAL_RULE_BLOCK_TYPE, LINK_NODE_TYPE} from './ConstVariables';
import type {imageNode} from './packages/AITE_Image/imageNode';
import {SelectionState} from './SelectionUtils';
import {ClassVariables} from './Interfaces';
import {TextNode, DOMattr, LinkNode} from './AITE_nodes/index'

export type NodeTypes = TextNode | imageNode;
export type BlockNodeData = Array<NodeTypes>;
export type BlockTypes = typeof STANDART_BLOCK_TYPE | typeof HORIZONTAL_RULE_BLOCK_TYPE;
export type BlockType = BlockNode | HorizontalRuleNode;

type ContentNodeVariables = ClassVariables<BlockNode>;
interface findNodeOffsetData {
	offsetKey: number;
	letterIndex: number;
}

type allowedToInsert = 'all' | 'element' | 'text';

export default class BlockNode {
	blockType: BlockTypes;
	plainText: string;
	blockWrapper: string;
	blockInlineStyles: Array<string>;
	NodeData: BlockNodeData;
	allowedToInsert: allowedToInsert | 'all';

	constructor(initData?: ContentNodeVariables) {
		this.blockType = initData?.blockType ?? STANDART_BLOCK_TYPE;
		this.plainText = initData?.plainText ?? '';
		this.blockWrapper = initData?.blockWrapper ?? 'unstyled';
		this.blockInlineStyles = initData?.blockInlineStyles ?? [];
		this.NodeData = initData?.NodeData ?? [];
		this.allowedToInsert = initData?.allowedToInsert ?? 'all';
	}


	isBreakLine(){
		if(
			this.NodeData.length === 1 &&
			this.NodeData[0].returnContent() === '' &&
			this.NodeData[0].returnType() === TEXT_NODE_TYPE
			) return true
		return false
	}

	prepareBlockStyle(): {n: string; c: null | string} {
		type data = {n: string; c: null | string};
		let BlockNodeData: data = {n: 'div', c: this.blockInlineStyles.join(' ')};
		let blockWrapper = defaultBlocks.find((obj) => obj.type === this.blockWrapper);
		if (blockWrapper !== undefined) {
			BlockNodeData.n = blockWrapper.tag;
			BlockNodeData.c += blockWrapper.class ? BlockNodeData.c + ' ' + blockWrapper.class : '';
		}
		return BlockNodeData;
	}

	swapCharPosition(FirPosition: number, SecPosition: number): void {
		let CharP1 = this.NodeData[FirPosition];
		this.NodeData[FirPosition] = this.NodeData[SecPosition];
		this.NodeData[SecPosition] = CharP1;
	}

	FullSelected(selectionState: SelectionState): boolean {
		if (
			selectionState.anchorNodeKey === 0 &&
			selectionState.anchorOffset === 0 &&
			selectionState.focusNodeKey === this.lastNodeIndex() &&
			selectionState.focusOffset === this.NodeData[this.lastNodeIndex()].returnContentLength()
		)
			return true;
		return false;
	}

	returnBlockLength(): number {
		return this.NodeData.length;
	}
	replaceNode(index: number, newNode: NodeTypes): void {
		this.NodeData[index] = newNode;
	}

	removeCharNode(indexChar: number): void {
		this.NodeData.splice(indexChar, 1);
	}

	bulkRemoveCharNode(startFromZero: boolean = true, start: number, end?: number): void {
		if (end === undefined) {
			if (startFromZero === false) this.NodeData = this.NodeData.slice(start);
			else if (startFromZero === true) this.NodeData = this.NodeData.slice(0, start);
		} else if (end !== undefined) {
			this.NodeData = this.NodeData.slice(start, end);
		}
	}

	splitCharNode(startFromZero: boolean = true, start: number, end?: number, node?: NodeTypes): void {
		let StartSlice = startFromZero === true ? this.NodeData.slice(0, start) : this.NodeData.slice(start);
		let EndSlice = end ? this.NodeData.slice(end) : [];
		if (node === undefined) this.NodeData = [...StartSlice, ...EndSlice];
		else this.NodeData = [...StartSlice, node, ...EndSlice];
	}

	NodeStylesEqual(C1: TextNode, C2: TextNode): boolean {

		let C1Styles = C1.returnNodeStyle()
		let C2Styles = C2.returnNodeStyle()

		let mismatch = false

		if (C1Styles.length === 0 && C2Styles.length === 0) return true;
		else if(C1Styles.length === 0 && C2Styles.length !== 0) return false;
		else {
			for (let style of C1Styles) {
				if (C2Styles.includes(style) === false) {
					mismatch = true;
				}
			}
			if(mismatch === true) return false;
			else return true;
		}
	}

	blockUpdate(): void {
		let NewData: BlockNodeData = this.NodeData;
		let previousBlockLength = NewData.length;

		const ConcatIfEqual = (NodeData: BlockNodeData): BlockNodeData => {
			let NewData: BlockNodeData = [];
			for (let CharIndex = 0; CharIndex < NodeData.length; CharIndex++) {
				let currentNode = NodeData[CharIndex] as TextNode;
				let nextNode = NodeData[CharIndex + 1] as TextNode;
				if(
					nextNode !== undefined &&
					currentNode.returnActualType() === LINK_NODE_TYPE && 
					nextNode.returnActualType() === LINK_NODE_TYPE &&
					this.NodeStylesEqual(currentNode, nextNode) &&
					(currentNode as LinkNode).getURL() === (nextNode as LinkNode).getURL()
					){
						currentNode.appendContent(nextNode.returnContent());
						NewData.push(currentNode);
						NodeData.splice(CharIndex, 1);
				}
				else if(
					nextNode !== undefined &&
					currentNode.returnActualType() === TEXT_NODE_TYPE &&
					nextNode.returnActualType() === TEXT_NODE_TYPE &&
					this.NodeStylesEqual(currentNode, nextNode)
				) {
					currentNode.appendContent(nextNode.returnContent());
					NewData.push(currentNode);
					NodeData.splice(CharIndex, 1);
				}
				else {
					NewData.push(currentNode);
				}
			}
			return NewData;
		};
		while (true) {
			NewData = ConcatIfEqual(NewData);
			if (NewData.length !== previousBlockLength) {
				previousBlockLength = NewData.length;
			} else {
				this.NodeData = NewData;
				break;
			}
		}
	}

	countToIndex(index: number): number {
		let Count = 0;
		index = index < 0 ? 1 : index

		for (let CharIndex = 0; CharIndex < this.NodeData.length; CharIndex++) {
			if (CharIndex <= index) {
				let CurrentElement = this.NodeData[CharIndex];
				Count += CurrentElement.returnContentLength();
			};
		}
		return Count;
	}

	findNodeByOffset(offset: number): findNodeOffsetData {
		let data: findNodeOffsetData = {offsetKey: 0, letterIndex: 0};
		let letterCount = 0;
		for (let i = 0; i < this.NodeData.length; i++) {
			let currentLetterCount = this.NodeData[i].returnContentLength();
			letterCount += currentLetterCount;
			if (letterCount >= offset) {
				data.offsetKey = i;
				data.letterIndex = currentLetterCount - (letterCount - offset);
				return data;
			}
		}
		return data;
	}

	lastNodeIndex(): number {
		return this.NodeData.length - 1;
	}

	nextSibling(index: number): NodeTypes | undefined {
		let nextSibling = this.NodeData[index + 1];
		if (nextSibling !== undefined) return nextSibling;
		else return undefined;
	}
	previousSibling(index: number): NodeTypes | undefined {
		let previousSibling = this.NodeData[index - 1];
		if (previousSibling !== undefined) return previousSibling;
		else return undefined;
	}

	getNodeByIndex(index: number): NodeTypes {
		return this.NodeData[index];
	}

	getType(): string {
		return this.blockType;
	}
	getWrapper(): string{
		return this.blockWrapper;
	}
	
	findCharByIndex(index: number): NodeTypes {
		return this.NodeData[index];
	}
}

export class HorizontalRuleNode {
	blockType: BlockTypes;
	blockInlineStyles: Array<[Array<string>, Array<string>]>;

	constructor() {
		this.blockType = HORIZONTAL_RULE_BLOCK_TYPE;
		this.blockInlineStyles = [];
	}

	getType() {
		return this.blockType;
	}

	createDOM(attr?: DOMattr){
		let className = 'AITE_editor_horizontal-rule';
		let HorizontalRuleElement = React.createElement('hr', {className: className}, null);
		const a = {
			key: attr?.html?.key ?? 'AITE_editor_horizontal-rule',
			contentEditable: false,
		};
		return React.createElement('div', a, HorizontalRuleElement);
	}
}
