import React from 'react'
import BlockNode from '../../BlockNode'
import TextNode from '../../CharNode'
import ContentNode from '../../ContentNode'

type ElementType = 'image' | 'horizontal-rule' | 'text'
export type floatType = 'right' | 'left' | 'none'

type ImageElement = {
    type: ElementType,
    imageConf: {
        src: string,
        alt: string
        canResize: boolean,
        canFloat: boolean
        className?: string | null
    },
    imageStyle: {
        c: null, 
        s: {
            height: string
            width: string
            minWidth: string
            minHeight: string
            [K: string]: string
        },
        float: {
            dir: floatType
            hasChanged: boolean
        }
    },
    CharData: Array<BlockNode>
}


interface imageConf {
    src: string
    alt?: string
    canResize?: boolean
    canFloat?: boolean
    className?: string | null

    float?: floatType

    width?: number
    height?: number

    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
}




export class imageNode{

    type: ElementType
    imageConf: {
        src: string,
        alt: string
        canResize: boolean,
        canFloat: boolean
        className?: string | null
    }
    imageStyle: {
        c: null, 
        s: {
            height: string
            width: string
            minWidth: string
            minHeight: string
            [K: string]: string
        },
        float: {
            dir: floatType
            hasChanged: boolean
        }
    }
    ContentNode: ContentNode
 
    constructor(imageNodeConf: imageConf){
        this.type = 'image'
        this.imageConf = {
            src: imageNodeConf.src,
            alt: imageNodeConf.src ?? '',
            canResize: imageNodeConf.canResize ?? true,
            canFloat: imageNodeConf.canFloat ?? true,
            className: imageNodeConf.className ?? null,
        }
        this.imageStyle = {c: null, 
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
        }
        this.ContentNode = new ContentNode({BlockNodes: [
            new BlockNode({CharData: [new TextNode('Hello world from caption'), new TextNode('Second world'),]}),
            new BlockNode({CharData: [new TextNode('is second block of Hello world from caption')]})
        ]})
    };

    $setDirection(dir?: floatType, hasChanged?: boolean){
        this.imageStyle.float.dir = dir ?? this.imageStyle.float.dir;
        this.imageStyle.float.hasChanged = hasChanged ?? this.imageStyle.float.hasChanged;
    }

    setWidth(newWidth: number){
        this.imageStyle = {...this.imageStyle, s: {...this.imageStyle.s, width: newWidth + 'px'}};
    }

    setHeight(newHeight: number){
        this.imageStyle = {...this.imageStyle, s: {...this.imageStyle.s, height: newHeight + 'px'}};
    }

    returnActualType(){return this.type};
    returnType(){return 'element'};
    returnContent(){return this.imageConf.src};
    returnContentLength(){return 1};
} 

export default function createImageNode(imageConf: imageConf){


    let initWidth = 0;
    let initHeight = 0;
    let sizeRatio = 1,
        minHeight = 100,
        minWidth = 100;
    

    let ImageNode = new imageNode({
        ...imageConf
    });


    const img = new Image();
    img.onload = function() {
        initWidth = img.width;
        initHeight = img.height;

        sizeRatio = initWidth / initHeight;
        minHeight = 100;
        minWidth = Math.round(minHeight * sizeRatio);

        ImageNode.setWidth(Math.round(400 * sizeRatio));
        ImageNode.imageStyle.s.minWidth = minWidth + 'px';
        ImageNode.imageStyle.s.minHeight = minHeight + 'px';

    }
    img.src = imageConf.src;

    return ImageNode;
}