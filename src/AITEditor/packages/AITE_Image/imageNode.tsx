import React from 'react'

type ElementType = 'image' | 'horizontal-rule' | 'text'

type ImageElement = [
    ElementType,
    {
        src: string,
        alt: string
        canResize: boolean,
        canFloat: boolean
        className?: string | null
    },
    {
        c: null, 
        s: {
            height: string,
            width: string, 
            minWidth: string, 
            minHeight: string, 
            [K: string]: string
        },
        float: string | null
    }
]


interface imageNode {
    src: string
    alt?: string
    canResize?: boolean
    canFloat?: boolean
    className?: string | null

    width?: number
    height?: number

    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
}


class ImageGifNode{

    d: ImageElement
 
    constructor(imageNodeConf: imageNode){

        this.d = [
            'image',
            {
                src: imageNodeConf.src,
                alt: imageNodeConf.src ?? '',
                canResize: imageNodeConf.canResize ?? true,
                canFloat: imageNodeConf.canFloat ?? true,
                className: imageNodeConf.className ?? null,
            },
            {c: null, 
            s: {
                width: (imageNodeConf.width ?? 400) + 'px', 
                height: (imageNodeConf.height ?? 400) + 'px', 
                minWidth: (imageNodeConf.minWidth ?? 100) + 'px', 
                minHeight: (imageNodeConf.minHeight ?? 100) + 'px',
                maxWidth: '100%',
                maxHeight: '100%',
                },
            float: null
            }
        ]
    }

    setWidth(newWidth: number){
        this.d[2] = {...this.d[2], s: {...this.d[2].s, width: newWidth + 'px'}}
    }

    setHeight(newHeight: number){
        this.d[2] = {...this.d[2], s: {...this.d[2].s, height: newHeight + 'px'}}
    }

    returnActualType(){return this.d[0]}
    returnType(){return 'element'}
    returnContent(){return this.d[1].src}
    returnContentLength(){return 1}
}

export default function createImageNode(src: string){


    let initWidth = 0
    let initHeight = 0
    let sizeRatio = 1,
        minHeight = 100,
        minWidth = 100
    

    let ImageNode = new ImageGifNode({
        src: src,
    })


    const img = new Image();
    img.onload = function() {
        initWidth = img.width
        initHeight = img.height

        sizeRatio = initWidth / initHeight
        minHeight = 100
        minWidth = Math.round(minHeight * sizeRatio)

        ImageNode.setWidth(Math.round(400 * sizeRatio))
        ImageNode.d[2].s.minWidth = minWidth + 'px'
        ImageNode.d[2].s.minHeight = minHeight + 'px'

    };
    img.src = src;

    return ImageNode
}

export const renderImageNode = () => {

}