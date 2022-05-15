import React from 'react';
import BlockNode from '../../BlockNode';
import TextNode from '../../CharNode';
import ContentNode from '../../ContentNode';

type ElementType = 'image' | 'horizontal-rule' | 'text';
export type floatType = 'right' | 'left' | 'none';

type ImageElement = {
	type: ElementType;
	imageConf: {
		src: string;
		alt: string;
		canResize: boolean;
		canFloat: boolean;
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
	CharData: Array<BlockNode>;
};

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

export class imageNode {
	type: ElementType;
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
		this.type = 'image';
		this.imageConf = {
			src: imageNodeConf.src,
			alt: imageNodeConf.src ?? '',
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

		let chardata: Array<any> = [new TextNode('Hello world from caption')];

		// let randomTest =
		// 	Math.random() < 0.99
		// 		? new imageNode({
		// 				src: 'https://mykaleidoscope.ru/uploads/posts/2020-03/1583265032_3-p-yarkie-kapkeiki-10.jpg',
		// 		  })
		// 		: undefined;
		// if (randomTest !== undefined) {
		// 	chardata.push(randomTest);
		// }

		this.ContentNode = false
			? undefined
			: new ContentNode({
					BlockNodes: [
						new BlockNode({
							CharData: chardata,
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
						CharData: [new TextNode('')],
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

	returnActualType(): string {
		return this.type;
	}
	returnType(): string {
		return 'element';
	}
	returnContent(): string {
		return this.imageConf.src;
	}
	returnContentLength(): number {
		return 1;
	}
}

export default function createImageNode(imageConf: imageConf): imageNode {
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
