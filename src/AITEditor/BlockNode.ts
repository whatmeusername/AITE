
import defaultBlocks from './defaultStyles/defaultBlocks';
import {TEXT_NODE_TYPE, STANDART_BLOCK_TYPE, HORIZONTAL_RULE_BLOCK_TYPE, BREAK_LINE_TYPE} from './ConstVariables';
import {ClassVariables} from './Interfaces';

import {TextNode, LinkNode, BreakLine, createTextNode} from './AITE_nodes/index'
import type {imageNode} from './packages/AITE_Image/imageNode';

import {createAiteNode} from './index';
import type {AiteNode, AiteNodeOptions} from './index'
import {isDefined} from './EditorUtils'

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

	$updateNodeKey(){
		this.__key = Math.random().toString(36).slice(5)
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
					this.NodeData[0].getType() === BREAK_LINE_TYPE || 
					(this.NodeData[0].getType() === TEXT_NODE_TYPE && this.NodeData[0].getContentLength() === 0)
				)
			)
			) return true
		return false
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

	removeNodeByKey(key: string): void {
		let index = this.NodeData.findIndex(node => node.__key === key);
		if(index !== -1){
			this.NodeData.splice(index, 1);
		}
	}


	insertNodeBefore(nodeIndex: number, node: NodeTypes): NodeTypes{
		node = (node as imageNode).createSelfNode((node as imageNode).getData()) as imageNode
		if(this.isBreakLine()){
			this.replaceNode(0, node)
		}
		else{
			let insertOffset = nodeIndex > 0 ? nodeIndex - 1 : nodeIndex
			this.splitNodes(true, insertOffset, insertOffset,  node)
		}
		return node
	}

	insertNodeAfter(nodeIndex: number, node: NodeTypes): NodeTypes{
		node = (node as imageNode).createSelfNode((node as imageNode).getData()) as imageNode
		if(this.isBreakLine()){
			this.replaceNode(0, node)
		}
		else{
			let insertOffset = nodeIndex + 1
			this.splitNodes(true, insertOffset, insertOffset,  node)
		}
		return node
	}

	insertNodeBetweenText(nodeIndex: number, offset: number, node: NodeTypes): NodeTypes | undefined {
		nodeIndex = nodeIndex >= 0 ? nodeIndex : 0
		let textNode = this.NodeData[nodeIndex]
		if(textNode instanceof TextNode && !(node instanceof BreakLine)){
			let textContentLength = textNode.getContentLength()
			if(offset !== 0 && offset !== textContentLength){

				let TextNodeData = textNode.getData(true)
				node = (node as imageNode).createSelfNode((node as imageNode).getData()) as imageNode
				
				let leftSideTextNode = createTextNode({...TextNodeData, plainText: textNode.getSlicedContent(true, offset)})
				let rightSideTextNode = createTextNode({...TextNodeData, plainText: textNode.getSlicedContent(false, offset)})

				this.splitNodes(true, nodeIndex, nodeIndex + 1,  [leftSideTextNode, node, rightSideTextNode])
				return node
			}
			else if(offset === 0){
				return this.insertNodeBefore(nodeIndex, node)
			}
			else if(offset === textContentLength){
				return this.insertNodeAfter(nodeIndex, node)
			}
		}
		else if(this.isBreakLine()){
			this.replaceNode(0, node)
		}
		return;
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

	splitNodes(startFromZero: boolean = true, start: number, end?: number, node?: NodeTypes | Array<NodeTypes>): void {
		let StartSlice = startFromZero === true ? 
			this.NodeData.slice(0, start) 
			: 
			this.NodeData.slice(start);

		let EndSlice = isDefined(end) ? this.NodeData.slice(end) : [];

		if (node === undefined) this.NodeData = [...StartSlice, ...EndSlice];
		else {
			if(Array.isArray(node)){
				this.NodeData = [...StartSlice, ...node, ...EndSlice];
			}
			else this.NodeData = [...StartSlice, node, ...EndSlice];
		}
	}

	collectSameNodes(): void{

		const NodeStylesEqual = (C1: TextNode, C2: TextNode): boolean => {

			let C1Styles = C1.getNodeStyle()
			let C2Styles = C2.getNodeStyle()
	
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

		const isSameTextNode = (C: NodeTypes, N: NodeTypes): boolean => {
			return(
				(C instanceof TextNode && N instanceof TextNode) &&
				NodeStylesEqual(C, N)
			)
		}

		const isSameLinkNode = (C: NodeTypes, N: NodeTypes): boolean => {
			return(
				(C instanceof LinkNode && N instanceof LinkNode) &&
				C.getURL() === N.getURL() &&
				NodeStylesEqual(C, N)
			)
		}

		let newNodeData: BlockNodeData = []
		let currentNode = this.NodeData[0]
		newNodeData.push(currentNode)

		for(let i = 1 ; i < this.NodeData.length; i++){
			let nextNode = this.NodeData[i]
			if(
				isSameTextNode(currentNode, nextNode) ||
				isSameLinkNode(currentNode, nextNode)
				){
					(currentNode as TextNode).appendContent((nextNode as TextNode).getContent())
				}
			else{
				currentNode = this.NodeData[i]
				newNodeData.push(currentNode)
			}
		}
		this.NodeData = newNodeData


	}

	countToIndex(index: number): number {
		let Count = 0;
		index = index < 0 ? 1 : index

		
		for (let CharIndex = 0; CharIndex < this.NodeData.length; CharIndex++) {
			if (CharIndex <= index) {
				let CurrentElement = this.NodeData[CharIndex];
				Count += CurrentElement.getContentLength();
			};
		}
		return Count;
	}

	findNodeByOffset(offset: number): findNodeOffsetData {
		let data: findNodeOffsetData = {offsetKey: 0, letterIndex: 0};
		let letterCount = 0;
		for (let i = 0; i < this.NodeData.length; i++) {
			let currentLetterCount = this.NodeData[i].getContentLength();
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

	getNodeIndexByKey(key: string): number {
		return this.NodeData.findIndex(node => node.__key === key)
	}

	getNodeByKey(key: string): NodeTypes | undefined{
		return this.NodeData.find(node => node.__key === key);
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

}

class HorizontalRuleNode extends BaseBlockNode{

	constructor() {
		super(HORIZONTAL_RULE_BLOCK_TYPE, [])
	}

	getType() {
		return this.blockType;
	}

	$getNodeState(options?: AiteNodeOptions): AiteNode{
		let className = 'AITE_editor_horizontal-rule'
		let props = {
			class: className,
		}
		this.$updateNodeKey()

		return createAiteNode(
			'div',
			{contenteditable: false,},
			[createAiteNode('hr', props, [])],
			{...options, key: this.$getNodeKey(), isAiteWrapper: false}
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
