import React from 'react';

import type {EditorState as editorState} from './EditorState';
import {TextNode} from './AITE_nodes/index';
import type {LinkNode} from './AITE_nodes/index';
import type {imageNode} from './packages/AITE_Image/imageNode';
import {
	TEXT_NODE_TYPE,
	LINK_NODE_TYPE,
	STANDART_BLOCK_TYPE,
	HORIZONTAL_RULE_BLOCK_TYPE,
	IMAGE_NODE_TYPE,
	ORDERED_LIST_ITEM,
	UNORDERED_LIST_ITEM,
} from './ConstVariables';
import BlockNode, {BlockType, NodeTypes} from './BlockNode';
import type {HorizontalRuleNode} from './BlockNode';
import SearchUtils from './SearchUtils';
import defaultBlocks from './defaultStyles/defaultBlocks';
import type ContentNode from './ContentNode';

type BlockParameters = {
	key: string;
	'data-aite_block_node': boolean;
	className?: string;
};

let BlockIndex = 0;
let NodeIndex = 0;

// eslint-disable-next-line
function createReactStyle(style: string) {
	let spiletedStyle = style.split(':');
	if (spiletedStyle.length > 2 || spiletedStyle.length < 2) return;
	let spiletedPrefix = spiletedStyle[0].split('-');
	spiletedPrefix.forEach((style: string, index: number) => {
		if (index !== 0) {
			spiletedPrefix[index] = style.replace(/^\w/, (c) => c.toUpperCase());
		}
	});
	return {[spiletedPrefix.join('')]: spiletedStyle[1].trim()};
}

function isActive(EditorState: editorState): (charIndex: number, blockIndex: number) => boolean {
	let EditorActiveElement = EditorState.EditorActiveElementState;
	return function (charIndex: number, blockIndex: number) {
		if (EditorActiveElement?.charNode === charIndex && EditorActiveElement?.blockNode.getLastIndex() === blockIndex) return true;
		return false;
	};
}

function createBreakLine() {
	const a = {key: `Editor-block-${BlockIndex}-${NodeIndex}`};
	return React.createElement('br', a);
}

function createBlockNode(node: BlockNode, childrens: Array<JSX.Element>): JSX.Element {
	let BlockWrapper = node.prepareBlockStyle();
	let s: BlockParameters = {
		key: `Editor-block-${BlockIndex}`,
		'data-aite_block_node': true,
	};

	if (BlockWrapper.c !== '') {
		s['className'] = '';
		s.className += BlockWrapper.c;
	}

	return React.createElement(BlockWrapper.n, s, childrens);
}

function createSingleLinkNode(block: BlockNode, offset: number) {
	let data = {tag: 'a', url: undefined, node: undefined, length: 1};
	let currentNode = block.NodeData[offset];
	if (currentNode.returnActualType() === LINK_NODE_TYPE) {
		let childrens = [];
		let parentURL = (currentNode as LinkNode).getURL();
		let i = 1;
		let nextNode = block.NodeData[offset + i] as LinkNode;
		if (nextNode !== undefined && nextNode.returnActualType() === LINK_NODE_TYPE && nextNode.getURL() === parentURL) {
			childrens.push((currentNode as LinkNode).createSelfTextNode({html: {key: `Editor-block-${BlockIndex}-${NodeIndex}-link`}}));
			childrens.push((nextNode as LinkNode).createSelfTextNode({html: {key: `Editor-block-${BlockIndex}-${NodeIndex + 1}-link`}}));
			i += 1;
			while (true) {
				nextNode = block.NodeData[offset + i] as LinkNode;
				if (nextNode === undefined) break;
				else if (nextNode.returnActualType() !== LINK_NODE_TYPE) break;
				else if (nextNode.getURL() === parentURL) {
					const key = `Editor-block-${BlockIndex}-${NodeIndex + i}-link`;
					childrens.push((nextNode as LinkNode).createSelfTextNode({html: {key: key}}));
				} else break;
				i += 1;
			}
			let node = React.createElement(
				'a',
				{href: parentURL, key: `Editor-block-${BlockIndex}-${NodeIndex + i}-link-wrapper`, 'data-aite-node-leaf': true},
				childrens,
			);
			return {tag: 'a', url: parentURL, node: node, length: childrens.length};
		}
	}
	return data;
}

function isListNode(BlockNode: BlockNode): boolean {
	if (BlockNode.blockWrapper === ORDERED_LIST_ITEM || BlockNode.blockWrapper === UNORDERED_LIST_ITEM) return true;
	else return false;
}

function getListTag(list: string): string {
	if (list === ORDERED_LIST_ITEM) return 'ol';
	else if (list === UNORDERED_LIST_ITEM) return 'ul';
	return list;
}

function createBlockNodes(BlockNode: BlockNode, isActiveFunction: (charIndex: number, blockIndex: number) => boolean) {
	NodeIndex = 0;
	let Nodes = [];
	for (let i = 0; i < BlockNode.NodeData.length; i++) {
		let NodeData = BlockNode.NodeData[i];
		const key = `Editor-block-${BlockIndex}-${NodeIndex}`;

		if (NodeData.returnActualType() === TEXT_NODE_TYPE) {
			Nodes.push((NodeData as TextNode).createDOM({html: {key: key}}));
		} else if (NodeData.returnActualType() === LINK_NODE_TYPE) {
			let singleLink = createSingleLinkNode(BlockNode, i);
			if (singleLink.node === undefined) {
				Nodes.push((NodeData as TextNode).createDOM({html: {key: key}}));
			} else {
				Nodes.push(singleLink.node);
				if (Nodes.length > 2) i += Nodes.length - 2;
				else i += 1;
			}
		} else if (NodeData.returnActualType() === IMAGE_NODE_TYPE) {
			let imageActive: boolean = isActiveFunction(NodeIndex, BlockIndex);
			Nodes.push(
				(NodeData as imageNode).createDOM({
					html: {key: key},
					other: {isActive: imageActive, isActiveFunction: isActiveFunction},
				}),
			);
		}

		NodeIndex += 1;
	}
	return Nodes;
}

function createSingleListNode(BlockNodes: Array<BlockType>, offset: number, isActiveFunction: (charIndex: number, blockIndex: number) => boolean) {
	let data = {tag: 'ul', node: undefined, length: 0};
	let currentBlock = BlockNodes[offset] as BlockNode;
	let listStyle = defaultBlocks.find((obj) => obj.type === currentBlock.getWrapper() ?? '');
	let listTag = getListTag(listStyle?.type ?? 'li');
	if (currentBlock.getType() !== STANDART_BLOCK_TYPE) return data;
	else if (currentBlock.getWrapper() === ORDERED_LIST_ITEM || currentBlock.getWrapper() === UNORDERED_LIST_ITEM) {
		let childrens = [];
		let i = 1;
		let nextBlock = BlockNodes[offset + i] as BlockNode;
		if (nextBlock !== undefined && nextBlock.getType() === STANDART_BLOCK_TYPE && nextBlock.getWrapper() === listStyle?.type) {
			childrens.push(createBlockNode(currentBlock, createBlockNodes(currentBlock, isActiveFunction)));
			BlockIndex += 1;
			childrens.push(createBlockNode(nextBlock, createBlockNodes(nextBlock, isActiveFunction)));
			i += 1;
			while (true) {
				nextBlock = BlockNodes[offset + i] as BlockNode;
				if (nextBlock === undefined || nextBlock.getType() !== STANDART_BLOCK_TYPE) break;
				else if (isListNode(nextBlock) === false) break;
				else if (nextBlock.getWrapper() === listStyle?.type) {
					BlockIndex += 1;
					childrens.push(createBlockNode(nextBlock, createBlockNodes(nextBlock, isActiveFunction)));
				} else break;
				i += 1;
			}
			let node = React.createElement(listTag, {key: `Editor-block-${BlockIndex}-${NodeIndex + i}-link-wrapper`, 'data-aite-node-leaf': true}, childrens);
			return {tag: listTag, node: node, length: childrens.length};
		} else {
			BlockIndex += 1;
			let children = createBlockNode(currentBlock, createBlockNodes(currentBlock, isActiveFunction));
			let node = React.createElement(listTag, {key: `Editor-block-${BlockIndex}-${NodeIndex + i}-link-wrapper`, 'data-aite-node-leaf': true}, children);
			return {tag: listTag, node: node, length: 1};
		}
	}
	return data;
}

export function createBlockElements(blocks: Array<BlockType>, isActiveFunction: (charIndex: number, blockIndex: number) => boolean, keyPrefix?: string) {
	let BlockElements: Array<JSX.Element> = [];
	NodeIndex = 0;
	for (let i = 0; i < blocks.length; i++) {
		let block = blocks[i];
		let blockType = block.getType();
		if (blockType === STANDART_BLOCK_TYPE) {
			block = block as BlockNode;
			if (block.getWrapper() === ORDERED_LIST_ITEM || block.getWrapper() === UNORDERED_LIST_ITEM) {
				let collectedList = createSingleListNode(blocks, i, isActiveFunction);
				if (collectedList.length === 1 && collectedList.node !== undefined) {
					BlockElements.push(collectedList.node);
				} else if (collectedList.length > 1 && collectedList.node !== undefined) {
					BlockElements.push(collectedList.node);
					i += collectedList.length - 1;
				}
			} else if (block.isBreakLine()) {
				BlockElements.push(createBlockNode(block as BlockNode, [createBreakLine()]));
			} else {
				let BlockChildrens = createBlockNodes(block, isActiveFunction);
				BlockElements.push(createBlockNode(block as BlockNode, BlockChildrens));
			}
		} else if (blockType === HORIZONTAL_RULE_BLOCK_TYPE) {
			const key = `Editor-block-${BlockIndex}-horizontal-rule`;
			BlockElements.push((block as HorizontalRuleNode).createDOM({html: {key: key}}));
		}
		NodeIndex = 0;
		BlockIndex += 1;
	}
	return BlockElements;
}

export function CreateReactEditor({EditorState}: {EditorState: editorState}): JSX.Element {
	BlockIndex = 0;
	NodeIndex = 0;
	let isActiveFunction = isActive(EditorState);
	let BlockElements = createBlockElements(EditorState.contentNode.BlockNodes, isActiveFunction);
	return React.createElement(React.Fragment, null, BlockElements);
}
