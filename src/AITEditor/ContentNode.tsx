import React from 'react'

import BlockNode, {HorizontalRuleNode} from './BlockNode'
import {SelectionState, SelectionStateData} from './SelectionUtils'
import {BREAK_LINE} from './ConstVariables'
import TextNode from './CharNode'

import ValidationUtils from './ValidationUtils'


export default class ContentNode{

    blocksLength: () => number
    blocks: Array<any> //Array<BlockNode | HorizontalRuleNode>

    constructor(){
        this.blocksLength = () => {return this.blocks.length}
        this.blocks = [
            new BlockNode([new TextNode()]),
            new HorizontalRuleNode(), 
            new BlockNode(), 
            new HorizontalRuleNode(), 
            new BlockNode([new TextNode()]),
            new HorizontalRuleNode(),
            new BlockNode(), 
            new HorizontalRuleNode()

        ]
    }


    moveSelectionToNextSibling(selectionState: SelectionState, step?: number){

        let blockIndex = selectionState.focusKey
        let focusChar = selectionState.focusCharKey + 1
        
        let FocusBlock = this.blocks[selectionState.focusKey]
        let nextNode = FocusBlock.CharData[focusChar]
        if(nextNode === undefined){
            while(nextNode === undefined){
                blockIndex += 1
                FocusBlock = this.blocks[blockIndex]
                if(FocusBlock === undefined) break;
                if(FocusBlock.getType() === 'standart'){
                    nextNode += FocusBlock[0]
                }
                else blockIndex += 1
            }
        }
        if(nextNode !== undefined){
            let SelectionDataCopy = selectionState.$getDataCopy()

            let anchorOffset = step ? (nextNode.returnContentLength() < step ? nextNode.returnContentLength() : step) : 0

            SelectionDataCopy.focusKey = SelectionDataCopy.focusKey

            SelectionDataCopy._anchorNode = selectionState.focusCharKey + 1
            SelectionDataCopy._focusNode = selectionState.focusCharKey + 1

            SelectionDataCopy.anchorOffset = anchorOffset
            SelectionDataCopy.focusOffset = anchorOffset

            selectionState.anchorCharKey = selectionState.focusCharKey + 1
            selectionState.focusCharKey = selectionState.focusCharKey + 1

            SelectionDataCopy.anchorType = 'text'
            SelectionDataCopy.focusType = 'text'

            SelectionDataCopy.isDirty = true
        
            return SelectionDataCopy
        }
    }

    moveSelectionToPreviousSibling(selectionState: SelectionState){

        let blockIndex = selectionState.anchorKey
        let focusChar = selectionState.anchorCharKey - 1

        let currentBlock = this.blocks[selectionState.anchorKey]
        let nextNode = currentBlock.CharData[focusChar]
        let LastCharOffset = null


        if(nextNode === undefined){
            while(nextNode === undefined){
                blockIndex -= 1
                currentBlock = this.blocks[blockIndex]
                if(currentBlock === undefined) break;
                if(currentBlock.getType() === 'standart'){
                    nextNode = currentBlock.CharData[currentBlock.lastNodeIndex()]
                    focusChar = currentBlock.lastNodeIndex()
                    break;
                }
            }
        }
        if(nextNode !== undefined){

            let SelectionDataCopy = selectionState.$getDataCopy()

            SelectionDataCopy.anchorKey = blockIndex
            SelectionDataCopy.focusKey = blockIndex

            SelectionDataCopy._anchorNode = focusChar
            SelectionDataCopy._focusNode = focusChar

            SelectionDataCopy.anchorOffset = nextNode.returnContentLength()
            SelectionDataCopy.focusOffset = nextNode.returnContentLength()

            SelectionDataCopy.anchorCharKey = focusChar
            SelectionDataCopy.focusCharKey = focusChar

            SelectionDataCopy.anchorType = nextNode.returnType() !== 'text' ? 'element' : 'text'
            SelectionDataCopy.focusType = SelectionDataCopy.anchorType

            SelectionDataCopy.isDirty = true
        
            console.log(SelectionDataCopy)
            return SelectionDataCopy
        }
    }

    TextNodeSlice(char: TextNode, CharToInsert: string = '', start: number, end?: number){
        if(start === -1){
            char.d[1] = char.d[1] + CharToInsert
        }
        else if(end !== undefined && end !== -1){
            char.d[1] = char.d[1].slice(0, start) + CharToInsert + char.d[1].slice(end)
        }
        else if(end === -1){
            char.d[1] = char.d[1].slice(start) + CharToInsert
        }
        else{
            char.d[1] = char.d[1].slice(0, start) + CharToInsert
        }
    }

    MergeBlocks(FBindex: number, SBindex: number): void{
        let connectingBlock = this.blocks[FBindex]
        let joiningBlock = this.blocks[SBindex]

        connectingBlock.CharData = [...connectingBlock.CharData, ...joiningBlock.CharData]
        connectingBlock.blockUpdate()
        this.blocks.splice(SBindex, 1)
    }


    MergeWithUpdate(selectionState: SelectionState, direction: 'up' | 'down', joiningDirection: 'left' | 'right'): void{
        

        let AnchorIndex = 0
        let LastInConnectingChar = undefined
        let anchorCharKey = 0
        let newAnchorOffset = 0
        let ConnectingLength = 0

        if(joiningDirection === 'left'){
            let joiningBlock = joiningDirection = this.blocks[selectionState.anchorKey]

            AnchorIndex = direction === 'down' ? selectionState.anchorKey - 1: selectionState.anchorKey + 1
            let connectingBlock = this.blocks[AnchorIndex]

            ConnectingLength = connectingBlock.lastNodeIndex() + 1

            LastInConnectingChar = connectingBlock.CharData[ConnectingLength - 1]
            let AnchorJoiningChar = joiningBlock.CharData[selectionState.anchorCharKey]

            let AnchorJoiningCharLength = AnchorJoiningChar.returnContentLength()

            connectingBlock.CharData = [...connectingBlock.CharData, ...joiningBlock.CharData]
            connectingBlock.blockUpdate()
            this.blocks.splice(selectionState.anchorKey, 1)

            let updatedCharLength = LastInConnectingChar.returnContentLength()

            newAnchorOffset = (updatedCharLength - AnchorJoiningCharLength) + selectionState.anchorOffset
            newAnchorOffset = newAnchorOffset < 0 ? 1 : newAnchorOffset
            anchorCharKey = (selectionState.anchorCharKey + ConnectingLength) - 1
        }
        else{
            AnchorIndex = direction === 'down' ? selectionState.anchorKey - 1: selectionState.anchorKey + 1
            let connectingBlock = joiningDirection = this.blocks[selectionState.anchorKey]

            let joiningBlock = this.blocks[AnchorIndex]

            ConnectingLength = connectingBlock.lastNodeIndex() + 1

            LastInConnectingChar = connectingBlock.CharData[ConnectingLength - 1]

            connectingBlock.CharData = [...connectingBlock.CharData, ...joiningBlock.CharData]

            connectingBlock.blockUpdate()
            this.blocks.splice(AnchorIndex, 1)

            newAnchorOffset = selectionState.anchorOffset
            AnchorIndex -= 1
            anchorCharKey = selectionState.anchorCharKey
        }

        selectionState.focusKey = AnchorIndex
        selectionState.anchorKey = AnchorIndex

        selectionState.anchorCharKey = anchorCharKey
        selectionState.focusCharKey = selectionState.anchorCharKey

        selectionState._anchorNode = selectionState.anchorCharKey
        selectionState._focusNode = selectionState.anchorCharKey

        selectionState.anchorOffset = newAnchorOffset
        selectionState.focusOffset = newAnchorOffset

        selectionState.anchorType = LastInConnectingChar.returnType() !== 'text' ? 'element' : 'text'
        selectionState.focusType = LastInConnectingChar.returnType() !== 'text' ? 'element' : 'text'

        selectionState.isDirty = true
        selectionState.isCollapsed = true


    }

    sliceBlockFromContent(start: number, end?: number){
        this.blocks = [...this.blocks.slice(0, start), ...this.blocks.slice(end ?? start)]
    }

    insertBlockBetween(block: BlockNode, start: number, end?: number){
        if(end !== undefined){
            this.blocks = [...this.blocks.slice(0, start), block, ...this.blocks.slice(end ?? start)]
        }
        else{
            this.blocks = [...this.blocks.slice(0, start), block]
        }
    }

    insertLetterIntoBlock(KeyBoardEvent: React.KeyboardEvent, selectionState: SelectionState){

        let DirtySelectionState = null

        let Key = KeyBoardEvent.key

        let anchorBlockNode = this.blocks[selectionState.anchorKey]
        let focusBlockNode = this.blocks[selectionState.focusKey]  

        let CurrentAnchorCharData = anchorBlockNode.CharData ? anchorBlockNode.CharData[selectionState.anchorCharKey] : undefined 
        let CurrentFocusCharData = focusBlockNode.CharData ? focusBlockNode.CharData[selectionState.focusCharKey] : undefined

        if(selectionState.anchorCharKey === selectionState.focusCharKey && selectionState.anchorKey === selectionState.focusKey){

            let SliceFrom = selectionState.anchorOffset
            let SliceTo = selectionState.focusOffset

            if(ValidationUtils.isTextNode(CurrentAnchorCharData) === true){
                if(Key === ' ' && KeyBoardEvent.which === 229){
                    Key = '. '
                    SliceFrom -= 1
                }
                this.TextNodeSlice(CurrentAnchorCharData, Key, SliceFrom, SliceTo)
                if(selectionState.anchorType === 'break_line'){
                    selectionState.convertBreakLineToText()
                    selectionState.moveSelectionStraight()
                }
                else selectionState.moveSelectionStraight()
            }
            else{
                let nextNode = anchorBlockNode.nextSibling(selectionState.anchorCharKey) as TextNode
                let DirtySelectionState = undefined
                if(nextNode === undefined){
                    let nextNode = new TextNode()
                    anchorBlockNode.splitCharNode(selectionState.anchorCharKey + 1, selectionState.focusCharKey + 1, nextNode)
                    this.TextNodeSlice(nextNode, Key, 0, 0)
                    selectionState.toggleCollapse(true)
                }
                else if(ValidationUtils.isTextNode(nextNode) === true){

                    this.TextNodeSlice(nextNode, Key, 0, 0)
                    selectionState.toggleCollapse(true)
                }
                DirtySelectionState = this.moveSelectionToNextSibling(selectionState, 1)
                if(DirtySelectionState !== undefined) selectionState.insertSelectionData(DirtySelectionState)
            }
        }
        else if(selectionState.anchorKey === selectionState.focusKey){

            let BlockSplitStart = selectionState.anchorCharKey + 1
            let BlockSplitEnd = selectionState.focusCharKey


            if(ValidationUtils.isTextNode(CurrentAnchorCharData) === true){
                this.TextNodeSlice(CurrentAnchorCharData, Key, selectionState.anchorOffset)
            }
            else{
                let previousSibling = anchorBlockNode.previousSibling(selectionState.anchorCharKey)
                if(previousSibling !== undefined && ValidationUtils.isTextNode(previousSibling) === true){
                    this.TextNodeSlice(previousSibling as TextNode, Key, -1)
                }
                else anchorBlockNode.splitCharNode(BlockSplitStart, BlockSplitStart + 1, new TextNode())
                BlockSplitStart -= 1
            }

            if(ValidationUtils.isTextNode(CurrentFocusCharData) === true){
                this.TextNodeSlice(CurrentFocusCharData, '', selectionState.focusOffset, -1)
            }
            else BlockSplitEnd += 1

            anchorBlockNode.splitCharNode(BlockSplitStart, BlockSplitEnd)

            selectionState.moveSelectionStraight()
            DirtySelectionState = this.BlockUpdateWithSelection(anchorBlockNode, selectionState) ?? null
            if(DirtySelectionState !== null) selectionState.insertSelectionData(DirtySelectionState)
        }
        else if(selectionState.anchorKey !== selectionState.focusKey){

            let BlockSplitStart = selectionState.anchorCharKey + 1
            let BlockSplitEnd = selectionState.focusCharKey

            if(CurrentAnchorCharData !== undefined){
                if(ValidationUtils.isTextNode(CurrentAnchorCharData) === true){
                    this.TextNodeSlice(CurrentAnchorCharData, Key, selectionState.anchorOffset)
                }
                else{
                    let previousSibling = anchorBlockNode.previousSibling(selectionState.anchorCharKey)
                    if(previousSibling !== undefined && ValidationUtils.isTextNode(previousSibling) === true){
                        this.TextNodeSlice(previousSibling as TextNode, Key, -1)
                    }
                    else{
                        let newTextNode = new TextNode()
                        anchorBlockNode.splitCharNode(BlockSplitStart, BlockSplitStart + 1, newTextNode)
                    }
                    BlockSplitStart -= 1
                }
                anchorBlockNode.bulkRemoveCharNode(true, BlockSplitStart)
            }

            if(CurrentFocusCharData !== undefined){
                if(ValidationUtils.isTextNode(CurrentFocusCharData) === true){
                    this.TextNodeSlice(
                            CurrentFocusCharData, 
                            CurrentAnchorCharData === undefined ? Key : '', 
                            selectionState.focusOffset, 
                            -1
                        )
                }
                else{
                    BlockSplitEnd += 1
                }
                focusBlockNode.bulkRemoveCharNode(false, BlockSplitEnd)
            }

            this.sliceBlockFromContent(selectionState.anchorKey + 1, selectionState.focusKey)

            if(CurrentFocusCharData !== undefined && CurrentAnchorCharData !== undefined) {
                this.MergeWithUpdate(selectionState, 'up', 'right')
                selectionState.moveSelectionStraight()
            }
            
            else if(CurrentAnchorCharData !== undefined) selectionState.moveSelectionStraight()
            else if(CurrentFocusCharData !== undefined){
                selectionState.focusOffset = 0
                selectionState.toggleCollapse(true)
            }

        }

    }

    getTextNodeOffset(node: TextNode, offset: number){
        let TextContentLength = node.returnContentLength()
        if(offset === -1){
            offset = TextContentLength
        }
        else if(offset > TextContentLength){
            offset = TextContentLength
        }
        return offset
    }

    BlockUpdateWithSelection(BlockNode: BlockNode, selectionState: SelectionState, find?: 'first' | 'last' | 'forceLast' | undefined, update: boolean = true){

        let CharsBefore: number = 0
        let previousBlockLength = BlockNode.returnBlockLength()
        let updatedBlockLength = BlockNode.returnBlockLength()
        let CharLength: number = 0

        let offsetToFind = selectionState.anchorOffset

        let SelectionDataCopy = selectionState.$getDataCopy()

        if(find === undefined) CharsBefore = BlockNode.countToIndex(selectionState.focusCharKey - 1)
        else if(find === 'first'){
            CharsBefore = 0
            offsetToFind = 0
        }
        else if(find === 'last') CharsBefore = BlockNode.countToIndex(BlockNode.CharData.length)

        if(update === true){
            BlockNode.blockUpdate()
            updatedBlockLength = BlockNode.CharData.length
        }

        for(let CharIndex = 0; CharIndex < BlockNode.CharData.length; CharIndex++){
            let CurrentChar = BlockNode.CharData[CharIndex]
            if(ValidationUtils.isTextNode(CurrentChar)){
                CharLength += CurrentChar.returnContentLength()
            }
            else CharLength += 1
            if(CharLength >= CharsBefore || (CharIndex === 0 && CharLength >= CharsBefore)){
                SelectionDataCopy.focusKey = SelectionDataCopy.anchorKey

                SelectionDataCopy._anchorNode = CharIndex
                SelectionDataCopy._focusNode = CharIndex

                SelectionDataCopy.anchorOffset = previousBlockLength === 0 ? CharsBefore : offsetToFind 
                SelectionDataCopy.focusOffset = previousBlockLength === 0 ? CharsBefore : offsetToFind

                SelectionDataCopy.anchorCharKey = CharIndex
                SelectionDataCopy.focusCharKey = CharIndex

                SelectionDataCopy.anchorType = CurrentChar.returnType()
                SelectionDataCopy.focusType = CurrentChar.returnType()

                SelectionDataCopy.isDirty = true

                return SelectionDataCopy
                }

            }

    }
        
    removeLetterFromBlock(selectionState: SelectionState){

        let anchorBlock = this.blocks[selectionState.anchorKey]
        let focusBlock = this.blocks[selectionState.focusKey]

        let anchorCharNode = anchorBlock.CharData[selectionState.anchorCharKey]
        let focusCharNode = focusBlock.CharData[selectionState.focusCharKey]

        if(anchorCharNode === undefined && focusCharNode === undefined) return;


        if(selectionState.isCollapsed){
            if(selectionState.anchorCharKey === 0 && selectionState.anchorOffset === 0){
                if(selectionState.anchorKey !== 0){
                    let previousBlock = this.blocks[selectionState.anchorKey - 1]
                    if(previousBlock.getType() !== 'standart'){
                        this.sliceBlockFromContent(selectionState.anchorKey - 1, selectionState.anchorKey)
                        selectionState.anchorKey -= 1
                        selectionState.toggleCollapse()
                        selectionState.convertBreakLineToText()
                    }
                    else{
                        this.MergeWithUpdate(selectionState, 'down', 'left')
                    }
                }
            }
            else{

                let SliceAnchor = selectionState.anchorOffset - 1
                let SliceFocus = selectionState.focusOffset
                let anchorCharType = anchorCharNode.returnType()


                if(anchorCharType === 'element'){

                    anchorBlock.removeCharNode(selectionState.anchorCharKey)

                    let previousNode = this.moveSelectionToPreviousSibling(selectionState)
                    if(previousNode !== undefined) selectionState.insertSelectionData(previousNode)
                }
                else if(anchorCharType === 'text'){
                    anchorCharNode = anchorCharNode as TextNode
                    this.TextNodeSlice(anchorCharNode, '', SliceAnchor, SliceFocus)

                    if(anchorBlock.lastNodeIndex() > 0 && anchorCharNode.returnContent() === ''){
                        anchorBlock.CharData.splice(selectionState.anchorCharKey, 1)
                        let previousNode = this.moveSelectionToPreviousSibling(selectionState)
                        if(previousNode !== undefined) selectionState.insertSelectionData(previousNode)
                    }
                    else{
                        selectionState.anchorOffset -= 1
                        selectionState.focusOffset = selectionState.anchorOffset
                        if(anchorBlock.lastNodeIndex() === 0 && anchorCharNode.returnContentLength() === 0){
                            selectionState.isDirty = true
                        }
                    }
    
                }
            }
        }
        else{
            if(selectionState.anchorKey === selectionState.focusKey){
                if(selectionState.anchorCharKey === selectionState.focusCharKey){


                    if(ValidationUtils.isTextNode(anchorCharNode) === true){
                        anchorCharNode = anchorCharNode as TextNode

                        let SliceAnchor = selectionState.anchorOffset
                        let SliceFocus = selectionState.focusOffset
                        
                        this.TextNodeSlice(anchorCharNode, '', SliceAnchor, SliceFocus)

                        if(anchorCharNode.returnContent() === ''){
                            anchorBlock.CharData.splice(selectionState.anchorCharKey, 1)
                            let previousNode = this.moveSelectionToPreviousSibling(selectionState)
                            if(previousNode !== undefined) selectionState.insertSelectionData(previousNode)
                        }
                    }
                    else{
                        anchorBlock.CharData.splice(selectionState.anchorCharKey, 1)
                        let previousNode = this.moveSelectionToPreviousSibling(selectionState)
                        if(previousNode !== undefined) selectionState.insertSelectionData(previousNode)
                    }
                    
                }
                else if(selectionState.anchorCharKey !== selectionState.focusCharKey){
                    let SliceAnchor = selectionState.anchorOffset
                    let SliceFocus = selectionState.focusOffset

                    let CharSliceAnchor = selectionState.anchorCharKey + 1
                    let CharSliceFocus = selectionState.focusCharKey

                    if(ValidationUtils.isTextNode(anchorCharNode) === true){
                        anchorCharNode = anchorCharNode as TextNode
                        this.TextNodeSlice(anchorCharNode, '', SliceAnchor)
                        if(anchorCharNode.returnContent() === ''){
                            CharSliceAnchor -= 1
                            let previousNode = this.moveSelectionToPreviousSibling(selectionState)
                            if(previousNode !== undefined) selectionState.insertSelectionData(previousNode)
                        }
                        else {
                            selectionState.toggleCollapse()
                            selectionState.isDirty = true
                        }
                    }
                    else{
                        CharSliceFocus -= 1
                        let previousNode = this.moveSelectionToPreviousSibling(selectionState)
                        if(previousNode !== undefined) selectionState.insertSelectionData(previousNode)
                    }

                    if(ValidationUtils.isTextNode(focusCharNode) === true){
                        focusCharNode = focusCharNode as TextNode
                        this.TextNodeSlice(focusCharNode, '', SliceFocus, -1)
                        if(focusCharNode.returnContent() === '') CharSliceFocus += 1
                    }
                    else CharSliceFocus += 1


                    anchorBlock.CharData = [...anchorBlock.CharData.slice(0, CharSliceAnchor), ...anchorBlock.CharData.slice(CharSliceFocus)]
         
                }
            }
            else if(selectionState.anchorKey !== selectionState.focusKey){

                let SliceAnchor = selectionState.anchorOffset
                let SliceFocus = selectionState.focusOffset

                let BlockSliceAnchor = selectionState.anchorKey + 1
                let BlockSliceFocus =selectionState.focusKey

                let CharSliceAnchor = selectionState.anchorCharKey + 1
                let CharSliceFocus = selectionState.focusCharKey

                anchorCharNode = anchorCharNode as TextNode
                focusCharNode = focusCharNode as TextNode
                
                if(ValidationUtils.isTextNode(anchorCharNode) === true){
                    anchorCharNode = anchorCharNode as TextNode
                    this.TextNodeSlice(anchorCharNode, '', SliceAnchor)
                    if(anchorCharNode.returnContent() === ''){
                        CharSliceAnchor -= 1
                        let previousNode = this.moveSelectionToPreviousSibling(selectionState)
                        if(previousNode !== undefined) selectionState.insertSelectionData(previousNode)
                    }
                    else {
                        selectionState.toggleCollapse()
                        selectionState.isDirty = true
                    }
                }
                else{
                    CharSliceAnchor -= 1
                    let previousNode = this.moveSelectionToPreviousSibling(selectionState)
                    if(previousNode !== undefined) selectionState.insertSelectionData(previousNode)
                }

                if(ValidationUtils.isTextNode(focusCharNode) === true){
                    focusCharNode = focusCharNode as TextNode
                    this.TextNodeSlice(focusCharNode, '', SliceFocus, -1)
                    if(focusCharNode.returnContent() === '') CharSliceFocus += 1
                }
                else CharSliceFocus += 1

        
                anchorBlock.bulkRemoveCharNode(true, CharSliceAnchor)
                focusBlock.bulkRemoveCharNode(false, CharSliceFocus)

                this.sliceBlockFromContent(BlockSliceAnchor, BlockSliceFocus)


            }
        }
    }
    handleEnter(selectionState: SelectionState){


        if(
            selectionState.anchorCharKey === 0 && 
            selectionState.anchorOffset === 0 && 
            selectionState.focusOffset === 0 &&
            (selectionState.anchorNode as HTMLElement)?.tagName !== BREAK_LINE
        ){
            this.insertBlockBetween(new BlockNode(), selectionState.anchorKey, selectionState.anchorKey)
            selectionState.anchorKey += 1
            let DirtySelectionState = this.BlockUpdateWithSelection(this.blocks[selectionState.anchorKey], selectionState) ?? null
            if(DirtySelectionState !== null) selectionState.insertSelectionData(DirtySelectionState)
        }
        else{
            let CurrentBlock = this.blocks[selectionState.anchorKey]
            let anchorOffsetChar = CurrentBlock.CharData[selectionState.anchorCharKey] as TextNode

            let CharNodeSlice = selectionState.anchorCharKey

            let SlicedCharNode = undefined

            if(selectionState.anchorOffset !== 0){
                let SliceContent = anchorOffsetChar.d[1].slice(selectionState.anchorOffset)
                this.TextNodeSlice(anchorOffsetChar, '', selectionState.anchorOffset)
                CharNodeSlice += 1
                SlicedCharNode = new TextNode(SliceContent, anchorOffsetChar.d[2])
            }
            let SliceCharNodes = CurrentBlock.CharData.slice(CharNodeSlice)

            if(SlicedCharNode !== undefined){
                SliceCharNodes = [SlicedCharNode, ...SliceCharNodes]
            }

            let NewBlock = new BlockNode(SliceCharNodes, CurrentBlock.blockType)
            this.insertBlockBetween(NewBlock, selectionState.anchorKey + 1, selectionState.anchorKey + 1)

            selectionState.anchorKey += 1

            let DirtySelectionState = this.BlockUpdateWithSelection(this.blocks[selectionState.anchorKey], selectionState, 'first') ?? null
            if(DirtySelectionState !== null) selectionState.insertSelectionData(DirtySelectionState)

        }

        // ДОПИСАТЬ ЭТАП ДЛЯ ЕНТЕРА А ТАКЖЕ ВВЕСТИ КОММЕНТИРОВАНИИ ФРАГМЕНТОВ КОДА ДЛЯ ЛУЧШЕЙ НАВИГАЦИИ
        
    }
}