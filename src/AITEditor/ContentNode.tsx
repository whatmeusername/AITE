import React from 'react'

import BlockNode, {HorizontalRuleNode} from './BlockNode'
import {SelectionState} from './SelectionUtils'
import {BREAK_LINE} from './ConstVariables'
import TextNode from './CharNode'
import createImageNode from './packages/AITE_Image/imageNode'

import ValidationUtils from './ValidationUtils'
import {BlockType} from './BlockNode'

export default class ContentNode{

    blocksLength: () => number
    blocks: Array<BlockNode | HorizontalRuleNode>

    constructor(){
        this.blocksLength = () => {return this.blocks.length}
        this.blocks = [
            new BlockNode(
                {
                    CharData: [new TextNode('Рецепт салата цезаря')],
                    blockWrapper: 'header-two'
                }
                ),
            new HorizontalRuleNode(), 
            new BlockNode({
                blockWrapper: 'blockquote',
                CharData: [new TextNode(`«Цезарь» (англ. Caesar salad) — популярный салат, одно из самых известных блюд североамериканской кухни. В классической версии основными ингредиентами салата являются пшеничные крутоны, листья салата-ромэн и тёртый пармезан, заправленныеособым соусом, который и составляет суть рецепта.`)]
            }), 
            new BlockNode(
                {CharData: [
                    createImageNode('https://history-doc.ru/wp-content/uploads/2021/12/1617250551_50-p-salat-tsezar-s-kuritsei-klassicheskii-kras-55.jpg'),
                    createImageNode('https://history-doc.ru/wp-content/uploads/2021/12/1617250551_50-p-salat-tsezar-s-kuritsei-klassicheskii-kras-55.jpg'),
                    new TextNode(`Салат получил название не по имени Гая Юлия Цезаря, а по имени человека, наиболее часто называемого автором этого блюда — американского повара итальянского происхождения Цезаря Кардини (Caesar Cardini  (англ.)рус.), который в 20-40-х годах XX века владел несколькими ресторанами в городеТихуане, находящемся на территории Мексики (поскольку от Сан-Диего Тихуану отделяет только граница, такое выгодное положение позволяло Кардини избегать ограничений Сухого закона). По легенде, салат был изобретён Кардини 4 июля 1924 года (в День независимости США), когда на кухне почти ничего не осталось, а посетители требовали пищи. В 1953 году салат «Цезарь» отмечен Эпикурейским обществом в Париже как «лучший рецепт, появившийся в Америке за последние 50 лет»`, ['ITALIC']), 
                    new TextNode(`Салат получил название не по имени Гая Юлия Цезаря, а по имени человека, наиболее часто называемого автором этого блюда — американского повара итальянского происхождения Цезаря Кардини (Caesar Cardini  (англ.)рус.), который в 20-40-х годах XX века владел несколькими ресторанами в городеТихуане, находящемся на территории Мексики (поскольку от Сан-Диего Тихуану отделяет только граница, такое выгодное положение позволяло Кардини избегать ограничений Сухого закона). По легенде, салат был изобретён Кардини 4 июля 1924 года (в День независимости США), когда на кухне почти ничего не осталось, а посетители требовали пищи. В 1953 году салат «Цезарь» отмечен Эпикурейским обществом в Париже как «лучший рецепт, появившийся в Америке за последние 50 лет»`, ['ITALIC']),
                    createImageNode('https://history-doc.ru/wp-content/uploads/2021/12/1617250551_50-p-salat-tsezar-s-kuritsei-klassicheskii-kras-55.jpg'),
                    new TextNode(`Салат получил название не по имени Гая Юлия Цезаря, а по имени человека, наиболее часто называемого автором этого блюда — американского повара итальянского происхождения Цезаря Кардини (Caesar Cardini  (англ.)рус.), который в 20-40-х годах XX века владел несколькими ресторанами в городеТихуане, находящемся на территории Мексики (поскольку от Сан-Диего Тихуану отделяет только граница, такое выгодное положение позволяло Кардини избегать ограничений Сухого закона). По легенде, салат был изобретён Кардини 4 июля 1924 года (в День независимости США), когда на кухне почти ничего не осталось, а посетители требовали пищи. В 1953 году салат «Цезарь» отмечен Эпикурейским обществом в Париже как «лучший рецепт, появившийся в Америке за последние 50 лет»`, ['ITALIC']),
                ]}
            ),
            new HorizontalRuleNode()

        ]
    }


    findBlockByIndex(index: number){
        return this.blocks[index]
    }


    moveSelectionToNextSibling(selectionState: SelectionState, step?: number){

        let blockIndex = selectionState.focusKey
        let focusChar = selectionState.focusCharKey + 1
        
        let FocusBlock = this.blocks[selectionState.focusKey] as BlockType
        let nextNode = (FocusBlock as BlockNode).CharData[focusChar] ?? undefined 

        if(nextNode === undefined){
            while(nextNode === undefined){
                blockIndex += 1
                FocusBlock = this.blocks[blockIndex]
                if(FocusBlock === undefined) break;
                else if(FocusBlock.getType() === 'standart'){
                    nextNode = (FocusBlock as BlockNode).CharData[0]
                    focusChar = 0
                    break;
                }
            }
        }
        if(nextNode !== undefined){
            let SelectionDataCopy = selectionState.$getDataCopy()

            let anchorOffset = step !== undefined ? (nextNode.returnContentLength() < step ? nextNode.returnContentLength() : step) : 0

            SelectionDataCopy.anchorKey = blockIndex
            SelectionDataCopy.focusKey = blockIndex

            SelectionDataCopy._anchorNode = focusChar
            SelectionDataCopy._focusNode = focusChar

            SelectionDataCopy.anchorOffset = anchorOffset
            SelectionDataCopy.focusOffset = anchorOffset

            SelectionDataCopy.anchorCharKey = focusChar
            SelectionDataCopy.focusCharKey = focusChar

            SelectionDataCopy.anchorType = nextNode.returnType()
            SelectionDataCopy.focusType = nextNode.returnType()

            SelectionDataCopy.isDirty = true
        
            return SelectionDataCopy
        }
    }

    moveSelectionToPreviousSibling(selectionState: SelectionState){

        let blockIndex = selectionState.anchorKey
        let acnhorChar = selectionState.anchorCharKey - 1

        let anchorBlock = this.blocks[selectionState.anchorKey]
        let nextNode = acnhorChar > -1 ? (anchorBlock as BlockNode).CharData[acnhorChar] : undefined

        if(nextNode === undefined){
            while(nextNode === undefined){
                blockIndex -= 1
                anchorBlock = this.blocks[blockIndex]
                if(anchorBlock === undefined) break;
                if(anchorBlock.getType() === 'standart'){
                    nextNode = (anchorBlock as BlockNode).CharData[(anchorBlock as BlockNode).lastNodeIndex()]
                    acnhorChar = (anchorBlock as BlockNode).lastNodeIndex()
                    break;
                }
            }
        }
        if(nextNode !== undefined){

            let SelectionDataCopy = selectionState.$getDataCopy()

            SelectionDataCopy.anchorKey = blockIndex
            SelectionDataCopy.focusKey = blockIndex

            SelectionDataCopy._anchorNode = acnhorChar
            SelectionDataCopy._focusNode = acnhorChar

            SelectionDataCopy.anchorOffset = nextNode.returnContentLength()
            SelectionDataCopy.focusOffset = nextNode.returnContentLength()

            SelectionDataCopy.anchorCharKey = acnhorChar
            SelectionDataCopy.focusCharKey = acnhorChar

            SelectionDataCopy.anchorType = nextNode.returnType() !== 'text' ? 'element' : 'text'
            SelectionDataCopy.focusType = SelectionDataCopy.anchorType

            SelectionDataCopy.isDirty = true
        
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
        let connectingBlock = this.blocks[FBindex] as BlockNode
        let joiningBlock = this.blocks[SBindex] as BlockNode

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
            let joiningBlock = this.blocks[selectionState.anchorKey] as BlockNode

        
            AnchorIndex = direction === 'down' ? selectionState.anchorKey - 1: selectionState.anchorKey + 1
            let connectingBlock = this.blocks[AnchorIndex] as BlockNode


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
            let connectingBlock = this.blocks[selectionState.anchorKey] as BlockNode

            let joiningBlock = this.blocks[AnchorIndex] as BlockNode

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


    insertLetterIntoBlock(KeyBoardEvent: React.KeyboardEvent, selectionState: SelectionState){

        let DirtySelectionState = null

        let Key = KeyBoardEvent.key

        let anchorBlockNode = this.blocks[selectionState.anchorKey] as BlockNode
        let focusBlockNode = this.blocks[selectionState.focusKey] as BlockNode

        let CurrentAnchorCharData = anchorBlockNode.CharData !== undefined ? anchorBlockNode.CharData[selectionState.anchorCharKey] : undefined 
        let CurrentFocusCharData = focusBlockNode.CharData !== undefined ? focusBlockNode.CharData[selectionState.focusCharKey] : undefined

        if(selectionState.isCollapsed){

            let SliceFrom = selectionState.anchorOffset
            let SliceTo = selectionState.focusOffset

            if(ValidationUtils.isTextNode(CurrentAnchorCharData) === true){
                if(Key === ' ' && KeyBoardEvent.which === 229){
                    Key = '. '
                    SliceFrom -= 1
                }
                this.TextNodeSlice(CurrentAnchorCharData as TextNode, Key, SliceFrom, SliceTo)
                if(selectionState.anchorType === 'break_line'){
                    selectionState.convertBreakLineToText()
                    selectionState.moveSelectionForward()
                }
                else {
                    selectionState.moveSelectionForward()
                }
            }
            else{
                let nextNode = anchorBlockNode.nextSibling(selectionState.anchorCharKey) as TextNode
                if(nextNode === undefined || ValidationUtils.isTextNode(nextNode) === false){
                    let nextNode = new TextNode()
                    anchorBlockNode.splitCharNode(true, selectionState.anchorCharKey + 1, selectionState.focusCharKey + 1, nextNode)
                    this.TextNodeSlice(nextNode, Key, 0, 0)
                    selectionState.toggleCollapse(true)
                    selectionState.moveSelectionForward()
                    selectionState.isDirty = true
                }
                else if(ValidationUtils.isTextNode(nextNode) === true){

                    this.TextNodeSlice(nextNode, Key, 0, 0)
                    selectionState.toggleCollapse(true)
                    selectionState.isDirty = true
                }
            }
        }
        else if(selectionState.anchorKey === selectionState.focusKey){
            
                if(selectionState.anchorCharKey !== selectionState.focusCharKey){

                    let BlockSplitStart = selectionState.anchorCharKey + 1
                    let BlockSplitEnd = selectionState.focusCharKey
                    
                    if(ValidationUtils.isTextNode(CurrentAnchorCharData) === true){
                        this.TextNodeSlice(CurrentAnchorCharData as TextNode, Key, selectionState.anchorOffset)
                    }
                    else{
                        let previousSibling = anchorBlockNode.previousSibling(selectionState.anchorCharKey)
                        if(previousSibling !== undefined && ValidationUtils.isTextNode(previousSibling) === true){
                            this.TextNodeSlice(previousSibling as TextNode, Key, -1)
                        }
                        else anchorBlockNode.splitCharNode(true, BlockSplitStart, BlockSplitStart + 1, new TextNode())
                        BlockSplitStart -= 1
                    }
        
                    if(ValidationUtils.isTextNode(CurrentFocusCharData) === true){
                        this.TextNodeSlice(CurrentFocusCharData as TextNode, '', selectionState.focusOffset, -1)
                    }
                    else BlockSplitEnd += 1
                    anchorBlockNode.splitCharNode(true, BlockSplitStart, BlockSplitEnd)
        
                    selectionState.moveSelectionForward()

                    DirtySelectionState = this.BlockUpdateWithSelection(anchorBlockNode, selectionState) ?? null
                    if(DirtySelectionState !== null) selectionState.insertSelectionData(DirtySelectionState)
                }
                else{
                    if(ValidationUtils.isTextNode(CurrentAnchorCharData) === true){
                        CurrentAnchorCharData = CurrentAnchorCharData as TextNode
                        this.TextNodeSlice(CurrentAnchorCharData, Key, selectionState.anchorOffset, selectionState.focusOffset)
                        if(CurrentAnchorCharData.returnContent() === ''){
                            anchorBlockNode.splitCharNode(true, selectionState.anchorCharKey)
                            let DirtySelectionState = this.moveSelectionToPreviousSibling(selectionState) ?? null
                            if(DirtySelectionState !== null) selectionState.insertSelectionData(DirtySelectionState)
                        }
                        else {
                            selectionState.toggleCollapse()
                            selectionState.moveSelectionForward()
                        }
                    }
                    else{
                        anchorBlockNode.splitCharNode(false, selectionState.anchorCharKey, selectionState.anchorCharKey + 1)
                    }
                }
        }
        else if(selectionState.anchorKey !== selectionState.focusKey){

            let BlockSplitStart = selectionState.anchorCharKey + 1
            let BlockSplitEnd = selectionState.focusCharKey

            if(CurrentAnchorCharData !== undefined){
                if(ValidationUtils.isTextNode(CurrentAnchorCharData) === true){
                    this.TextNodeSlice(CurrentAnchorCharData as TextNode, Key, selectionState.anchorOffset)
                }
                else{
                    let previousSibling = anchorBlockNode.previousSibling(selectionState.anchorCharKey)
                    if(previousSibling !== undefined && ValidationUtils.isTextNode(previousSibling) === true){
                        this.TextNodeSlice(previousSibling as TextNode, Key, -1)
                    }
                    else{
                        let newTextNode = new TextNode()
                        anchorBlockNode.splitCharNode(false, BlockSplitStart, BlockSplitStart + 1, newTextNode)
                    }
                    BlockSplitStart -= 1
                }
                anchorBlockNode.bulkRemoveCharNode(true, BlockSplitStart)
            }

            if(CurrentFocusCharData !== undefined){
                if(ValidationUtils.isTextNode(CurrentFocusCharData) === true){
                    this.TextNodeSlice(
                            CurrentFocusCharData as TextNode, 
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
                selectionState.moveSelectionForward()
            }
            
            else if(CurrentAnchorCharData !== undefined) selectionState.moveSelectionForward()
            else if(CurrentFocusCharData !== undefined){
                selectionState.focusOffset = 0
                selectionState.toggleCollapse(true)
            }

        }

    }      
    removeLetterFromBlock(selectionState: SelectionState){

        let anchorBlock = this.blocks[selectionState.anchorKey] as BlockNode
        let focusBlock = this.blocks[selectionState.focusKey] as BlockNode



        if(selectionState.isFullBlockSelected() === true){
            let SliceAnchor = selectionState.anchorKey
            this.sliceBlockFromContent(SliceAnchor, SliceAnchor + 1)

            let previousNode = this.moveSelectionToPreviousSibling(selectionState)
            if(previousNode !== undefined) selectionState.insertSelectionData(previousNode)
            return ;
        }
        
        let anchorCharNode = anchorBlock.CharData ?  anchorBlock.CharData[selectionState.anchorCharKey]: undefined
        let focusCharNode = focusBlock.CharData?  focusBlock.CharData[selectionState.focusCharKey] : undefined;

        if(anchorCharNode === undefined && focusCharNode === undefined) return;
        else if(selectionState.isCollapsed){
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
                if(anchorCharNode === undefined || anchorBlock === undefined) return;
                let SliceAnchor = selectionState.anchorOffset - 1
                let SliceFocus = selectionState.focusOffset
                let anchorCharType = anchorCharNode.returnType()

                if(selectionState.anchorOffset === 0){
                    if(anchorBlock.previousSibling(selectionState.anchorCharKey)?.returnType() === 'element'){
                        anchorBlock.removeCharNode(selectionState.anchorCharKey - 1)
                        selectionState.anchorCharKey -= 1
                        let previousNode = this.moveSelectionToPreviousSibling(selectionState)
                        if(previousNode !== undefined) selectionState.insertSelectionData(previousNode)
                        return ;
                    }
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
                        selectionState.moveSelectionBack()
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
                        else selectionState.toggleCollapse()
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

                
                if(anchorCharNode === undefined) BlockSliceAnchor -= 1
                else {
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
                    anchorBlock.bulkRemoveCharNode(true, CharSliceAnchor)
                }

                if(focusCharNode === undefined) {
                    if(ValidationUtils.isTextNode(focusCharNode) === true){
                    focusCharNode = focusCharNode as TextNode
                    this.TextNodeSlice(focusCharNode, '', SliceFocus, -1)
                    if(focusCharNode.returnContent() === '') CharSliceFocus += 1
                    }
                    else CharSliceFocus += 1
                    focusBlock.bulkRemoveCharNode(false, CharSliceFocus)
                }

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
            this.insertBlockBetween(new BlockNode({CharData: [new TextNode()]}), selectionState.anchorKey, selectionState.anchorKey)
            selectionState.anchorKey += 1
            let DirtySelectionState = this.BlockUpdateWithSelection(this.blocks[selectionState.anchorKey] as BlockNode, selectionState) ?? null
            if(DirtySelectionState !== null) selectionState.insertSelectionData(DirtySelectionState)
        }
        else if(selectionState.isCollapsed){

            let CurrentBlock = this.blocks[selectionState.anchorKey] as BlockNode
            let anchorOffsetChar = CurrentBlock.CharData[selectionState.anchorCharKey] as TextNode

            let CharNodeSlice = selectionState.anchorCharKey

            let SlicedCharNode = undefined

            if(selectionState.anchorOffset !== 0){
                if(ValidationUtils.isTextNode(anchorOffsetChar) === true){
                    let SliceContent = anchorOffsetChar.getSliceContent(false, selectionState.anchorOffset)
                    this.TextNodeSlice(anchorOffsetChar, '', selectionState.anchorOffset)
                    CharNodeSlice += 1
                    SlicedCharNode = new TextNode(SliceContent, anchorOffsetChar.d[2])
                }
                else{
                    CharNodeSlice += 1
                    SlicedCharNode = new TextNode()
                }
            }
            let SliceCharNodes = CurrentBlock.CharData.slice(CharNodeSlice)
            CurrentBlock.splitCharNode(true, CharNodeSlice)

            if(SlicedCharNode !== undefined){
                SliceCharNodes = [SlicedCharNode, ...SliceCharNodes]
            }


            let NewBlock = new BlockNode({CharData: SliceCharNodes, blockType: CurrentBlock.blockType})
            this.insertBlockBetween(NewBlock, selectionState.anchorKey + 1, selectionState.anchorKey + 1)

            selectionState.anchorKey += 1

            let DirtySelectionState = this.moveSelectionToNextSibling(selectionState) ?? null
            if(DirtySelectionState !== null) selectionState.insertSelectionData(DirtySelectionState)

        }
        else{
            if(selectionState.anchorKey === selectionState.focusKey){

                let AnchorBlock = this.blocks[selectionState.anchorKey] as BlockNode

                let anchorCharNode = AnchorBlock.getNodeByIndex(selectionState.anchorCharKey)
                let focusCharNode = AnchorBlock.getNodeByIndex(selectionState.focusCharKey)

                let anchorNodeSlice = selectionState.anchorCharKey + 1
                let focusNodeSlice = selectionState.focusCharKey


                if(ValidationUtils.isTextNode(anchorCharNode) === true){
                    this.TextNodeSlice(anchorCharNode as TextNode, '', selectionState.anchorOffset)
                }
                else focusNodeSlice += 1

                if(ValidationUtils.isTextNode(focusCharNode) === true){
                    this.TextNodeSlice(focusCharNode as TextNode, '', selectionState.focusOffset,  -1)
                } else focusNodeSlice += 1

                let SliceCharNodes = AnchorBlock.CharData.slice(focusNodeSlice)
                AnchorBlock.splitCharNode(true, anchorNodeSlice)

                SliceCharNodes = SliceCharNodes.length > 0 ? SliceCharNodes : [new TextNode()]

                let NewBlock = new BlockNode({CharData: SliceCharNodes, blockType: AnchorBlock.blockType})
                this.insertBlockBetween(NewBlock, selectionState.anchorKey + 1, selectionState.anchorKey + 1)

                let DirtySelectionState = this.moveSelectionToNextSibling(selectionState) ?? null
                if(DirtySelectionState !== null) selectionState.insertSelectionData(DirtySelectionState)

            }
            else if(selectionState.anchorKey !== selectionState.focusKey){
                this.removeLetterFromBlock(selectionState)
            }
        }
        
    }
}