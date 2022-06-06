import React from 'react';

import defaultBlocks from './defaultStyles/defaultBlocks';
import {TEXT_NODE_TYPE, STANDART_BLOCK_TYPE, HORIZONTAL_RULE_BLOCK_TYPE, LINK_NODE_TYPE, BREAK_LINE_TYPE} from './ConstVariables';
import {ClassVariables} from './Interfaces';

import {TextNode, DOMattr, LinkNode, BreakLine} from './AITE_nodes/index'
import type {imageNode} from './packages/AITE_Image/imageNode';

import {createAiteNode} from './index';
import type {AiteNode, AiteNodeOptions} from './index'

type NodeTypes = TextNode | imageNode | BreakLine;
type BlockNodeData = Array<NodeTypes>;
type BlockTypes = typeof STANDART_BLOCK_TYPE | typeof HORIZONTAL_RULE_BLOCK_TYPE;
type BlockType = BlockNode | HorizontalRuleNode;

type BlockNodeVariables = ClassVariables<BlockNode>
interface findNodeOffsetData {
	offsetKey: number;
	letterIndex: number;
}

type allowedToInsert = 'all' | 'element' | 'text';


function createBlockNode(initData?: BlockNodeVariables){
	initData = initData ?? {}
	if(initData === undefined || initData?.NodeData?.length === 0){
		initData.NodeData = [new BreakLine()]
	}
	return new BlockNode(initData)
}

class BaseBlockNode {
	blockType: BlockTypes;
	blockInlineStyles: Array<string>;
	__key: string | undefined;

	constructor(blockType?: BlockTypes, blockInlineStyles?: Array<string>){
		this.blockType = blockType ?? STANDART_BLOCK_TYPE
		this.blockInlineStyles = blockInlineStyles ?? []
		this.__key = undefined
	}

	$getNodeKey(){
		return this.__key
	}
}

class BlockNode extends BaseBlockNode{
	plainText: string;
	blockWrapper: string;
	NodeData: BlockNodeData;
	allowedToInsert: allowedToInsert | 'all';
	__key: string | undefined;

	constructor(initData?: BlockNodeVariables) {
		super(initData?.blockType, initData?.blockInlineStyles)
		this.plainText = initData?.plainText ?? '';
		this.blockWrapper = initData?.blockWrapper ?? 'unstyled';
		this.NodeData = initData?.NodeData ?? [];
		this.allowedToInsert = initData?.allowedToInsert ?? 'all';
		this.__key = undefined;
	}


	isBreakLine(){
		if(
			this.NodeData.length === 0 ||
			(
				this.NodeData.length === 1 &&
				(
					this.NodeData[0].returnType() === BREAK_LINE_TYPE || 
					(this.NodeData[0].returnType() === TEXT_NODE_TYPE && this.NodeData[0].returnContentLength() === 0)
				)
			)
			) return true
		return false
	}

	$updateNodeKey(){
		this.__key = `AITE_BLOCK_${this.blockWrapper}_${this.blockInlineStyles.length}_${this.NodeData.length}`
	}

	$getNodeState(options?: AiteNodeOptions): AiteNode{
		let tag = defaultBlocks.find((obj) => obj.type === this.blockWrapper)?.tag ?? 'div'
		let className = ''
		let props = {
			className: className,
			'data-aite-block-node': true
		}

		this.$updateNodeKey()
		let children: Array<AiteNode> = []
		this.NodeData.forEach((node, index) => {
			let $node = node.$getNodeState({...options})
			if($node) children.push($node)
		}
		)
		return createAiteNode(
			tag,
			props,
			children,
			{...options, key: this.$getNodeKey(), isAiteWrapper: false}
		)
	} 

	prepareBlockStyle(): {n: string; c: null | string} {
		type data = {n: string; c: string};
		let BlockNodeData: data = {n: 'div', c: this.blockInlineStyles.join(' ')};
		let blockWrapper = defaultBlocks.find((obj) => obj.type === this.blockWrapper);
		if (blockWrapper !== undefined) {
			BlockNodeData.n = blockWrapper.tag;
			BlockNodeData.c += blockWrapper.class ? BlockNodeData.c + ' ' + blockWrapper.class : '';
		}
		return BlockNodeData;
	}

	swapNodePosition(FirPosition: number, SecPosition: number): void {
		let CharP1 = this.NodeData[FirPosition];
		this.NodeData[FirPosition] = this.NodeData[SecPosition];
		this.NodeData[SecPosition] = CharP1;
	}
	
	replaceNode(index: number, newNode: NodeTypes): void {
		this.NodeData[index] = newNode;
	}

	removeNode(indexChar: number): void {
		this.NodeData.splice(indexChar, 1);
	}

	// DEPREACATED METHOD / TODO: REPLACE WITH splitNodes
	removeNodes(startFromZero: boolean = true, start: number, end?: number): void {
		if (end === undefined) {
			if (startFromZero === false) this.NodeData = this.NodeData.slice(start);
			else if (startFromZero === true) this.NodeData = this.NodeData.slice(0, start);
		} else if (end !== undefined) {
			this.NodeData = this.NodeData.slice(start, end);
		}
	}

	splitNodes(startFromZero: boolean = true, start: number, end?: number, node?: NodeTypes): void {
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

	getLength(): number {
		return this.NodeData.length;
	}
	
	findCharByIndex(index: number): NodeTypes {
		return this.NodeData[index];
	}
	
}

class HorizontalRuleNode extends BaseBlockNode{

	constructor() {
		super(HORIZONTAL_RULE_BLOCK_TYPE, [])
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

	$getNodeState(options?: AiteNodeOptions): AiteNode{
		let className = 'AITE_editor_horizontal-rule'
		let props = {
			class: className,
		}
		this.__key = `AITE_HORIZONTAL_${this.blockInlineStyles.length}`
		return createAiteNode(
			'div',
			{contenteditable: false,},
			[createAiteNode('hr', props, [])],
			{...options, key: this.__key, isAiteWrapper: false}
		)
	} 
}

export {
	createBlockNode,
	BlockNode,
	HorizontalRuleNode
}

export type{
	NodeTypes,
	BlockNodeData,
	BlockTypes,
	BlockType,
}
