import React, {useState, useEffect} from 'react'

import defaultBlocks from './defaultStyles/defaultBlocks'

import {CreateReactEditor} from './BlockManagmentUtils'
import {EditorState as editorState} from './EditorManagmentUtils'

import EditorCommands from './EditorCommands'

import RichBlock from './packages/AITE_RichBlock/RichBlock'
import activeElementState from './packages/AITE_ActiveState/activeElementState'

import './defaultinlineStyles.scss'

export type CharData = [string, Array<string>, Array<number>]

export type HTMLBlockStyle = {type: string, tag: string}
export type HTMLCharStyle = {style: string, tag: string}



export function getElementBlockStyle(Tag: string): HTMLBlockStyle {
    let TagData = {type: 'unstyled', tag: 'div'}
    TagData = defaultBlocks.find(obj => obj.tag === Tag || obj.type === Tag) ?? TagData
    return TagData
}


export default function AITEditor(){

    const EditorRef = React.useRef<HTMLDivElement>(null!)

    const [EditorState, setEditorState] = useState<editorState>(new editorState())


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
        }
        else if(!AllowedKeys.includes(Key)){
            event.preventDefault()
        }

    }
    
    useEffect(() => { 
        if(EditorState.EditorCommands === undefined){
            EditorState.EditorCommands = new EditorCommands(() => setEditorState({...EditorState}))
            EditorState.EditorActiveElementState = new activeElementState(() => setEditorState({...EditorState}))


            EditorState.EditorCommands.registerCommand(
                'KEYBOARD_COMMAND',
                'IMMEDIATELY_EDITOR_COMMAND',
                (event) => HandleKeyClick(event)
            )
        
            EditorState.EditorCommands.registerCommand(
                'SELECTION_COMMAND',
                'IGNOREMANAGER_EDITOR_COMMAND',
                (_) => EditorState.selectionState.$getCaretPosition(EditorRef)
            )

            setEditorState({...EditorState})
        }
        if(EditorState.selectionState.isDirty ){
            EditorState.selectionState.$getSelectionDataFromDirty(EditorRef)
        }
        EditorState.selectionState.setCaretPosition()
    }, [EditorState])


//    let richBlock = new RichBlock(EditorState, () => setEditorState({...EditorState}))
//    richBlock.toggleBlockWrapper('header-one')

    return(
        <>
            <div
                ref = {EditorRef}
                style = {{fontSize: '16px'}}
                className = 'AITE__editor'

                data-aite_editor_root = {true}
                contentEditable = {true}
                suppressContentEditableWarning = {true}

                spellCheck = {false}
                onClick = {(event) => EditorState.EditorActiveElementState?.handleElementClick(event)}
                
                onSelect = {(e) => EditorState.EditorCommands?.dispatchCommand('SELECTION_COMMAND', e)}
                
                onKeyDown = {(e) => EditorState.EditorCommands?.dispatchCommand('KEYBOARD_COMMAND', e)}
                onDrop = {(event) => event.preventDefault()}
            >
                <React.Fragment>
                    <CreateReactEditor EditorState = {EditorState}/>
                </React.Fragment>
            </div>
        </>
    )
}
