import React from 'react'
import defaultBlocks from './defaultStyles/defaultBlocks'

import {ATEditorBlock, ATEditor, CSSUnit} from './Interfaces'
import {getElementBlockStyle} from './TextEditor'
import SearchUtils from './SearchUtils'
import FormatingUtils from './FormatingUtils'


interface DynamicStyleSetting{
    CSSprefix: string;
    CSSvalue: number;
    CSSunit: CSSUnit;
    Operator: 'increment' | 'decrement';
    RemoveIfZero?: boolean;
}

interface StyleSettings{
    CSSprefix: string;
    CSSvalue: number | string;
    CSSunit?: CSSUnit;
}

const RichBlock = {
    RemoveBlockInlineStyle: (EditorState: ATEditor, CSSprefix: string, CSSValue: string) => {
        let CurrentBlock = SearchUtils.FindBlockByKey(EditorState, EditorState.selectionState.anchorKey) as ATEditorBlock
        if(CurrentBlock !== undefined){
            let CSStyle = FormatingUtils.CreateStyleName(CSSprefix, CSSValue)
            let UpdatedBlockStyles = FormatingUtils.RemoveInlineStyle(CurrentBlock.blockInlineStyles, CSStyle)
            CurrentBlock.blockInlineStyles = UpdatedBlockStyles
        }
        return EditorState
    },
    AddBlockInlineStyle: (EditorState: ATEditor, CSSprefix: string, CSSValue: string) => {
        let CurrentBlock = SearchUtils.FindBlockByKey(EditorState, EditorState.selectionState.anchorKey) as ATEditorBlock
        if(CurrentBlock !== undefined){
            let CSStyle = FormatingUtils.AddStyleToStorage(CSSprefix, CSSValue)
            let UpdatedBlockStyles = FormatingUtils.AddInlineStyle(CurrentBlock.blockInlineStyles, CSStyle)
            CurrentBlock.blockInlineStyles = UpdatedBlockStyles
        }
        return EditorState
    },
    ToggleBlockInlineStyle: (EditorState: ATEditor, CSSprefix: string, CSSValue: string) => {
        let CurrentBlock = SearchUtils.FindBlockByKey(EditorState, EditorState.selectionState.anchorKey) as ATEditorBlock
        if(CurrentBlock !== undefined){
            let CSStyle = FormatingUtils.AddStyleToStorage(CSSprefix, CSSValue)
            let UpdatedBlockStyles = FormatingUtils.ReplaceSimilarOrAddInlineStyle(CurrentBlock.blockInlineStyles, CSStyle, true)
            CurrentBlock.blockInlineStyles = UpdatedBlockStyles
        }
        return EditorState
    },
    AddDynamicStyle: (EditorState: ATEditor, settings: DynamicStyleSetting) => {

        let CSSValue = settings.CSSvalue + settings.CSSunit
        let CSStyle = FormatingUtils.CreateStyleName(settings.CSSprefix, CSSValue)

        let CurrentBlock = SearchUtils.FindBlockByKey(EditorState, EditorState.selectionState.anchorKey) as ATEditorBlock
        let CurrentStyle = FormatingUtils.FindSimilarStyle(CurrentBlock.blockInlineStyles, CSStyle, false) as string

        let UpdatedBlockStyles

        if(CurrentStyle !== undefined){
            let CurrentValue = FormatingUtils.ParseValueFromStyle(CurrentStyle)
            if(CurrentValue !== undefined){
                if(settings.Operator === 'decrement'){
                    CurrentValue = CurrentValue - settings.CSSvalue
                    if(CurrentValue === 0) return EditorState;
                    else if(CurrentValue < 0) CurrentValue = 0
                    CSStyle = FormatingUtils.AddStyleToStorage(settings.CSSprefix, CurrentValue + settings.CSSunit)
                    UpdatedBlockStyles = FormatingUtils.ReplaceSimilarOrAddInlineStyle(CurrentBlock.blockInlineStyles, CSStyle, true)
                }
                else if(settings.Operator === 'increment'){
                    CurrentValue = CurrentValue + settings.CSSvalue
                    CSStyle = FormatingUtils.AddStyleToStorage(settings.CSSprefix, CurrentValue + settings.CSSunit)
                    UpdatedBlockStyles = FormatingUtils.ReplaceSimilarOrAddInlineStyle(CurrentBlock.blockInlineStyles, CSStyle, true)
                }
                else return EditorState

                CurrentBlock.blockInlineStyles = UpdatedBlockStyles as Array<string>
                return EditorState
            }
        }
        if(settings.Operator !== 'decrement'){
            CSStyle = FormatingUtils.AddStyleToStorage(settings.CSSprefix, CSSValue)
            UpdatedBlockStyles = FormatingUtils.ReplaceSimilarOrAddInlineStyle(CurrentBlock.blockInlineStyles, CSStyle, true)
            CurrentBlock.blockInlineStyles = UpdatedBlockStyles
        }
        return EditorState
    },
    ToggleBlockType: (EditorState: ATEditor, BlockType: string): ATEditor => {
        let CurrentBlock = SearchUtils.FindBlockByKey(EditorState, EditorState.selectionState.anchorKey) as ATEditorBlock
        if(CurrentBlock !== undefined){
            if(CurrentBlock.blockStyle === BlockType){
                CurrentBlock.blockStyle = 'unstyled'
            }
            else{
                let CurrentStyle = getElementBlockStyle(BlockType)
                if(CurrentStyle !== undefined){
                    CurrentBlock.blockStyle = CurrentStyle.type
                }
            }
        }
        return EditorState
    },
    hasBlockType: (EditorState: ATEditor, Block: string) => {
        let CurrentBlock = SearchUtils.FindBlockByKey(EditorState, EditorState.selectionState.anchorKey) as ATEditorBlock
        if(CurrentBlock !== undefined){
            if(CurrentBlock.blockStyle === Block){
                return true
            }
            else{
                return false
            }
           
        }
    },
    hasInlineStyle: (EditorState: ATEditor, Style: string | StyleSettings) => {
        if(typeof Style !== "string"){
            Style = FormatingUtils.CreateStyleName(Style.CSSprefix, Style.CSSvalue, Style.CSSunit)
            Style = FormatingUtils.StyleValueReplacer(Style)
        }
        let CurrentBlock = SearchUtils.FindBlockByKey(EditorState, EditorState.selectionState.anchorKey) as ATEditorBlock
        if(CurrentBlock !== undefined){
            if(CurrentBlock.blockInlineStyles.includes(Style)){
                return true
            }
            else{
                return false
            }
           
        }
    }
} 


export default RichBlock