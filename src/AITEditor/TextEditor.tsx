import React, {useState, useEffect} from 'react'

import defaultBlocks from './defaultStyles/defaultBlocks'
import './defaultinlineStyles.scss'

import StandartToolBar from './StandartToolbars'

import EditorManagmentUtils from './EditorManagmentUtils'
import {createReactEditor, BlockManagmentUtils} from './BlockManagmentUtils'
import RenderUtils from './RenderUtils'
import SearchUtils from './SearchUtils'
import FormatingUtils from './FormatingUtils'
import {EditorState as editorState} from './EditorManagmentUtils'

import {EditorSelection} from './Interfaces'




export type CharData = [string, Array<string>, Array<number>]

export type HTMLBlockStyle = {type: string, tag: string}
export type HTMLCharStyle = {style: string, tag: string}


export interface ATEditorBlock{
    blockKey: string
    blockLength: number
    plainText: string
    blockStyle: string
    CharOffset: number
    blockInlineStyles: Array<string>
    CharData: Array<CharData>

}



interface EditorProps{
    EditorState: any
    setEditorState: React.Dispatch<React.SetStateAction<ATEditor>>

}

export interface ATEditor{
    blocks: Array<ATEditorBlock>
    selectionState: EditorSelection

    // ---- TO CREATE ----
    // BLOCK TYPE STATE
    //PAGINATOR STATE
}


export interface blockHTML {
    blockKey: string, 
    blockType: string
    blockInlineStyles: Array<string>
    HTML: string
}

export function getElementBlockStyle(Tag: string): HTMLBlockStyle {
    let TagData = {type: 'unstyled', tag: 'div'}
    TagData = defaultBlocks.find(obj => obj.tag === Tag || obj.type === Tag) ?? TagData
    return TagData
}

 // CreateStateFromHTML(`
    //     <h1 class = 'ATEditorBlock__wrapper'>
    //         <p>Hello</p>
    //         <p> World</p>
    //         <strong> FROM</strong>
    //         <em> DENIS</em>
    //         <em> DENIS2</em>
    //     </h1>
    //     <div>
    //         <p>Hello two</p>
    //     </div>
    //     `)

export default function AITEditor(){

    const EditorRef = React.useRef<HTMLDivElement>(null!)

    const [EditorState, setEditorState] = useState<any>(new editorState())


    function KeyBoardCodeValidator(key: string){
        if(
            key === ' ' ||
            (key > 'A' && 'Z' < key) ||
            (key >= '0' &&  key <= '9') 
            //(key >= ';' &&  key <= '`') ||
            //(key >= '[' &&  key <= "'") 
            ) return true
        else return false
    }

    function HandleKeyClick(event: React.KeyboardEvent) {
        let Key = event.key
        const AllowedKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']

        if(Key === 'Backspace'){
            event.preventDefault()
            EditorState.contentNode.removeLetterFromBlock(EditorState.selectionState)
            setEditorState({...EditorState})
        }
        else if(Key === 'Enter'){
            event.preventDefault()
            EditorState.contentNode.handleEnter(EditorState.selectionState)
            setEditorState({...EditorState})
        }
        else if(!AllowedKeys.includes(Key) && KeyBoardCodeValidator(Key)){
            event.preventDefault()
            EditorState.contentNode.insertLetterIntoBlock(event, EditorState.selectionState)
            setEditorState({...EditorState})
        }
        else if(!AllowedKeys.includes(Key)){
            event.preventDefault()
        }

    }
    
    useEffect(() => { 
        if(EditorState.selectionState.isDirty ){
            EditorState.selectionState.$getSelectionDataFromDirty(EditorRef)
        }
        EditorState.selectionState.setCaretPosition()
    })

    return(
        <>
        {/* <StandartToolBar EditorState = {EditorState} setEditorState = {setEditorState}/> */}
            <div
                ref = {EditorRef}
                style = {{fontSize: '16px'}}
                className = 'AITE__editor'

                contentEditable = {true}
                suppressContentEditableWarning = {true}

                spellCheck = {false}
                
                onSelect = {() => {
                    EditorState.selectionState.$getCaretPosition(EditorRef)
                }}
                
                onKeyDown = {HandleKeyClick}
                onDrop = {(event) => event.preventDefault()}
            >
                <React.Fragment>
                    {createReactEditor(EditorState.contentNode)}
                </React.Fragment>
            </div>
        </>
    )
}
