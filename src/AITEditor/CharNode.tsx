
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

    returnActualType(){return this.d[0]}
    returnType(){return 'text'}
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
        className?: string | null
    },
    {c: null, s: {height: string, width: string, [K: string]: string}}
]


export class ImageGifNode{

    d: ImageElement

    


    constructor(src: string){

        this.d = [
            'image',
            {
                src: src,
                alt: '',
                className: null,
            },
            {c: null, s: {width: '500px', height: '500px'}}
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
