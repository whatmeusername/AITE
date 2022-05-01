import React from 'react'

import {ATEditor, EditorSelection} from './Interfaces'
import {TEXT_NODE, BREAK_LINE} from './ConstVariables'

interface blockNodeData {blockNode: HTMLElement | Node, index: number, elementType: string | null}
interface blockNodeDataExtended extends blockNodeData{
    charKey: number
}

type SelectionStateVariables<T> = {readonly [K in keyof T as T[K] extends Function ? never : K]+?: T[K]}



export type SelectionStateData = SelectionStateVariables<SelectionState>

export class SelectionState{

    anchorOffset: number
    focusOffset: number

    anchorKey: number
    focusKey: number

    anchorCharKey: number
    focusCharKey: number

    _anchorNode: Node | number | null
    _focusNode: Node | number | null

    anchorType: string | null
    focusType: string | null

    isCollapsed: boolean
    isDirty: boolean

    constructor(){

        this.anchorOffset = 0
        this.focusOffset = 0
        
        this.anchorKey = 0
        this.focusKey = 0

        this.anchorCharKey = 0
        this.focusCharKey = 0

        this._anchorNode = null
        this._focusNode = null

        this.anchorType = null
        this.focusType = null

        this.isCollapsed = false
        this.isDirty = false
    }

    set anchorNode(Node: Node | number | null){
        if(typeof Node === 'number'){
            this.isDirty = true
            this._anchorNode = Node
        }
        else{
            this.isDirty = false
            this._anchorNode = Node
        }
    }

    set focusNode(Node: Node | number | null){
        if(typeof Node === 'number'){
            this.isDirty = true
            this._focusNode = Node
        }
        else{
            this.isDirty = false
            this._focusNode = Node
        }
    }

    get anchorNode(){
        return this._anchorNode
    }

    get focusNode(){
        return this._focusNode
    }


    moveSelectionStraight(){
        this.anchorOffset += 1
        this.focusOffset += 1
    }

    moveSelectionBack(){
        this.anchorOffset -= 1
        this.focusOffset -= 1
    }

    convertBreakLineToText(){
        this.isDirty = true
        this.anchorNode = this.anchorCharKey
        this.focusNode = this.anchorCharKey

        this.anchorType = 'text'
        this.focusType = 'text'
    }

    toggleCollapse(focus: boolean = false){
        this.isCollapsed = true
        if(focus === true){
            this.anchorOffset = this.focusOffset
            this.anchorNode = this.focusNode
            this.anchorCharKey = this.focusCharKey
            this.anchorType = this.focusType
            this.anchorKey = this.focusKey

        }
        else{
            this.focusType = this.anchorType
            this.focusKey = this.anchorKey
            this.focusOffset = this.anchorOffset
            this.focusNode = this.anchorNode
            this.focusCharKey = this.anchorCharKey
        }
    }

    insertSelectionData(SelectionData: SelectionStateData){


        this.anchorCharKey = SelectionData.anchorCharKey ?? this.anchorCharKey
        this.focusCharKey = SelectionData.focusCharKey ?? this.focusCharKey

        this.anchorOffset = SelectionData.anchorOffset ?? this.anchorOffset
        this.focusOffset = SelectionData.focusOffset ?? this.focusOffset

        this.anchorType = SelectionData.anchorType ?? this.anchorType
        this.focusType = SelectionData.focusType ?? this.focusType
        
        this.anchorKey = SelectionData.anchorKey ?? this.anchorKey
        this.focusKey = SelectionData.focusKey ?? this.focusKey

        this.anchorNode = SelectionData._anchorNode ?? this._anchorNode
        this.focusNode = SelectionData._focusNode ?? this._focusNode

        this.isCollapsed = SelectionData.isCollapsed ?? this.isCollapsed
        this.isDirty = SelectionData.isDirty ?? this.isDirty

    }

    $getDataCopy(){
        return {...this}
    }

    $getNodeType(node: Node | HTMLElement): string | null{

        let type = null

        while(node.firstChild !== null){
            node = node.firstChild
        }
        if(node.nodeType === 3 || node.nodeName === 'BR'){
            type = 'text'
        }
        else if(node.nodeType === 1){
            type = 'element'
        }
        return type
    }

    $getBlockNode<S>(node: Node, EditorNodes: Array<Node>, returnCharKey?: S extends boolean ? boolean : undefined): S extends boolean ? blockNodeDataExtended : blockNodeData;
    $getBlockNode(node: Node, EditorNodes: Array<Node>, returnCharKey?: boolean | undefined): blockNodeDataExtended | blockNodeData {
        let editorClass = 'AITE__editor'
        let ParentNode: HTMLElement = node as HTMLElement

        while(true){
            if((ParentNode.parentNode as HTMLElement).classList['0'] as string === editorClass) break;
            ParentNode = ParentNode.parentNode as HTMLElement
        }
        if(returnCharKey === true){
            let ParentNodes = Array.from(ParentNode.children)
            let charKey = -1
            let ElementType = null
            

            if(node?.firstChild?.nodeName === BREAK_LINE){
                ElementType = 'break_line'
                charKey = 0
            }
            else{
                ElementType = this.$getNodeType(node)
                let NodeToFind = node
                if(ElementType !== 'element'){
                    NodeToFind = node.parentNode ?? node
                }
                charKey = ParentNodes.indexOf(NodeToFind as HTMLElement)
            }

            let Result = {
                blockNode: ParentNode, 
                index: EditorNodes.indexOf(ParentNode as HTMLElement), 
                elementType: ElementType,
                charKey: charKey
            }
            return Result
        }
        else if(returnCharKey === undefined){
            let Result = {
                blockNode: ParentNode, 
                elementType: this.$getNodeType(node),
                index: EditorNodes.indexOf(ParentNode as HTMLElement), 
            }
            return Result
        }
        else throw new Error(`Not returned return value during condition check`)
    }
    
    $getSelectionDataFromDirty(EditorRef: React.MutableRefObject<HTMLDivElement>){
        let EditorNode: HTMLDivElement = EditorRef.current


        if(EditorNode !== null && typeof this.anchorKey === 'number' && typeof this.focusKey === 'number'){
            let EditorNodes = Array.from(EditorNode.children)

            let anchorBlockNode = EditorNodes[this.anchorKey]
            let focusBlockNode = EditorNodes[this.focusKey]

            let anchorNode = Array.from(anchorBlockNode.children)[this.anchorCharKey as number]
            let focusNode = Array.from(focusBlockNode.children)[this.anchorCharKey as number]

            if(anchorNode?.firstChild?.nodeType !== TEXT_NODE) this.anchorNode = anchorNode
            else this.anchorNode = anchorNode.firstChild

            if(focusNode?.firstChild?.nodeType !== TEXT_NODE) this.focusNode = anchorNode
            else this.focusNode = anchorNode.firstChild
            this.isDirty = false
        }
    }

    $getCountToBlock(nodeIndex: number, BlockNode: Array<Node>): number{
        let SlicedBlockNodes = BlockNode.slice(0, nodeIndex + 1)
        let LetterCount = 0
        SlicedBlockNodes.forEach((node: Node) => {
            LetterCount += node.textContent?.length ?? 0
        })
        return LetterCount
    }
    $getCharNodeIndexFromBlock(CharNode: Node, BlockNode: Array<Node>): number{
        if(CharNode.nodeType === TEXT_NODE){
            return BlockNode.indexOf(CharNode.parentNode as HTMLElement)
        }
        else{
            return BlockNode.indexOf(CharNode.parentNode as HTMLElement)
        }
    }
    $getCaretPosition(EditorRef: React.MutableRefObject<HTMLDivElement>): void{

        let EditorNode: HTMLDivElement = EditorRef.current
        let selection = window.getSelection()

        if(selection !== null && EditorNode !== null) {

            let EditorNodes = Array.from(EditorNode.children)

            if(selection.anchorNode === null) return;
            let range = selection.getRangeAt(0);

            let collapsed = selection.isCollapsed
            this.isCollapsed = collapsed
            
            let anchorTextNode = range.startContainer
            let focusTextNode = range.endContainer

            let anchorBlockNode = this.$getBlockNode<boolean>(anchorTextNode, EditorNodes, true)

            if(anchorBlockNode.blockNode !== null){

                this.anchorType = anchorBlockNode.elementType
                this.anchorNode = anchorTextNode
                this.anchorKey = anchorBlockNode.index
                this.anchorCharKey = anchorBlockNode.charKey

                let anchorRange = range.cloneRange();

                anchorRange.selectNodeContents(anchorTextNode);
                anchorRange.setEnd(focusTextNode, range.endOffset);

                this.anchorOffset = selection.anchorOffset
                
                if(collapsed === true) this.toggleCollapse()
            }
            
            if(collapsed === false){

                let focusBlockNode = this.$getBlockNode<boolean>(focusTextNode, EditorNodes, true)

                this.focusType = focusBlockNode.elementType
                this.focusCharKey = focusBlockNode.charKey
                this._focusNode = focusTextNode
                this.focusKey = focusBlockNode.index

                let focusRange = range.cloneRange();

                focusRange.selectNodeContents(focusTextNode);
                focusRange.setStart(range.endContainer, range.endOffset);

                this.focusOffset = selection.focusOffset

            }
        }
    }
    setCaretPosition(): void{
       
        let selection = window.getSelection();

        if(selection && this.anchorNode !== null && this.focusNode !== null && this.isDirty === false){

            let range = document.createRange();

            if(this.anchorType === 'text'){
                let anchorNodeText = (this.anchorNode as Node).textContent
                if(anchorNodeText !== null){
                    if(this.anchorOffset > anchorNodeText.length){
                        this.anchorOffset = anchorNodeText.length
                    }
                    range.setStart(this.anchorNode as Node, this.anchorOffset);
                }
            }
            else if(this.anchorType === 'element' || this.anchorType === 'break_line'){
                range.setStart(this.anchorNode as HTMLElement as Node, this.anchorOffset);
            }

            if(this.focusType === 'text'){
                let focusNodeText = (this.focusNode as Node).textContent
                if(focusNodeText !== null){
                    if(this.focusOffset > focusNodeText.length){
                        this.focusOffset = focusNodeText.length
                    }
                    range.setEnd(this.focusNode as Node, this.focusOffset);
                }
            }
            else if(this.focusType === 'element' || this.anchorType === 'break_line'){
                range.setEnd(this.focusNode as HTMLElement as Node, this.focusOffset);
            }

            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
    setSelectionDataByNode(Node: Node, NodeKey?: number){
        if(Node.nodeType === TEXT_NODE ){
            let nextNodeText = Node.textContent ?? ''

            this.anchorOffset = nextNodeText.length
            this.focusOffset = nextNodeText.length

            this.anchorKey = NodeKey ?? this.anchorKey 
            this.focusKey = NodeKey ?? this.focusKey

            this.anchorNode = Node
            this.focusNode = Node

            this.isCollapsed = true
        }
        else{
            throw new Error(`Node must have type of TEXT NODE to assign new selection, but current node type is ${Node.nodeType}`)
        }
    }
}

const SelectionUtils = {

    createEmptySelection: (): EditorSelection => {
        return(
            {
                anchorOffset: 0, 
                focusOffset: 0,
                SelectionText: '',
                anchorKey: '',
                focusKey: '',
            }
        )
    },

    GetNodesBySelection: function(node: Node, offsetStart: number, offsetEnd: number, blockKey: string){

        let tw =  document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT)
        let TotalCount: number = 0

        let offsetStartNode: {node: Node, LetterIndex: number} | null= null
        let offsetEndNode: {node: Node, LetterIndex: number} | null = null
        let blockFounded: boolean = false

        function NodeInfoCollect(CurrentNode: Node){
            let NodeTextContent: string = CurrentNode.textContent ?? ''
            TotalCount += NodeTextContent.length
            if(TotalCount >= offsetStart && offsetStartNode === null){
                let LetterIndex = 0
                if(blockFounded === true){
                    LetterIndex = offsetStart - (TotalCount - NodeTextContent.length)
                    offsetStartNode = {node: CurrentNode, LetterIndex: LetterIndex}
                    if(offsetEnd === offsetStart){
                        LetterIndex = offsetStart - (TotalCount - NodeTextContent.length)
                        offsetEndNode = {node: CurrentNode, LetterIndex: LetterIndex}
                    }
                }
            }
            if(TotalCount >= offsetEnd && offsetEndNode === null && blockFounded === true){
                let LetterIndex = offsetEnd - (TotalCount - NodeTextContent.length)
                offsetEndNode = {node: CurrentNode, LetterIndex: LetterIndex}
            }
        }

        let CurrentNode: Node | null = tw.currentNode
        while(true){
            if(CurrentNode === null || (offsetStartNode !== null && offsetEndNode !== null)) break;
            else{
                if(blockFounded === false){
                    let NodeDataset = (CurrentNode as HTMLElement).dataset
                    if(NodeDataset['setBlockkey'] === blockKey){
                        blockFounded = true
                    }
                }
                if(CurrentNode.nodeName === 'BR'){
                    if((CurrentNode as HTMLElement).dataset['blockseparator'] === 'true'){
                        offsetStartNode = {node: CurrentNode, LetterIndex: 0}
                        offsetEndNode = {node: CurrentNode, LetterIndex: 0}
                        break ;
                    }
                }
                else if(CurrentNode.childNodes.length === 1 && CurrentNode.firstChild?.nodeType === 3){
                    NodeInfoCollect(CurrentNode)
                }
                else if(CurrentNode.childNodes.length !== 1 && CurrentNode.firstChild?.nodeType === 3){
                    CurrentNode.childNodes.forEach((node: Node) => {
                        if(node.nodeType === 1){
                            tw.nextNode()
                        }
                        NodeInfoCollect(node)
                    })
                }
            
            }
            CurrentNode = tw.nextNode()
        }
        let NodeData = {offsetStart: offsetStartNode, offsetEnd: offsetEndNode}
        return NodeData
    },
    GetBlockElement: function(node: Node, EditorNodes: Array<Node>){
        let editorClass = 'ATE__editor'
        let ParentNode: HTMLElement | null = node as HTMLElement
        while((ParentNode.parentNode as HTMLElement).classList['0'] as string !== editorClass){
            ParentNode = (ParentNode ?? node).parentNode as HTMLElement
        }
        return {blockNode: node, key: EditorNodes.indexOf(node as HTMLElement)}
    },
    GetTextNode: function(node: Node){
        
    },
    GetCaretPosition: function(EditorState: ATEditor, EditorRef: React.MutableRefObject<HTMLDivElement>){

        let caretEnd = 0
        let caretStart = 0
        let EditorNode: HTMLDivElement = EditorRef.current

        let CaretText = ''
        let StartKey: string | undefined = undefined
        let EndKey: string | undefined = undefined

        let selection = window.getSelection()
        let CaretRange

        if(selection !== null && EditorNode !== null) {

            let collapsed = selection.isCollapsed
            let EditorNodes = Array.from(EditorNode.children)

            let range = selection.getRangeAt(0);
            CaretText = range.toString()

            let selected = range.toString().length
            
            let anchorTextNode = range.startContainer
            let focusTextNode = range.endContainer

            let anchorBlockNode = this.GetBlockElement(anchorTextNode, EditorNodes)
            let focusBlockNode = this.GetBlockElement(focusTextNode, EditorNodes)

            if(focusTextNode !== undefined){
                EndKey = (focusTextNode.parentNode as HTMLElement).dataset['setBlockkey'] ?? undefined
                if(EndKey === undefined){
                    let SelectedDataSet = (focusTextNode as HTMLElement).dataset
                    EndKey = SelectedDataSet ? (focusTextNode as HTMLElement).dataset['setBlockkey'] : undefined
                }
                if(collapsed === true) StartKey = EndKey
            }
            if(anchorTextNode !== undefined && collapsed === false){
                StartKey = (anchorTextNode.parentNode as HTMLElement).dataset['setBlockkey'] ?? undefined
                if(StartKey === undefined){
                    let SelectedDataSet = (anchorTextNode as HTMLElement).dataset
                    StartKey = SelectedDataSet ? (anchorTextNode as HTMLElement).dataset['setBlockkey'] : undefined
                }
            }
            if(anchorBlockNode.blockNode !== null){
                CaretRange = range.cloneRange();
                CaretRange.selectNodeContents(anchorBlockNode.blockNode);
                CaretRange.setEnd(range.endContainer, range.endOffset);
                caretStart = CaretRange.toString().length - selected
                caretEnd = CaretRange.toString().length;
            }
            if(collapsed === false && StartKey !== EndKey){
                if(focusBlockNode.blockNode !== null){
                    let CaretRange2 = range.cloneRange();
                    CaretRange2.selectNodeContents(focusBlockNode.blockNode);
                    CaretRange2.setStart(range.endContainer, range.endOffset);
                    caretEnd = ((focusBlockNode.blockNode.textContent ?? '').length) - CaretRange2.toString().length
                }
            }
            let SelectionState = {
                    anchorOffset: caretStart,
                    focusOffset: caretEnd, 
                    SelectionText: CaretText,
                    anchorKey: StartKey ?? '',
                    focusKey: EndKey ?? '',
                }

            EditorState.selectionState = SelectionState
            }
        return EditorState
    },

    SetSelection: function(EditorRef: React.MutableRefObject<HTMLDivElement>, offsetStart: number, offsetEnd: number, blockKey: string){

        let BlockNode = EditorRef.current.querySelector(`.ATEditor__content__ATEditorBlock[data-set-blockkey = '${blockKey}' ]`)
        if(BlockNode !== undefined && BlockNode !== null){
            let offsetData = this.GetNodesBySelection(BlockNode, offsetStart, offsetEnd, blockKey)
            let offsetStartNode = offsetData?.offsetStart ?? null
            let offsetEndNode = offsetData?.offsetEnd ?? null
            if(BlockNode !== null && offsetStartNode !== null && offsetEndNode !== null) {
                let range = document.createRange();
                let selection = window.getSelection();

                if(selection !== null){
                    BlockNode = (BlockNode?.firstChild?.firstChild as HTMLElement) ?? null

                    let StartNode = offsetStartNode.node.firstChild ?? offsetStartNode.node
                    StartNode = StartNode === null ? offsetStartNode.node : StartNode

                    let EndNode = offsetEndNode.node.firstChild ?? offsetEndNode.node
                    
                    if(offsetStartNode.LetterIndex > -1 && offsetEndNode.LetterIndex > -1){
                        range.setStart(StartNode, offsetStartNode.LetterIndex);
                        range.setEnd(EndNode, offsetEndNode.LetterIndex);
                    }

                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }

    },
    ForceSelectionData: function(selectionState: EditorSelection, selectionSettings: any){
        selectionState.anchorOffset = selectionSettings.offsetStart ?? selectionState.anchorOffset
        selectionState.focusOffset = selectionSettings.offsetEnd ?? selectionState.focusOffset
        selectionState.SelectionText = selectionSettings.SelectionText ?? selectionState.SelectionText
        selectionState.anchorKey = selectionSettings.StartKey ?? selectionState.anchorKey
        selectionState.focusKey = selectionSettings.EndKey ?? selectionState.focusKey
    }
}


export default SelectionUtils