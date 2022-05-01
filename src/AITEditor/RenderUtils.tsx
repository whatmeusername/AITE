import React from 'react'

import {blockHTML, ATEditorBlock, ATEditor, CharData, HTMLCharStyle} from './Interfaces'
import StylesUtils from './StylesUtils'
import SearchUtils from './SearchUtils'
import FormatingUtils from './FormatingUtils'

import defaultBlocks from './defaultStyles/defaultBlocks'
import defaultInlineStyles from './defaultStyles/defaultInlineStyles'




const RenderUtils = {
    GetListStyle: function(blockType: string): string{
        if(blockType === 'list-ordered-item'){
            return'ol'
        }
        else if(blockType === 'list-unordered-item'){
            return 'ul'
        }
        return ''
    },
    GetStringTag: function(currentStyle: defaultInlineStyles, blockKey?: string): Array<string> {
        let tag = currentStyle.tag
        let CurrentStyle = currentStyle.inline ?? undefined
        if(tag === ''){
            tag = 'em'
        }
        let HTMLTag = [`<${tag} ${blockKey ? `data-set-blockkey = ${blockKey}` : ''} ${CurrentStyle !== undefined ? `style = '${CurrentStyle}'` : ''}>`, `</${tag}>`]
        return HTMLTag
    },
    CreateStringTagByCustomStyle: function(blockKey: string, style: string): Array<string>{
        let HTMLTag = [`<span data-set-blockkey = ${blockKey} ${style !== '' ? `style = '${style}'` : ''}>`, `</span>`]
        return HTMLTag
    },
    getElementInlineStyle: function(Tag: string): HTMLCharStyle{
        let TagData = {style: 'STANDART', tag: 'span'}
        TagData = defaultInlineStyles.find(obj => obj.tag === Tag || obj.style === Tag) ?? TagData
        return TagData
    },
    BlockStyleWrapper: function(plainText: string, blockType: string, blockInlineStyles: Array<string>, blockKey: string, React = true){
        let blockStyle = defaultBlocks.find(block => block.type === blockType)
        
        let ClassPrefix = (React === true ? 'className' : 'class')

        let TagClass = `${ClassPrefix} = 'ATEditor__content__ATEditorBlock ATEditorBlock__wrapper'`
        let Style = StylesUtils.CollectSingleStyle(blockInlineStyles) ?? undefined
        
        if(blockStyle !== undefined){
            let WrapperStyle = `<${blockStyle.tag} ${TagClass} data-set-blockkey = ${blockKey} ${Style !== '' ? `style = '${Style}'` : ''}>${plainText}</${blockStyle.tag}>`
            return WrapperStyle
        }
        else throw new Error(`Can't apply ${blockType} block style to block, because its not defineded `)
    },
    CreateStartListNode: function(NodeTagName: string, React: boolean = false){
        let ClassTag = React ? 'className' : 'class'
        let classPrefix = 'ATEditor__content__ATEditorBlock__list ATEditorBlock__wrapper__list'
        return `<${NodeTagName} ${ClassTag} = ${classPrefix}>`
    },
    HandleListBlock: function(Block: blockHTML, previous: blockHTML | undefined, previousBlockIsList: boolean, lastBlock: boolean = false): boolean{


        let ListTagBlock = this.GetListStyle(Block.blockType)

        if(previous === undefined){
            if(ListTagBlock !== '') {
                Block.HTML = this.CreateStartListNode(ListTagBlock) + Block.HTML + (lastBlock ? `</${ListTagBlock}>` : '')
                return true
            }
        }
        else if(Block.blockType !== previous.blockType){
            if(previousBlockIsList === true) {
                let ListTag = this.GetListStyle(previous.blockType)
                if(ListTag !== ''){
                    previous.HTML = previous.HTML + `</${ListTag}>`
                }
                ListTag = this.GetListStyle(Block.blockType)
                if(ListTag !== ''){
                    Block.HTML = this.CreateStartListNode(ListTagBlock) + Block.HTML
                    return true
                }
                return false
            }
            if(previousBlockIsList === false){
                if(ListTagBlock !== ''){
                    Block.HTML = this.CreateStartListNode(ListTagBlock) + Block.HTML
                    return true
                }
            }
        }

        return ListTagBlock ? true : false
    },
    RenderEditorBlocks: function(blocks: Array<blockHTML>){

        let previousBlock: blockHTML | undefined  = undefined
        let previousBlockIsList = false

        let ConcatedBlocks = ''
        let blocksLength = blocks.length


        blocks.map((block: blockHTML, index: number) => {
            block.HTML = this.BlockStyleWrapper(block.HTML, block.blockType, block.blockInlineStyles, block.blockKey)
            previousBlockIsList = this.HandleListBlock(block, previousBlock, previousBlockIsList, index === blocksLength - 1 ? true : false)
            previousBlock = block
        })

        blocks.forEach((block) => {
            ConcatedBlocks += block.HTML
        })

        //let ParsedHTML = HTMLReactParser(ConcatedBlocks)

        // return(
        //     ParsedHTML
        // )
    },
    CollectSingleStyleTag: function(CharData: CharData, blockKey: string){
        let CustomStylesInline = ''
        let CollectedStyle = [CharData[0].replaceAll(' ', '&nbsp')]
        CharData[1].forEach(Style => {
            let currentStyle = SearchUtils.findStyle(Style)
            if(currentStyle.inline !== undefined && currentStyle.inline !== '') CustomStylesInline += currentStyle.inline + '; '
            else{
                let HTMLtag = this.GetStringTag(currentStyle, blockKey)
                CollectedStyle = [HTMLtag[0], ...CollectedStyle, HTMLtag[1]]
            }
        })
        if(CustomStylesInline !== ''){
            let CustomStyle = this.CreateStringTagByCustomStyle(blockKey, CustomStylesInline)
            CollectedStyle = [CustomStyle[0], ...CollectedStyle, CustomStyle[1]]
        }

        return CollectedStyle.join('')
    },
    ApplyFragmentStyle: function(Block: ATEditorBlock){
        let HTMLstorage: any = []
        let previousStyle: CharData | undefined = undefined
        let blockKey: string = Block.blockKey

        Block.CharData.forEach((CurrentData: CharData, index: number) => {
            let CollectedStyle = this.CollectSingleStyleTag(CurrentData, blockKey)
            HTMLstorage.push(CollectedStyle)
            previousStyle = CurrentData
        })

        HTMLstorage = HTMLstorage.join('')
        return HTMLstorage
    },
    
    ApplyStylesToText: function(State: ATEditor): Array<blockHTML> {
        if(State === undefined) return [];
        let AllBlocks: Array<blockHTML> = []
        State.blocks.forEach((block: ATEditorBlock) => {
            let FullHTML = ''
            if(block.CharData.length > 0){
                let BlockHTML = this.ApplyFragmentStyle(block) ?? ''    
                FullHTML += BlockHTML
            }
            else FullHTML = "<br data-blockSeparator = 'true'/>"
            AllBlocks.push({blockKey: block.blockKey, blockType: block.blockStyle, blockInlineStyles: block.blockInlineStyles ,HTML: FullHTML})
        })
        return AllBlocks
    }
}


export default RenderUtils