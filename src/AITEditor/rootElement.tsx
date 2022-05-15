import React from 'react';

import type {EditorState as editorState} from './EditorManagmentUtils';
import TextNode from './CharNode';
import type {imageNode} from './packages/AITE_Image/imageNode';
import {TEXT_NODE_TYPE, STANDART_BLOCK_TYPE, HORIZONTAL_RULE_BLOCK_TYPE, IMAGE_NODE_TYPE} from './ConstVariables';
import BlockNode, {NodeTypes, BlockType} from './BlockNode';

import BlockResizeElemets from './imageNodeActiveElements';

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

export function CreateReactEditor({EditorState}: {EditorState: editorState}): JSX.Element {
	let blockIndex = 0;
	let charIndex = 0;
	let keyPrefix = '';

	type ElementAttributes = {
		key: string;
		className?: string;
		style?: {[K: string]: string};
		src?: string;
		alt?: string;
	};

	function isActive(charIndex: number, blockIndex: number): boolean {
		let EditorActiveElement = EditorState.EditorActiveElementState;
		if (EditorActiveElement?.charNode === charIndex && EditorActiveElement?.blockNode.getLastIndex() === blockIndex) return true;
		return false;
	}

	function createBlockElements(blocks: Array<BlockType>) {
		let BlockElements: Array<JSX.Element> = [];
		blocks.forEach((block: BlockType) => {
			let currentBlockType = block.getType();
			if (currentBlockType === STANDART_BLOCK_TYPE) {
				let CurrentBlockChildrens: any = [];
				if (
					(block as BlockNode).CharData.length === 1 &&
					(block as BlockNode).CharData[0].returnContent() === '' &&
					(block as BlockNode).CharData[0].returnType() === TEXT_NODE_TYPE
				) {
					BlockElements.push(createBlockNode(block as BlockNode, [createBreakLine()]));
				} else {
					(block as BlockNode).CharData.forEach((CharData: NodeTypes, index: number) => {
						if (CharData.returnActualType() === TEXT_NODE_TYPE) {
							CurrentBlockChildrens.push(createTextNode(CharData as TextNode));
						} else if (CharData.returnActualType() === IMAGE_NODE_TYPE) {
							CurrentBlockChildrens.push(createImageNode(CharData as imageNode));
						}
						charIndex += 1;
					});
					BlockElements.push(createBlockNode(block as BlockNode, CurrentBlockChildrens));
					charIndex = 0;
				}
			} else if (currentBlockType === HORIZONTAL_RULE_BLOCK_TYPE) {
				BlockElements.push(createHorizontalRule());
			}
			blockIndex += 1;
		});
		return BlockElements;
	}

	function createTextNode(TextNode: TextNode): JSX.Element | string {
		TextNode.prepareStyles();
		let s: ElementAttributes = {
			key: `Editor-block-${blockIndex}-${charIndex}${keyPrefix}`,
		};
		if (TextNode.d[3] !== null) {
			if (TextNode.d[3]?.c !== '') s['className'] = TextNode.d[3]?.c as string;
		}
		return React.createElement('span', s, [TextNode.returnContent()]);
	}

	function createImageNode(node: imageNode): JSX.Element | string {
		interface ImageWrapperAttrType {
			key: string;
			className: string;
			contentEditable: false;
			style?: {[K: string]: string};
		}

		interface imageAttributesType {
			key: string;
			alt: string;
			className: string | null | undefined;
			src: string;
			style?: {[K: string]: string};
		}

		let imageAttributes: imageAttributesType = {
			key: `Editor-block-${blockIndex}-${charIndex}${keyPrefix}`,
			alt: node.imageConf.alt,
			className: node.imageConf.className,
			src: node.imageConf.src,
			style: node.imageStyle.s,
		};

		let imageActive: boolean = isActive(charIndex, blockIndex);
		let imageElements: Array<JSX.Element> = [];

		const ImageWrapperAttr: ImageWrapperAttrType = {
			key: `Editor-block-${blockIndex}-${charIndex}-wrapper${keyPrefix}`,
			className: 'image-wrapper',
			contentEditable: false,
		};

		if (imageActive === true) {
			ImageWrapperAttr.className += ' AITE__image__active';
			imageElements = [...imageElements, ...BlockResizeElemets(node, `image-resize-elements-${charIndex}`)];
		}

		if (node.imageStyle.float.dir !== 'none') {
			ImageWrapperAttr['style'] = {
				...ImageWrapperAttr.style,
				float: node.imageStyle.float.dir,
			};
		}

		if (node.ContentNode !== undefined && node.ContentNode.BlockNodes.length > 0 && node.imageConf.captionEnabled) {
			keyPrefix = `-imageCaption-${charIndex}`;
			let captionBlockNodes = createBlockElements(node.ContentNode.BlockNodes);
			keyPrefix = '';
			let captionWrapper = React.createElement(
				'div',
				{
					key: `Editor-block-${blockIndex}-${charIndex}-captition${keyPrefix}`,
					className: 'AITE_image_caption_wrapper',
					contentEditable: true,
					suppressContentEditableWarning: true,
					'data-aite_block_content_node': true,

					onKeyDown: (e) => e.preventDefault(),
				},
				captionBlockNodes,
			);
			imageElements = [...imageElements, captionWrapper];
		}

		const ImageElement = React.createElement('img', imageAttributes, null);
		return React.createElement('span', ImageWrapperAttr, [ImageElement, imageElements]);
	}

	function createHorizontalRule(): JSX.Element {
		let className = 'ATE_editor_horizontal-rule';
		let HorizontalRuleElement = React.createElement('hr', {className: className}, null);
		const a = {
			key: `Editor-block-${blockIndex}-${charIndex}${keyPrefix}`,
			contentEditable: false,
		};
		return React.createElement('div', a, HorizontalRuleElement);
	}

	function createBreakLine() {
		const a = {key: `Editor-block-${blockIndex}-${charIndex}`};
		return React.createElement('br', a);
	}

	type BlockParameters = {
		key: string;
		'data-aite_block_node': boolean;
		className?: string;
	};

	function createBlockNode(node: BlockNode, childrens: Array<JSX.Element>): JSX.Element {
		let BlockWrapper = node.prepareBlockStyle();
		let s: BlockParameters = {
			key: `Editor-block-${blockIndex}-${charIndex}${keyPrefix}`,
			'data-aite_block_node': true,
		};

		if (BlockWrapper.c !== null) {
			s['className'] = '';
			s.className += BlockWrapper.c;
		}

		return React.createElement(BlockWrapper.n, s, childrens);
	}
	let BlockElements = createBlockElements(EditorState.contentNode.BlockNodes);
	return React.createElement(React.Fragment, null, BlockElements);
}
