import React from 'react'

import BlockNode from './BlockNode'
import SearchUtils from './SearchUtils'

export type CharStyleArr = {c: string | null}
type TextNodeData = [ElementType, string, Array<string>, CharStyleArr]

type ElementType = 'image' | 'horizontal-rule' | 'text'

export default class TextNode{

    d: TextNodeData

    // PT - plain text
    // SA - inline style array
    // CR - char range in block

    //`Hello world ${Math.random().toString(36).slice(4, 9)} `

    constructor(PT?: string, SA?: Array<string>){
        this.d = ['text', PT ?? '', SA ?? [], {c: null}]
    }

    prepareStyles(){
        let StylesArr: CharStyleArr = {c: null}
        let SingleClass = ''
        this.d[2].forEach(Style => {
            let currentStyle = SearchUtils.findStyle(Style)
            if(currentStyle.class !== undefined){
                SingleClass += `${currentStyle.class} `
            }
        })
        if(SingleClass !== ''){
            StylesArr.c = SingleClass !== '' ? SingleClass : null
        }
        this.d[3] = StylesArr
    }

    returnType(){return this.d[0]}
    returnContent(){return this.d[1]}
    returnContentLength(){return this.d[1].length}

    getSliceContent(startFromZero: boolean = true, start: number, end?: number){
        if(end) return this.d[1].slice(start, end)
        else if(startFromZero === true) return this.d[1].slice(0, start)
        else return this.d[1].slice(start)
    }
}

type ImageElement = [
    ElementType,
    {
        src: string,
        alt: string
        className?: string
    }
]


export class ImageGifNode{

    d: ImageElement

    constructor(src: string){
        this.d = [
            'image',
            {
                src: src,
                alt: '',
                className: 'image__test__fixed',
            }
        ]
    }
    returnType(){return 'element'}
    returnContent(){return this.d[1].src}
    returnContentLength(){return 1}
}
