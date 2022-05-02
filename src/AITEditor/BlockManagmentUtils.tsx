import React from 'react'
import {ATEditorBlock, CharData} from './Interfaces'

import ContentNode from './ContentNode'
import CharNode, {CharStyleArr, ImageGifNode} from './CharNode'
import BlockNode, {NodeTypes} from './BlockNode'




function createReactStyle(style: string){
    let spiletedStyle = style.split(':')
    if(spiletedStyle.length > 2 || spiletedStyle.length < 2) return;
    let spiletedPrefix = spiletedStyle[0].split('-') 
    spiletedPrefix.forEach((style: string, index: number) => {
        if(index !== 0){
            spiletedPrefix[index] = style.replace(/^\w/, (c) => c.toUpperCase());
        }
    })
    return {[spiletedPrefix.join('')]: spiletedStyle[1].trim()}
}

export function createReactEditor(ContentNode: ContentNode){
    let BlockElements: any = []
    let count = 0

    type ElementAttributes = {
        key: string
        className?: string
    }

    let t = performance.now()

    function createTextNode(PlainText: string, charStyles: CharStyleArr | null): JSX.Element | string{
        let s: ElementAttributes = {key: `Editor-block-${count}`}
        if(charStyles !== null){
            if(charStyles?.c !== '') s['className'] = charStyles?.c as string
        }   

        return React.createElement('span', s, [PlainText])
    }

    function createImageNode(node: ImageGifNode): JSX.Element | string{
        let s: ElementAttributes = {key: `Editor-block-${count}`}
        return React.createElement('img', {...s, ...node.d[1]}, null)
    }

    ContentNode.blocks.forEach((block: BlockNode) => {
        let currentBlockType = block.getType()
        count += 1
        if(currentBlockType === 'standart'){
            let CurrentBlockChildrens: any = []
            if(block.CharData.length === 1 && block.CharData[0].d[1] === ''){
                let BreakLineNode = React.createElement('br', {key: `Editor-block-${count}`})
                BlockElements.push(React.createElement('div', {key: `Editor-block-${count}`}, [BreakLineNode]))
            }
            else{
                    block.CharData.forEach((CharData: NodeTypes) => {
                        count += 1
                        if(CharData.d[0] === 'text'){
                            CharData = CharData as CharNode
                            CharData.prepareStyles()
                            CurrentBlockChildrens.push(createTextNode(CharData.d[1], CharData.d[3]))
                        }
                        else if(CharData.d[0] === 'image'){
                            let ImageElement = createImageNode(CharData as ImageGifNode)
                            let WrapperElement = React.createElement('span', {key: `Editor-block-${count}`}, [ImageElement])
                            CurrentBlockChildrens.push(WrapperElement)
                        }
                })
                BlockElements.push(React.createElement('div', {key: `Editor-block-${count}`}, CurrentBlockChildrens))
            }
        }
        else if(currentBlockType === 'horizontal-rule'){
            let className = 'ATE_editor_horizontal-rule'
            let HorizontalRuleElement = React.createElement('hr', {className: className}, null)
            BlockElements.push(React.createElement('div', {key: `Editor-block-${count}`}, HorizontalRuleElement))
        }
    
    })
    
    return React.createElement(React.Fragment, null, BlockElements)

}


const BlockManagmentUtils = {
    ConcatTwoBlocks: function(Block1: ATEditorBlock, Block2: ATEditorBlock): void{
        Block1.CharData = [...Block1.CharData, ...Block2.CharData]
        BlockManagmentUtils.EntireBlockUpdate(Block1)
    },
    EntireBlockUpdate: function(block: ATEditorBlock){
        let CharIndex = 0
        block.plainText = ''
        block.blockLength = 0
        
        let CopiedCharData = JSON.parse(JSON.stringify(block.CharData))
        let NewStyles: Array<CharData> = []

        CopiedCharData.forEach((CharData: CharData, index: number) => {
            let CharLength = CharData[0].length
            if(CharData[0] !== '' || CharLength !== 0){
                CharData[2] = [CharIndex, CharIndex += CharLength] 
                block.plainText += CharData[0]
                block.blockLength += CharLength

                NewStyles.push(CharData)
                
            }
        })
        block.CharData = NewStyles
    },
    CreateEmptyCharData: function(): CharData{
        return ['', [], [0, 0]]
    },
    createCharactersList: function(String: string, Compact: boolean = false){
        let charactersList: Array<CharData>  = []
        // if(Compact === false){
        //     [...String].forEach((c, index) => {
        //         charactersList.push([c, ['BOLD', 'ITALIC'], [index]])
        //     })
        //     return(charactersList)
        // }
        // else{
        //     charactersList.push([String, [], [0, String.length]])
        //     return(charactersList)
        // }
        charactersList.push([String, [], [0, String.length]])
        return(charactersList)

    },
    GetPlainTextFromCharData: function(CharData: Array<CharData>): string{
        let plainText = ''
        CharData.forEach(obj => plainText += obj[0])
        return plainText
    },
    GenerateBlockKey: function(){
        return Math.random().toString(32).split('.')[1].slice(0, 12)
    },
    CreateBlock: function(PlainText: string | undefined = 'Hello world', CharData?: Array<CharData>, blockStyle?: string): ATEditorBlock{


        let newBlock = (
            {
                blockKey: this.GenerateBlockKey(),
                blockLength: PlainText?.length ?? 0,
                plainText: CharData ? this.GetPlainTextFromCharData(CharData) : (PlainText !== ''  ? PlainText : ''),
                blockStyle: blockStyle ?? 'unstyled',
                blockInlineStyles: [],
                CharOffset: 0,
                CharData:   CharData ?? (PlainText !== '' ? this.createCharactersList(PlainText, true) : [['', [], [0, 0]]])
            
            }
        )
        return newBlock
    },
}

export {BlockManagmentUtils}