import React from 'react'
import RichBlock from './RichBlock'
import RichStyle from './RichStyle'
import {ATEditor} from './Interfaces'

import defaultBlocks from './defaultStyles/defaultBlocks'
import './ATEditorStandartToolbar.scss'



interface props{
    EditorState: ATEditor
    setEditorState: Function

}

export default function StandartToolBar({EditorState, setEditorState}: props){
    return(
        <div className = 'ATEditor__standart__toolbar'>
            {defaultBlocks.map(style => {
                return(
                    <div 
                    className = {`${RichBlock.hasBlockType(EditorState, style.type) ? 'ATEditor__standart__toolbar__item__active' : ''} ATEditor__standart__toolbar__item`}
                    onClick = {() => setEditorState({...RichBlock.ToggleBlockType(EditorState, style.type)})}
                    key = {style.type}
                    >
                        {style.type}
                    </div>
                )
            })}
            <div 
                className = 'test-icon--2'
                onClick = {() => setEditorState({...RichStyle.addInlineStyle(EditorState, 'color', 'red')})}
                onMouseDown = {(e) => e.preventDefault()}
            >
                RED
            </div>
            <div 
                className = 'test-icon--2'
                onClick = {() => setEditorState({...RichStyle.addInlineStyle(EditorState, 'background-color', 'red')})}
                onMouseDown = {(e) => e.preventDefault()}
            >
                BG
            </div>
            <div 
                onClick = {() => setEditorState({...RichStyle.addInlineStyle(EditorState, 'color', 'white')})}
                onMouseDown = {(e) => e.preventDefault()}
            >
                White
            </div>
            <div 
                className = 'test-icon--2'
                onClick = {() => setEditorState({...RichStyle.addInlineStyle(EditorState, 'font-family', 'Fantasy')})}
                onMouseDown = {(e) => e.preventDefault()}
            >
                Fantasy
            </div>
            <div 
                className = 'test-icon--2'
                onClick = {() => setEditorState({...RichStyle.addDynamicStyle(EditorState, {CSSprefix: 'font-size', CSSvalue: 8, CSSunit: 'px', Operator: 'increment', defaultValue: 14})})}
                onMouseDown = {(e) => e.preventDefault()}
            >
                  Font Size +8
            </div>
            <div 
                className = 'test-icon--2'
                onClick = {() => setEditorState({...RichStyle.addDynamicStyle(EditorState, {CSSprefix: 'font-size', CSSvalue: 8, CSSunit: 'px', Operator: 'decrement', defaultValue: 14})})}
                onMouseDown = {(e) => e.preventDefault()}
            >
                  Font Size -8
            </div>

            <div 
                className = {`${RichBlock.hasInlineStyle(EditorState, {CSSprefix: 'text-align', CSSvalue: 'left'}) ? 'ATEditor__standart__toolbar__inline__active' : ''} ATEditor__standart__toolbar__inline`}
                onClick = {() => setEditorState({...RichBlock.ToggleBlockInlineStyle(EditorState, 'text-align', 'left')})}
            >
                BLOCK LEFT
            </div>
            <div 
                className = {`${RichBlock.hasInlineStyle(EditorState, {CSSprefix: 'text-align', CSSvalue: 'center'}) ? 'ATEditor__standart__toolbar__inline__active' : ''} ATEditor__standart__toolbar__inline`}
                onClick = {() => setEditorState({...RichBlock.ToggleBlockInlineStyle(EditorState, 'text-align', 'center')})}
            >
                BLOCK CENTER
            </div>
            <div 
                className = {`${RichBlock.hasInlineStyle(EditorState, {CSSprefix: 'text-align', CSSvalue: 'right'}) ? 'ATEditor__standart__toolbar__inline__active' : ''} ATEditor__standart__toolbar__inline`}
                onClick = {() => setEditorState({...RichBlock.ToggleBlockInlineStyle(EditorState, 'text-align', 'right')})}
            >
                BLOCK RIGHT
            </div>
            <div 
                className = {`${RichBlock.hasInlineStyle(EditorState, {CSSprefix: 'text-align', CSSvalue: 'right'}) ? 'ATEditor__standart__toolbar__inline__active' : ''} ATEditor__standart__toolbar__inline`}
                onClick = {() => setEditorState({...RichBlock.AddDynamicStyle(EditorState, {CSSprefix: 'text-indent', CSSvalue: 20, CSSunit: 'px', Operator: 'increment'})})}
                onMouseDown = {(event) => event.preventDefault()}
            >
                BLOCK INDENT + 
            </div>
            <div 
                className = {`${RichBlock.hasInlineStyle(EditorState, {CSSprefix: 'text-align', CSSvalue: 'right'}) ? 'ATEditor__standart__toolbar__inline__active' : ''} ATEditor__standart__toolbar__inline`}
                onClick = {() => setEditorState({...RichBlock.AddDynamicStyle(EditorState, {CSSprefix: 'text-indent', CSSvalue: 20, CSSunit: 'px', Operator: 'decrement'})})}
            >
                BLOCK INDENT -
            </div>
        </div>
    )
}