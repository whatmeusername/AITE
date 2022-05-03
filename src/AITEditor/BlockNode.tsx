import React from 'react'

import TextNode, {ImageGifNode} from './CharNode'
import {SelectionState} from './SelectionUtils'

export type NodeTypes = TextNode | ImageGifNode
export type BlockNodeData = Array<NodeTypes>
export type BlockTypes = 'standart' | 'horizontal-rule'

export default class BlockNode{

    blockType: BlockTypes
    plainText: string
    blockWrapper: string
    blockInlineStyles: Array<[Array<string>, Array<string>]>
    CharData: BlockNodeData

    constructor(CharNodes?: BlockNodeData, blockWrapper?: string){
        this.blockType = 'standart'
        this.plainText = '' 
        this.blockWrapper = blockWrapper ?? 'unstyled'
        this.blockInlineStyles = []
        this.CharData =  CharNodes ?? [
            new TextNode('Государственное бюджетное профессиональное образовательное учреждение города Москвы "Московский колледж управления, гостиничного бизнеса и информационных технологий "Царицыно"'), 
            new ImageGifNode('https://i.ytimg.com/vi/sr4xiL4HObg/maxresdefault.jpg'),
        ] 
    }

    FullSelected(selectionState: SelectionState): boolean {
        if(
            selectionState.anchorCharKey === 0 && 
            selectionState.anchorOffset === 0 &&
            selectionState.focusCharKey === this.lastNodeIndex() && 
            selectionState.focusOffset === this.CharData[this.lastNodeIndex()].returnContentLength()
        ) return true
        else return false
    }

    returnBlockLength(){
        return this.CharData.length
    }
    replaceNode(index: number, newNode: NodeTypes){
        this.CharData[index] = newNode
    }

    removeCharNode(indexChar: number){
        this.CharData.splice(indexChar, 1)
    }

    bulkRemoveCharNode(startFromZero: boolean = true, start: number, end?: number){
        if(end === undefined){
            if(startFromZero === false) this.CharData = this.CharData.slice(start)
            else if(startFromZero === true) this.CharData = this.CharData.slice(0, start)
        }
        else if(end !== undefined){
            this.CharData = this.CharData.slice(start, end)
        }
    }

    splitCharNode(startFromZero: boolean = true, start: number, end?: number, node?: NodeTypes){
        let StartSlice = startFromZero === true ? this.CharData.slice(0, start) : this.CharData.slice(start)
        let EndSlice = end ? this.CharData.slice(end) : []
        if(node === undefined) this.CharData = [...StartSlice, ...EndSlice]
        else this.CharData = [...StartSlice, node, ...EndSlice]
    }

    CharStylesEqual(C1: TextNode, C2: TextNode): boolean{
        let CharData1 = C1.d
        let CharData2 = C2.d

        let CDLength1 = CharData1[2].length
        let CDLength2 = CharData2[2].length

        if(CDLength1 === 0 && CDLength2 === 0){
            return true
        }
        else{
            for(let style of CharData1[2]){
                if(!CharData2.includes(style)){
                    return false
                }
            }
            return true
        }
    }

    blockUpdate(){

        let NewData: BlockNodeData = this.CharData
        let hasChange = false
        let previousBlockLength = NewData.length

        const ConcatIfEqual = (CharData: BlockNodeData): BlockNodeData => {
            let NewData: BlockNodeData = []
            for(let CharIndex = 0; CharIndex < CharData.length; CharIndex++){
                if(CharData[CharIndex + 1] !== undefined && CharData[CharIndex + 1].d[0] === 'text' && CharData[CharIndex].d[0] === 'text'){
                    let StyleIsEqyal = this.CharStylesEqual(CharData[CharIndex] as TextNode, CharData[CharIndex + 1] as TextNode)
                    if(StyleIsEqyal === true){
                        CharData[CharIndex].d[1] += (CharData[CharIndex + 1] as TextNode).d[1]
                        NewData.push(CharData[CharIndex])
                        CharData.splice(CharIndex, 1)
                        hasChange = true
                    }
                }
                else{
                    NewData.push(CharData[CharIndex])
                }
            }
            return NewData
        }
        while(true){
            NewData = ConcatIfEqual(NewData)
            if(NewData.length !== previousBlockLength){
                previousBlockLength = NewData.length
            }
            else {
                this.CharData = NewData
                break
            }
        }
    }

    countToIndex(index: number): number {
        let Count = 0
        index = index < 0 ? 0 : index
        

        for(let CharIndex = 0; CharIndex < this.CharData.length; CharIndex++) {
            if(CharIndex !== index){
                let CurrentElement = this.CharData[CharIndex]
                Count += CurrentElement.returnContentLength()
            }
            else return Count
        }
        return Count
    }

    lastNodeIndex(){
        return this.CharData.length - 1
    } 

    nextSibling(index: number): NodeTypes | undefined {
        let nextSibling = this.CharData[index + 1]
        if(nextSibling !== undefined) return nextSibling
        else return undefined
    }
    previousSibling(index: number): NodeTypes | undefined{
        let previousSibling = this.CharData[index - 1]
        if(previousSibling !== undefined) return previousSibling
        else return undefined
    }

    getNodeByIndex(index: number){
        return this.CharData[index]
    }

    getType(){
        return this.blockType
    }


}

export class HorizontalRuleNode{
    blockType: BlockTypes
    blockInlineStyles: Array<[Array<string>, Array<string>]>

    constructor(){
        this.blockType = 'horizontal-rule'
        this.blockInlineStyles = []
    }

    getType(){
        return this.blockType
    }
}