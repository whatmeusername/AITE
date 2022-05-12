import React, {useRef} from 'react'
import {ATEditorBlock, CharData} from './Interfaces'

import type {EditorState as editorState} from './EditorManagmentUtils'
import TextNode from './CharNode'
import type {imageNode} from './packages/AITE_Image/imageNode'
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

    function createBlockElements(blocks: Array<BlockType>){
        let BlockElements: Array<JSX.Element> = []
        blocks.forEach((block: BlockType) => {
            let currentBlockType = block.getType()
            if(currentBlockType === 'standart'){
                let CurrentBlockChildrens: any = []
                if(
                    (block as BlockNode).CharData.length === 1 && 
                    (block as BlockNode).CharData[0].returnContent() === '' && 
                    (block as BlockNode).CharData[0].returnType() === 'text')
                {
                    BlockElements.push(createBlockNode(block as BlockNode, [createBreakLine()]))
                }
                else{
                    (block as BlockNode).CharData.forEach((CharData: NodeTypes, index: number) => {
                        if(CharData.returnActualType() === 'text'){
                            CurrentBlockChildrens.push(createTextNode(CharData as TextNode))
                        }
                        else if(CharData.returnActualType() === 'image'){   
                            CurrentBlockChildrens.push(createImageNode(CharData as imageNode))
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
        return BlockElements
    }

    function createTextNode(TextNode: TextNode): JSX.Element | string{

        TextNode.prepareStyles()
        let s: ElementAttributes = {key: `Editor-block-${blockIndex}-${charIndex}`}
        if(TextNode.d[3] !== null){
            if(TextNode.d[3]?.c !== '') s['className'] = TextNode.d[3]?.c as string
        }   

        return React.createElement('span', s, [TextNode.d[1]])
    }

    function createImageNode(node: imageNode): JSX.Element | string{

        interface ImageWrapperAttr{
            key: string
            className: string
            contentEditable: false
            style?: {[K: string]: string}
        }

        interface imageAttributes{
            key: string
            alt: string,
            className: string | null | undefined
            src: string
            style?: {[K:string] : string}
        }

        let imageAttributes: imageAttributes = {
            key: `Editor-block-${blockIndex}-${charIndex}`, 
            alt: node.imageConf.alt, 
            className: node.imageConf.className,
            src: node.imageConf.src,
            style: node.imageStyle.s,
        }

        let imageActive: boolean = isActive(charIndex, blockIndex)
        let imageElements: Array<JSX.Element> = []

        const ImageWrapperAttr: ImageWrapperAttr = {
            key: `Editor-block-${blockIndex}-${charIndex}-wrapper`, 
            className: 'image-wrapper', 
            contentEditable: false,
        }

        if(imageActive === true){
            ImageWrapperAttr.className += ' AITE__image__active'
            imageElements = [...imageElements, ...BlockResizeElemets(node)]
        }

        if(node.imageStyle.float.dir !== 'none'){
            ImageWrapperAttr['style'] = {...ImageWrapperAttr.style, float: node.imageStyle.float.dir}
        }


        if(node.ContentNode.BlockNodes.length > 0){
            let captionBlockNodes = createBlockElements(node.ContentNode.BlockNodes)
            let captionWrapper = React.createElement(
                'div', 
                {
                    className: 'AITE_image_caption_wrapper',
                    contentEditable: true,
                    suppressContentEditableWarning: true,
                    'data-aite_block_content_node': true,
                },
                captionBlockNodes
            )
            imageElements = [...imageElements, captionWrapper]
        }
        

        const ImageElement = React.createElement('img', imageAttributes, null)
        return React.createElement('span', ImageWrapperAttr, [ImageElement,  imageElements])
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

    let BlockElements = createBlockElements(EditorState.contentNode.BlockNodes)
    
    return React.createElement(React.Fragment, null, BlockElements)

}
