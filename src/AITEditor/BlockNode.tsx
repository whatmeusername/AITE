
import defaultBlocks from './defaultStyles/defaultBlocks'


import TextNode from './CharNode'
import type {imageNode} from './packages/AITE_Image/imageNode'
import {SelectionState} from './SelectionUtils'
import {ClassVariables} from './Interfaces'

export type NodeTypes = TextNode | imageNode
export type BlockNodeData = Array<NodeTypes>
export type BlockTypes = 'standart' | 'horizontal-rule'
export type BlockType = BlockNode | HorizontalRuleNode

type ContentNodeVariables = ClassVariables<BlockNode>
interface findNodeOffsetData{
    offsetKey: number 
    letterIndex: number
}


export default class BlockNode{

    blockType: BlockTypes
    plainText: string
    blockWrapper: string
    blockInlineStyles: Array<string>
    CharData: BlockNodeData

    constructor(initData?: ContentNodeVariables){
        this.blockType = initData?.blockType ?? 'standart'
        this.plainText = initData?.plainText ?? '' 
        this.blockWrapper = initData?.blockWrapper ?? 'unstyled'
        this.blockInlineStyles = initData?.blockInlineStyles ?? []
        this.CharData = initData?.CharData ?? [] 

    }

    prepareBlockStyle(){
        type data = {n: string, c: null | string}
        let BlockNodeData: data = {n: 'div', c: null}
        let blockWrapper = defaultBlocks.find(obj => obj.type === this.blockWrapper)
        if(blockWrapper !== undefined){
            BlockNodeData.n = blockWrapper.tag
            BlockNodeData.c = blockWrapper.class ? blockWrapper.class : null
        }
        return BlockNodeData
        

    }

    swapCharPosition(FirPosition: number, SecPosition: number){
        let CharP1 = this.CharData[FirPosition]
        this.CharData[FirPosition] = this.CharData[SecPosition]
        this.CharData[SecPosition] = CharP1
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
        let previousBlockLength = NewData.length

        const ConcatIfEqual = (CharData: BlockNodeData): BlockNodeData => {
            let NewData: BlockNodeData = []
            for(let CharIndex = 0; CharIndex < CharData.length; CharIndex++){
                let currentNode = CharData[CharIndex] as TextNode
                let nextNode = CharData[CharIndex + 1] as TextNode
                if(
                    nextNode !== undefined && 
                    currentNode.returnType() === 'text' && 
                    nextNode.returnType() === 'text' &&
                    this.CharStylesEqual(currentNode, nextNode)
                    ){
                    currentNode.d[1] += nextNode.d[1]
                    NewData.push(currentNode)
                    CharData.splice(CharIndex, 1)
                }
                else{
                    NewData.push(currentNode)
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

    findNodeByOffset(offset: number): findNodeOffsetData{
        let data: findNodeOffsetData = {offsetKey: 0, letterIndex: 0}
        let letterCount = 0
        for(let i = 0; i < this.CharData.length; i++){
            let currentLetterCount = this.CharData[i].returnContentLength()
            letterCount += currentLetterCount
            if(letterCount >= offset){
                data.offsetKey = i
                data.letterIndex = currentLetterCount - (letterCount - offset)
                return data
            }
        }
        return data
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

    findCharByIndex(index: number){
        return this.CharData[index]
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