import React from 'react';
import {TextNode, LinkNode} from '../../AITE_nodes/index'

import {BaseNode} from '../../AITE_nodes/index';
import {DOMattr} from '../../AITE_nodes/index'

import BlockResizeElemets from './imageResizeElements'
import {createBlockElements} from '../../rootElement'
import {validateImageURL} from './imageUtils'

import {BlockNode, ContentNode, AiteNode} from '../../index';

export type floatType = 'right' | 'left' | 'none';

interface imageConf {
	src: string;
	alt?: string;
	canResize?: boolean;
	canFloat?: boolean;
	captionEnabled?: boolean;
	className?: string | null;

	float?: floatType;

	width?: number;
	height?: number;

	minWidth?: number;
	minHeight?: number;
	maxWidth?: number;
	maxHeight?: number;
}

interface ImageWrapperAttrType {
	key?: string;
	className: string;
	contentEditable: false;
	style?: {[K: string]: string}
	'data-aite_decorator_node'?: boolean
}

interface imageAttributesType {
	key: string;
	alt: string;
	className: string | null | undefined;
	src: string;
	style?: {[K: string]: string};
}

class imageNode extends BaseNode{
	imageConf: {
		src: string;
		alt: string;
		canResize: boolean;
		canFloat: boolean;
		captionEnabled: boolean;
		className?: string | null;
	};
	imageStyle: {
		c: null;
		s: {
			height: string;
			width: string;
			minWidth: string;
			minHeight: string;
			[K: string]: string;
		};
		float: {
			dir: floatType;
			hasChanged: boolean;
		};
	};
	ContentNode: ContentNode | undefined;

	constructor(imageNodeConf: imageConf) {
		super('image', 'inline')
		this.imageConf = {
			src: imageNodeConf.src,
			alt: imageNodeConf.alt ?? '',
			canResize: imageNodeConf.canResize ?? true,
			canFloat: imageNodeConf.canFloat ?? true,
			captionEnabled: imageNodeConf.captionEnabled ?? true,
			className: imageNodeConf.className ?? null,
		};
		this.imageStyle = {
			c: null,
			s: {
				width: (imageNodeConf.width ?? 400) + 'px',
				height: (imageNodeConf.height ?? 400) + 'px',
				minWidth: (imageNodeConf.minWidth ?? 100) + 'px',
				minHeight: (imageNodeConf.minHeight ?? 100) + 'px',
				maxWidth: '100%',
				maxHeight: '100%',
			},
			float: {
				dir: imageNodeConf?.float ?? 'none',
				hasChanged: false,
			},
		};

		let chardata: Array<any> = [new TextNode({plainText: 'Hello world from caption'})];

		this.ContentNode = false
			? undefined
			: new ContentNode({
					BlockNodes: [
						new BlockNode({
							blockInlineStyles: ['text_aligment_center'],
							NodeData: chardata,
						}),
						new BlockNode({
							blockWrapper: 'list-ordered-item',
							NodeData: [
								new TextNode(
									{plainText: `предмет листа 1`},
								),
							],
						}),
						new BlockNode({
							blockWrapper: 'list-ordered-item',
							NodeData: [
								new TextNode(
									{plainText: `предмет листа 2`},
								),
								new LinkNode({
									plainText: 'интеренсная',
									url: 'https://ru.wikipedia.org/wiki/Заглавная_страница',
								}),
								new LinkNode({
									plainText: ' жирная ссылка',
									stylesArr: ['BOLD'],
									url: 'https://ru.wikipedia.org/wiki/Заглавная_страница',
								}),
							],
						}),
					],
			  });
	}

	get Captition(): ContentNode | undefined {
		return this.ContentNode;
	}

	toggleCaptition(): void {
		if (this.ContentNode === undefined) {
			this.imageConf.captionEnabled = true;
			this.ContentNode = new ContentNode({
				BlockNodes: [
					new BlockNode({
						allowedToInsert: 'text',
						NodeData: [new TextNode()],
					}),
				],
			});
		} else this.imageConf.captionEnabled = !this.imageConf.captionEnabled;
	}

	$setDirection(dir?: floatType, hasChanged?: boolean): void {
		this.imageStyle.float.dir = dir ?? this.imageStyle.float.dir;
		this.imageStyle.float.hasChanged = hasChanged ?? this.imageStyle.float.hasChanged;
	}

	setWidth(newWidth: number): void {
		this.imageStyle = {
			...this.imageStyle,
			s: {...this.imageStyle.s, width: newWidth + 'px'},
		};
	}

	setHeight(newHeight: number): void {
		this.imageStyle = {
			...this.imageStyle,
			s: {...this.imageStyle.s, height: newHeight + 'px'},
		};
	}

	returnContent(): string {
		return this.imageConf.src;
	}
	returnContentLength(): number {
		return 1;
	}

	createSelfNode(data: imageConf){
		return createImageNode(data)
	}

	createDOM(attr?: DOMattr){

		let imageAttributes: imageAttributesType = {
			key: attr?.html?.key ? attr.html?.key : 'aite-image-node',
			alt: this.imageConf.alt,
			className: this.imageConf.className,
			src: this.imageConf.src,
			style: this.imageStyle.s,
		};

		let imageElements: Array<JSX.Element> = [];

		const ImageWrapperAttr: ImageWrapperAttrType = {
			key: attr?.html?.key ? attr.html?.key : 'aite-image-node-wrapper',
			className: 'image-wrapper',
			contentEditable: false,
			style: {
				width: this.imageStyle.s.width,
				minHeight: this.imageStyle.s.height,
				minWidth: this.imageStyle.s.minWidth,
			},
		};

		if (attr?.other?.isActive === true) {
			ImageWrapperAttr.className += ' AITE__image__active';
			imageElements = [...imageElements, ...BlockResizeElemets(this, attr?.html?.key ? attr.html?.key : 'image-resize-elements-active')];
		}

		if (this.imageStyle.float.dir !== 'none') {
			ImageWrapperAttr.style = {
				...ImageWrapperAttr.style,
				float: this.imageStyle.float.dir,
			};
		}

		if (this.ContentNode !== undefined && this.ContentNode.BlockNodes.length > 0 && this.imageConf.captionEnabled) {
			let captionBlockNodes = createBlockElements(this.ContentNode.BlockNodes, attr?.other?.isActiveFunction!, '-imageCaption');
			let captionWrapper = React.createElement(
				'div',
				{
					key: attr?.html?.key ? attr.html?.key : 'image-caption-wrapper',
					className: 'AITE_image_caption_wrapper',
					spellCheck: false,
					contentEditable: true,
					suppressContentEditableWarning: true,
					'data-aite_block_content_node': true,
				},
				captionBlockNodes,
			);
			imageElements = [...imageElements, captionWrapper];
		}

		const ImageElement = React.createElement('img', imageAttributes, null);
		return React.createElement('span', ImageWrapperAttr, [ImageElement, imageElements]);
	}


	$getNodeKey(){
		return `
		AITE_IMAGE_WRAPPER_
		${this.imageConf.src.slice(10, 20)}_
		${this.imageConf.alt.slice(0, 5)}_
		${this.imageConf.canFloat}_
		${this.imageConf.canResize}_
		${this.imageConf.captionEnabled}`
	}

	$getNodeState(options?: {path?: Array<number>}): AiteNode{

		let imageNode = new AiteNode(
			'img',
			{
				alt: this.imageConf.alt,
				className: this.imageConf.className,
				src: this.imageConf.src,
				style: this.imageStyle.s,
			},
			[],
			{isAiteWrapper: true}
		)

		let imageElements = [imageNode]

		if (this.ContentNode !== undefined && this.ContentNode.BlockNodes.length > 0 && this.imageConf.captionEnabled) {
			let captionBlockNodes: Array<AiteNode> = []
			this.ContentNode.BlockNodes.forEach((node) => {
				captionBlockNodes.push(node.$getNodeState())
			})

			let wrapperKey = this.$getNodeKey()
			let captionWrapper = new AiteNode(
				'div',
				{
					className: 'AITE_image_caption_wrapper',
					spellCheck: false,
					contentEditable: true,
					'data-aite_content_node': true,
				},
				captionBlockNodes,
				{key: wrapperKey, isAiteWrapper: false}
			);
			imageElements = [...imageElements, captionWrapper];
		}

		const ImageWrapperAttr: ImageWrapperAttrType = {
			className: 'image-wrapper',
			'data-aite_decorator_node': true,
			contentEditable: false,
			style: {
				width: this.imageStyle.s.width,
				minHeight: this.imageStyle.s.height,
				minWidth: this.imageStyle.s.minWidth,
			},
		};

		if (this.imageStyle.float.dir !== 'none') {
			ImageWrapperAttr.style = {
				...ImageWrapperAttr.style,
				float: this.imageStyle.float.dir,
			};
		}

		let imageKey = `AITE_IMAGE_WRAPPER_${this.imageConf.src.slice(10, 20)}_${this.imageConf.alt.slice(0, 5)}`

		return new AiteNode(
			'div',
			ImageWrapperAttr,
			imageElements,
			{key: imageKey, isAiteWrapper: false}
			) 
	} 

}

function createImageNode(imageConf: imageConf): imageNode | undefined {


	if(validateImageURL(imageConf.src) === false) return;
	let initWidth = 0;
	let initHeight = 0;
	let sizeRatio = 1,
		minHeight = 100,
		minWidth = 100;

	let ImageNode = new imageNode({
		...imageConf,
	});

	const img = new Image();
	img.onload = function () {
		initWidth = img.width;
		initHeight = img.height;

		sizeRatio = initWidth / initHeight;
		minHeight = 100;
		minWidth = Math.round(minHeight * sizeRatio);

		ImageNode.setWidth(Math.round(400 * sizeRatio));
		ImageNode.imageStyle.s.minWidth = minWidth + 'px';
		ImageNode.imageStyle.s.minHeight = minHeight + 'px';
	};
	img.src = imageConf.src;

	return ImageNode;
}

export{
	createImageNode,
	imageNode
}

