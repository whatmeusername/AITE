
import {TextNode, LinkNode} from '../../AITE_nodes/index'

import {BaseNode} from '../../AITE_nodes/index';

//eslint-disable-next-line
import BlockResizeElemets from './imageResizeElements'
import {validateImageURL} from './imageUtils'

import {BlockNode, ContentNode, AiteNode, isNodeActive} from '../../index';

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
	draggable?: boolean;
	contentEditable: false;
	style?: {[K: string]: string}
	'data-aite_decorator_node'?: boolean
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

	getContent(): string {
		return this.imageConf.src;
	}
	getContentLength(): number {
		return 1;
	}

	createSelfNode(data: imageConf){
		return createImageNode(data)
	}

	getData(): imageConf{
		return {
			src: this.imageConf.src,
			alt: this.imageConf.alt,
			canResize: this.imageConf.canResize,
			canFloat: this.imageConf.canFloat,
			captionEnabled: this.imageConf.captionEnabled,
			className: this.imageConf.className,

			float: this.imageStyle.float.dir,

			width: parseInt(this.imageStyle.s.width),
			height: parseInt(this.imageStyle.s.height),

			minWidth: parseInt(this.imageStyle.s.minWidth),
			minHeight: parseInt(this.imageStyle.s.minHeight),
			maxWidth: parseInt(this.imageStyle.s.maxWidth),
			maxHeight: parseInt(this.imageStyle.s.maxHeight),
		}
	}

	$getNodeState(options?: {path?: Array<number>}): AiteNode{

		let key = this.$getNodeKey()
		let isActive = isNodeActive(this.$getNodeKey())

		let imageNode = new AiteNode(
			'img',
			{
				alt: this.imageConf.alt,
				className: this.imageConf.className,
				draggable: isActive ? true : false,
				src: this.imageConf.src,
				style: this.imageStyle.s,
			},
			[],
			{AiteNodeType: 'image/gif', isAiteWrapper: true}
		)

		let imageElements = [imageNode]

		if (this.ContentNode !== undefined && this.ContentNode.BlockNodes.length > 0 && this.imageConf.captionEnabled) {
			let captionBlockNodes: Array<AiteNode> = []
			this.ContentNode.BlockNodes.forEach((node) => {
				captionBlockNodes.push(node.$getNodeState())
			})

			let captionWrapper = new AiteNode(
				'div',
				{
					className: 'AITE_image_caption_wrapper',
					spellCheck: false,
					draggable: isActive ? true : false,
					contentEditable: true,
					'data-aite_content_node': true,
				},
				captionBlockNodes,
				{AiteNodeType: 'image/gif', isAiteWrapper: false}
			);
			imageElements = [...imageElements, captionWrapper];
		}

		const ImageWrapperAttr: ImageWrapperAttrType = {
			className: 'image-wrapper',
			'data-aite_decorator_node': true,
			contentEditable: false,
			draggable: isActive ? true : false,
			style: {
				width: this.imageStyle.s.width,
				minHeight: this.imageStyle.s.height,
				minWidth: this.imageStyle.s.minWidth,
			},
		};


		if(isActive){
			ImageWrapperAttr.className += ' AITE__image__active'
			imageElements = [...imageElements, ...BlockResizeElemets(this)]
		}

		if (this.imageStyle.float.dir !== 'none') {
			ImageWrapperAttr.style = {
				...ImageWrapperAttr.style,
				float: this.imageStyle.float.dir,
			};
		}

		return new AiteNode(
			'div',
			ImageWrapperAttr,
			imageElements,
			{AiteNodeType: 'image/gif', key: key, isAiteWrapper: false}
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

	ImageNode?.$updateNodeKey()

	return ImageNode;
}

export{
	createImageNode,
	imageNode
}

