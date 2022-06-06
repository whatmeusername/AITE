import {getEditorState} from './EditorState'
import {isArrow, isBackwardRemoveWord, isBackwardRemoveLine, isForwardBackspace, isForwardRemoveLine, isForwardRemoveWord} from './EditorUtils';



function onBlurDecorator(callback?: (...args: any) => void): void {
    let EditorState = getEditorState()
    if(EditorState?.focus === true){
        EditorState.focus = false
        if(callback) callback()
    }
}


function onFocusDecorator(callback?: (...args: any) => void): void {
    let EditorState = getEditorState()
    if(EditorState?.focus === false){
        EditorState.focus = true
        if(callback) callback()
    }
}

function addRootEvents(){
    
}


function onKeyDownEvent(event: KeyboardEvent){
    let EditorState = getEditorState()
    if(EditorState !== undefined){
        let Key = event.key
        let isArrowKey = isArrow(event);
        if (EditorState.EditorActiveElementState?.isActive === false && isArrowKey === false) {
            let EDC = EditorState.EditorCommands
            if (Key === 'Backspace' || Key === 'Delete') {
                event.preventDefault();

                /* 
                    HERE WE NEEDED TO SORT REMOVING EVENTS,
                    BECAUSE IF EVENT THAT NEEDED MORE BUTTONS TO 
                    CLICK TO CALL COMMAND IS LOWER THAT COMMAND THAT 
                    HAVE SAME BUTTON AND LESS OF THEM TO ACTIVATE THEN 
                    COMMAND WITH LESS BUTTONS WILL BE CALLED 
                */
               
                if (isForwardRemoveLine(event)) EditorState.EditorCommands?.dispatchCommand('FORWARD_LINE_REMOVE_COMMAND', event);
                else if (isForwardRemoveWord(event)) EditorState.EditorCommands?.dispatchCommand('FORWARD_WORD_REMOVE_COMMAND', event);
                else if (isForwardBackspace(event)) EditorState.EditorCommands?.dispatchCommand('FORWARD_LETTER_REMOVE_COMMAND', event);
                else if (isBackwardRemoveLine(event)) EditorState.EditorCommands?.dispatchCommand('LINE_REMOVE_COMMAND', event);
                else if (isBackwardRemoveWord(event)) EDC?.dispatchCommand('WORD_REMOVE_COMMAND', event);
				else EditorState.EditorCommands?.dispatchCommand('LETTER_REMOVE_COMMAND', event);
                
            } else if (Key === 'Enter') {
                event.preventDefault();
                EditorState.EditorCommands?.dispatchCommand('ENTER_COMMAND', event);
            }
            else if (isArrowKey === false) event.preventDefault();
        }
        else if(isArrowKey === false) event.preventDefault();
    } 
    else event.preventDefault();
}

function onKeyUpEvent(event: KeyboardEvent){
    let EditorState = getEditorState();
    if(EditorState !== undefined){
        let Key = event.key
        let isArrowKey = isArrow(event);
        if (EditorState.EditorActiveElementState?.isActive === false && isArrowKey === false) {
            if (isArrowKey === false){
                event.preventDefault();
                EditorState.EditorCommands?.dispatchCommand('LETTER_INSERT_COMMAND', event);
            }
            else event.preventDefault()
        } 
        else if (isArrowKey === false) event.preventDefault()
    }
    else event.preventDefault();
}


export {
    onBlurDecorator,
    onFocusDecorator,

    onKeyDownEvent,
    onKeyUpEvent
}