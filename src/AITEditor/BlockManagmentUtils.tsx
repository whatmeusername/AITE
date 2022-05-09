import React, {useRef} from 'react'
import {ATEditorBlock, CharData} from './Interfaces'

import type {EditorState as editorState} from './EditorManagmentUtils'
import TextNode, {ImageGifNode} from './CharNode'
import BlockNode, {NodeTypes, BlockType} from './BlockNode'

import BlockResizeElemets from './imageNodeActiveElements'


function createReactStyle(style: string){ // eslint-disable-line
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

type StartsWith<T extends string, U extends string> = T extends `${U}${string}`
  ? T
  : never;

export function CreateReactEditor({EditorState}: {EditorState: editorState}){
    let BlockElements: any = []
    let blockIndex = 0
    let charIndex = 0

    type ElementAttributes = {
        key: string
        className?: string
        style?: {[K: string]: string}
        src?: string
        alt?: string
    }

    function isActive(charIndex: number, blockIndex: number): boolean {
        let EditorActiveElement = EditorState.EditorActiveElementState
        if(
            EditorActiveElement?.charNode === charIndex && 
            EditorActiveElement?.blockNode === blockIndex
        ) return true
        return false
    }

    function createTextNode(TextNode: TextNode): JSX.Element | string{

        TextNode.prepareStyles()
        let s: ElementAttributes = {key: `Editor-block-${blockIndex}-${charIndex}`}
        if(TextNode.d[3] !== null){
            if(TextNode.d[3]?.c !== '') s['className'] = TextNode.d[3]?.c as string
        }   

        return React.createElement('span', s, [TextNode.d[1]])
    }

    function createImageNode(node: ImageGifNode): JSX.Element | string{

        let imageAttributes = {
            key: `Editor-block-${blockIndex}-${charIndex}`, 
            alt: node.d[1].alt, 
            className: node.d[1].className,
            src: node.d[1].src,
            style: node.d[2].s,
        }

        let imageActive: boolean = isActive(charIndex, blockIndex)

        if(imageActive === true){
            imageAttributes.className += ' AITE__image__active'
        }

        const ImageWrapperAttr = {
            key: `Editor-block-${blockIndex}-${charIndex}-wrapper`, 
            className: 'image-wrapper', 
            contentEditable: false
        }

        const ImageElement = React.createElement('img', imageAttributes, null)
        return React.createElement('span', ImageWrapperAttr, [ImageElement,  imageActive ? BlockResizeElemets(node) : null])
    }

    function createHorizontalRule(): JSX.Element{
        let className = 'ATE_editor_horizontal-rule'
        let HorizontalRuleElement = React.createElement('hr', {className: className}, null)
        const a = {
            key: `Editor-block-${blockIndex}-${charIndex}`, 
            contentEditable: false}
        return React.createElement('div', a, HorizontalRuleElement)
    }

    function createBreakLine(){
        const a = {key: `Editor-block-${blockIndex}-${charIndex}`}
        return React.createElement('br', a)
    }

    function createEmptyNode(){
        const a = {key: `Editor-block-${blockIndex}-${charIndex}`}
        return React.createElement('span', a)
    }

    type BlockParameters = {
        key: string
        'data-aite_block_node': boolean
        className?: string
    }

    function createBlockNode(node: BlockNode, childrens: Array<JSX.Element>): JSX.Element{
        let BlockWrapper = node.prepareBlockStyle()
        let s: BlockParameters = {
            key: `Editor-block-${blockIndex}-${charIndex}`,
            'data-aite_block_node': true,
        }
        
        if(BlockWrapper.c !== null){
            s['className'] = ''
            s.className += BlockWrapper.c
        }

        return React.createElement(BlockWrapper.n, s, childrens)
    }


    EditorState.contentNode.blocks.forEach((block: BlockType) => {

        let currentBlockType = block.getType()
        if(currentBlockType === 'standart'){
            let CurrentBlockChildrens: any = []
            if((block as BlockNode).CharData.length === 1 && (block as BlockNode).CharData[0].d[1] === ''){
                BlockElements.push(createBlockNode(block as BlockNode, [createBreakLine()]))
            }
            else{
                (block as BlockNode).CharData.forEach((CharData: NodeTypes, index: number) => {
                    if(CharData.returnActualType() === 'text'){
                        CurrentBlockChildrens.push(createTextNode(CharData as TextNode))
                    }
                    else if(CharData.returnActualType() === 'image'){   
                        CurrentBlockChildrens.push(createImageNode(CharData as ImageGifNode))
                    }
                    charIndex += 1
            })
                BlockElements.push(createBlockNode((block as BlockNode), CurrentBlockChildrens))
                charIndex = 0
            }
        }
        else if(currentBlockType === 'horizontal-rule'){
            BlockElements.push(createHorizontalRule())
        }
        blockIndex += 1
    })
    
    return React.createElement(React.Fragment, null, BlockElements)

}
