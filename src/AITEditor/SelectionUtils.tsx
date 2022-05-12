import React from 'react'

import {ClassVariables} from './Interfaces'
import {TEXT_NODE, BREAK_LINE} from './ConstVariables'
import {findEditorBlockIndex, findEditorFullPathToCharNode} from './EditorUtils'

import type {EditorState} from './EditorManagmentUtils'

interface blockNodeData {blockNode: HTMLElement | Node, index: Array<number>, elementType: string | null}
interface blockNodeDataExtended extends blockNodeData{
    charKey: number
}

export type SelectionStateData = ClassVariables<SelectionState>


export class BlockPath{
    path: Array<number>

    constructor(path?: Array<number>){
        this.path = path ?? [0]
    }

    set(path: Array<number> | undefined): void{
        if(path !== undefined) this.path = path
    }

    get(){
        return this.path
    }

    length(){
        return this.path.length
    }

    getLastIndex(): number{
        return this.path[this.path.length - 1]
    }

    getPathIndexByIndex(index: number): number{
        if(index < 0){
            return this.path[this.length() + index]
        }
        return this.path[index]
    }

    getSlicedPath(sliceTo: number): Array<number>{
        if(sliceTo < 0){
            return this.path.slice(0, this.length() + sliceTo)
        }
        else return this.path.slice(0, sliceTo)
    }

    setLastPathIndex(index: number): void{
        this.path[this.path.length - 1] = index
    }

    getPathBeforeLast(): Array<number>{
        if(this.length() > 1){
            return this.path.slice(0, this.length() - 1)
        }
        return this.path
    }

    decrementLastPathIndex(to: number): void{
        this.path[this.path.length - 1] -= to
    }

    incrementLastPathIndex(to: number): void{
        this.path[this.path.length - 1] += to
    }
    

}

export class SelectionState{

    anchorOffset: number
    focusOffset: number

    anchorKey: BlockPath
    focusKey: BlockPath

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
        
        this.anchorKey = new BlockPath()
        this.focusKey = new BlockPath()

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


    pathIsEqual(){
        let focusKeyArr = this.focusKey.get()
        let anchorKeyArr = this.anchorKey.get()
        for(let i = 0; i < this.anchorKey.length(); i++){
            if(anchorKeyArr[i] !== focusKeyArr[i]) return false
        }
        return true
    }

    moveSelectionForward(){
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

    isFullBlockSelected(): boolean {
        if(
            (this.anchorCharKey === 0 || this.anchorCharKey === -1) &&
            this.anchorOffset === 0 &&
            this.anchorKey !== this.focusKey &&
            (this.focusCharKey === 0 || this.focusCharKey === -1) &&
            this.focusOffset === 0 
        ) return true
        else return false
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

    $getBlockNode<S>(node: Node, returnCharKey?: S extends boolean ? boolean : undefined): S extends boolean ? blockNodeDataExtended : blockNodeData;
    $getBlockNode(node: Node, returnCharKey?: boolean | undefined): blockNodeDataExtended | blockNodeData {

        let currentBlockData = findEditorFullPathToCharNode(node as HTMLElement)
        if(returnCharKey === true && currentBlockData !== undefined){
            let ElementType = null
            let charIndex = currentBlockData.charIndex ?? -1
            
            if(node?.firstChild?.nodeName === BREAK_LINE){
                ElementType = 'break_line'
                charIndex = 0
            }
            else{
                ElementType = this.$getNodeType(node)
                let NodeToFind = node
                if(ElementType !== 'element'){
                    NodeToFind = node.parentNode ?? node
                }
                charIndex = charIndex
            }

            let Result: blockNodeDataExtended = {
                blockNode: currentBlockData.blockNode as HTMLElement, 
                index: currentBlockData.blockPath,
                elementType: ElementType,
                charKey: charIndex
            }
            return Result
        }
        else if(returnCharKey === undefined && currentBlockData !== undefined){
            let Result: blockNodeData = {
                blockNode: currentBlockData.blockNode as HTMLElement, 
                elementType: this.$getNodeType(node),
                index: currentBlockData.blockPath, 
            }
            return Result
        }
        else throw new Error(`Not returned return value during condition check`)
    }
    
    $getSelectionDataFromDirty(EditorRef: React.MutableRefObject<HTMLDivElement>){

        let EditorNode: HTMLDivElement = EditorRef.current;
        let EditorNodes = Array.from(EditorNode.children);
        
        function getCharNode(path: BlockPath, currentNode: HTMLElement): HTMLElement | undefined {
            let currentBlock: HTMLElement | undefined;
            let pathArray = path.get();
            for(let i = 1; i < path.length(); i++){
                let childrens = Array.from(currentNode.children);
                let nextChildrenDataset = (childrens[pathArray[i]] as HTMLElement).dataset;

                if(
                    nextChildrenDataset.aite_block_node !== undefined || 
                    nextChildrenDataset.aite_block_content_node !== undefined
                    )
                    {
                    currentNode = childrens[pathArray[i]] as HTMLElement;
                }

                else if(
                    i === path.length() - 1 && (
                            currentNode.dataset.aite_block_node === undefined || 
                            currentNode.dataset.aite_block_content_node !== undefined
                        )
                    ){
                        currentBlock = childrens.find(node => {
                            if(
                                (node as HTMLElement).dataset.aite_block_node !== undefined ||
                                (node as HTMLElement).dataset.aite_block_content_node !== undefined
                                ) return true;
                        }) as HTMLElement;
                        if(currentBlock !== undefined){
                            currentBlock = Array.from(currentBlock.children)[pathArray[i]] as HTMLElement;
                        }
                }
                currentNode = childrens[pathArray[i]] as HTMLElement;
            };
            return currentBlock;
        }


        let anchorNodeBlock = undefined,
            focusNodeBlock = undefined;

        if(this.anchorKey.length() === 1) anchorNodeBlock = EditorNodes[this.anchorKey.get()[0]];
        else anchorNodeBlock = getCharNode(this.anchorKey, EditorNodes[this.anchorKey.get()[0]] as HTMLElement);

        if(this.anchorKey.length() === 1) focusNodeBlock = EditorNodes[this.focusKey.get()[0]];
        else focusNodeBlock = getCharNode(this.focusKey, EditorNodes[this.focusKey.get()[0]] as HTMLElement);

        let anchorNode = undefined,
            focusNode = undefined;

        if(anchorNodeBlock !== undefined) anchorNode = Array.from(anchorNodeBlock.children)[this.anchorCharKey] as HTMLElement;
        if(focusNodeBlock !== undefined) focusNode = Array.from(focusNodeBlock.children)[this.focusCharKey] as HTMLElement;

        if(anchorNode !== undefined && focusNode !== undefined){

            if(anchorNode?.firstChild?.nodeType !== TEXT_NODE) this.anchorNode = anchorNode;
            else this.anchorNode = anchorNode.firstChild;

            if(focusNode?.firstChild?.nodeType !== TEXT_NODE) this.focusNode = anchorNode;
            else this.focusNode = anchorNode.firstChild;
            this.isDirty = false;
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
    $getCaretPosition(forceRange?: Range | undefined): void{
        let selection = window.getSelection()
        if(selection !== null) {
            
            if(selection.anchorNode === null) return;
            let range = forceRange ?? selection.getRangeAt(0);

            let collapsed = selection.isCollapsed
            this.isCollapsed = collapsed
            
            let anchorTextNode = range.startContainer
            let focusTextNode = range.endContainer

            let anchorBlockNode = this.$getBlockNode<boolean>(anchorTextNode, true)

            if(anchorBlockNode.blockNode !== null){

                this.anchorType = anchorBlockNode.elementType
                this.anchorNode = anchorTextNode
                this.anchorKey.set(anchorBlockNode.index)
                this.anchorCharKey = anchorBlockNode.charKey

                let anchorRange = range.cloneRange();
                
                anchorRange.selectNodeContents(anchorTextNode);
                anchorRange.setEnd(focusTextNode, range.endOffset);

                this.anchorOffset = selection.anchorOffset
            
                if(collapsed === true) this.toggleCollapse()
            }
            
            if(collapsed === false){

                let focusBlockNode = this.$getBlockNode<boolean>(focusTextNode, true)

                this.focusType = focusBlockNode.elementType
                this.focusCharKey = focusBlockNode.charKey
                this._focusNode = focusTextNode
                this.focusKey.set(focusBlockNode.index)

                let focusRange = range.cloneRange();

                focusRange.selectNodeContents(focusTextNode);
                focusRange.setStart(range.endContainer, range.endOffset);

                this.focusOffset = selection.focusOffset

                if(anchorBlockNode.index.length !== focusBlockNode.index.length){
                    this.toggleCollapse()
                    this.focusOffset = (this.focusNode as HTMLElement).textContent?.length ?? this.focusOffset
                }
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

            this.anchorKey.set(NodeKey ? [NodeKey] : undefined)
            this.focusKey.set(NodeKey ? [NodeKey] : undefined)

            this.anchorNode = Node
            this.focusNode = Node

            this.isCollapsed = true
        }
        else{
            throw new Error(`Node must have type of TEXT NODE to assign new selection, but current node type is ${Node.nodeType}`)
        }
    }
}

