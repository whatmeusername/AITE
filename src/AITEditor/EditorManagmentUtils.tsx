import React from 'react'

import {CharData, ATEditor, EditorStateManager} from './Interfaces'
import {BlockManagmentUtils} from './BlockManagmentUtils'

import ContentNode from './ContentNode'
import {SelectionState} from './SelectionUtils'
import EditorCommands from './EditorCommands'

 
type EditorConfig = {
    React?: boolean
    defaultClass: string
    editorDepth: number | undefined

}


const defaultEditorConfig = {
    React: true,
    defaultClass: 'ATE__editor',
    editorDepth: undefined,

}

export class EditorState{
    contentNode: ContentNode
    selectionState: SelectionState
    editorConfig: EditorConfig
    EditorCommands: EditorCommands | undefined 

    constructor(editorConfig: EditorConfig = defaultEditorConfig){
        this.contentNode = new ContentNode()
        this.selectionState = new SelectionState()
        this.editorConfig = defaultEditorConfig
        this.EditorCommands = undefined
    }
}

const EditorManagmentUtils = {
    createNewState: function(withBlock = true): ATEditor {
        let State: ATEditor  = {
            blocks: withBlock ? [
                BlockManagmentUtils.CreateBlock(),

            ]: [],
            selectionState: {anchorOffset: 0, focusOffset: 0, SelectionText: '', anchorKey: '', focusKey: '',},
        }
        return State
    }
}


export default EditorManagmentUtils