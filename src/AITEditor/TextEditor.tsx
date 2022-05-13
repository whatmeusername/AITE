import React, {useState, useEffect} from 'react'

import defaultBlocks from './defaultStyles/defaultBlocks'

import {CreateReactEditor} from './BlockManagmentUtils'
import {EditorState as editorState} from './EditorManagmentUtils'

import EditorCommands from './EditorCommands'

import RichBlock from './packages/AITE_RichBlock/RichBlock'
import activeElementState from './packages/AITE_ActiveState/activeElementState'
import setImageFloatDirection from './packages/AITE_Image/imageFloatDirection'

import './defaultinlineStyles.scss'
import './AITE_test.scss'

export type CharData = [string, Array<string>, Array<number>]

export type HTMLBlockStyle = {type: string, tag: string}
export type HTMLCharStyle = {style: string, tag: string}



export function getElementBlockStyle(Tag: string): HTMLBlockStyle {
    let TagData = {type: 'unstyled', tag: 'div'}
    TagData = defaultBlocks.find(obj => obj.tag === Tag || obj.type === Tag) ?? TagData
    return TagData
}

interface DropEvent extends DragEvent {
    rangeOffset?: number;
    rangeParent?: Node;
}


export default function AITEditor(){

    const EditorRef = React.useRef<HTMLDivElement>(null!)

    const [EditorState, setEditorState] = useState<editorState>(new editorState())


    function keyCodeValidator(event: KeyboardEvent | React.KeyboardEvent){

        const SYMBOLS = [
            'Comma', 
            'Period', 
            'Minus', 
            'Equal', 
            'IntlBackslash', 
            'Slash', 
            'Quote', 
            'Semicolon', 
            'Backslash', 
            'BracketRight', 
            'BracketLeft',
            'Backquote'
        ]

        if(
            event.code.startsWith('Key') ||
            event.code === 'Space' ||
            event.code.startsWith('Digit') ||
            SYMBOLS.includes(event.code)

            ) return true
        return false
    }

    function HandleKeyClick(event: React.KeyboardEvent) {
        let Key = event.key
        const AllowedKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']


        console.log(event)
        if(EditorState.EditorActiveElementState?.isActive === false){
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
            else if(keyCodeValidator(event)){
                event.preventDefault()
                EditorState.contentNode.insertLetterIntoTextNode(event, EditorState.selectionState)
            }
            else if(!AllowedKeys.includes(Key)){
                event.preventDefault()
            }
        }
        else event.preventDefault()
    }
    
    useEffect(() => { 
        if(EditorState.EditorCommands === undefined){
            EditorState.EditorCommands = new EditorCommands(() => setEditorState({...EditorState}))
            EditorState.EditorActiveElementState = new activeElementState(() => setEditorState({...EditorState}), EditorState)


            EditorState.EditorCommands.registerCommand(
                'KEYBOARD_COMMAND',
                'IMMEDIATELY_EDITOR_COMMAND',
                (event) => HandleKeyClick(event)
            )
        
            EditorState.EditorCommands.registerCommand(
                'SELECTION_COMMAND',
                'IGNOREMANAGER_EDITOR_COMMAND',
                (_) => EditorState.selectionState.$getCaretPosition()
            )

            EditorState.EditorCommands.registerCommand(
                'CLICK_COMMAND',
                'IMMEDIATELY_EDITOR_COMMAND',
                (event) => EditorState.EditorActiveElementState?.handleElementClick(event)
            )

            setEditorState({...EditorState})
        }
        if(EditorState.EditorActiveElementState?.isActive === false){
            if(EditorState.selectionState.isDirty ){
                EditorState.selectionState.$normailizeDirtySelection(EditorRef)
            }
            EditorState.selectionState.setCaretPosition()
        }
    }, [EditorState])


    // let richBlock = new RichBlock(EditorState, () => setEditorState({...EditorState}))
    // richBlock.toggleBlockWrapper('header-one')

    return(
        <div className="editor__workspace">
            <div className="editor__test__toolbar">
                <p
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                    e.preventDefault()
                    setImageFloatDirection(EditorState, 'right')
                    setEditorState({...EditorState})
                }}
                >RIGHT</p>
                <p
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                    e.preventDefault()
                    setImageFloatDirection(EditorState, 'left')
                    setEditorState({...EditorState})
                }}
                >LEFT</p>
                <p
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                    e.preventDefault()
                    setImageFloatDirection(EditorState, 'none')
                    setEditorState({...EditorState})
                }}
                >DIR NULL</p>
            </div>
            <div
                ref = {EditorRef}
                style = {{fontSize: '16px'}}
                className = 'AITE__editor'

                data-aite_editor_root = {true}
                contentEditable = {true}
                suppressContentEditableWarning = {true}

                spellCheck = {false}
                onClick = {(event) =>  EditorState.EditorCommands?.dispatchCommand('CLICK_COMMAND', event)}
                onSelect = {(event) => EditorState.EditorCommands?.dispatchCommand('SELECTION_COMMAND', event)}
                
                onKeyDown = {(event) => EditorState.EditorCommands?.dispatchCommand('KEYBOARD_COMMAND', event)}

                onDrop = {(event) => event.preventDefault()}

            >
                <React.Fragment>
                    <CreateReactEditor EditorState = {EditorState}/>
                </React.Fragment>
            </div>
        </div>
    )
}
