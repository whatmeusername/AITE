import {getEditorState} from "./index";
import {isArrow, isBackwardRemoveWord, isBackwardRemoveLine, isForwardBackspace, isForwardRemoveLine, isForwardRemoveWord, isApple} from "./EditorUtils";

function onBlurDecorator(callback?: (...args: any) => void): void {
	const EditorState = getEditorState();
	if (EditorState?.focus === true) {
		EditorState.focus = false;
		if (callback) callback();
	}
}

function onFocusDecorator(callback?: (...args: any) => void): void {
	const EditorState = getEditorState();
	if (EditorState?.focus === false) {
		EditorState.focus = true;
		if (callback) callback();
	}
}

function onKeyDownEvent(event: KeyboardEvent): void {
	const EditorState = getEditorState();
	if (EditorState !== undefined) {
		const Key = event.key;
		const isArrowKey = isArrow(event);
		//TODO : REPLACE ACTIVE ELEMENT CONDITION AFTER REDESIGN
		if (EditorState.EditorActiveElementState.isActive === false && isArrowKey === false) {
			const EDC = EditorState.EditorCommands;

			/* 
                HERE WE CHECK FOR AUTO DOT THAT PLACES AFTER DOUBLE SPACE FOR APPLE DEVICES 
            */
			if (event.code === "Space" && event.which === 229 && isApple()) {
				event.preventDefault();
				EDC?.dispatchCommand("LETTER_INSERT_COMMAND", event);
			}

			if (Key === "Backspace" || Key === "Delete") {
				event.preventDefault();

				/* 
                    HERE WE NEEDED TO SORT REMOVING EVENTS,
                    BECAUSE IF EVENT THAT NEEDED MORE BUTTONS TO 
                    CLICK TO CALL COMMAND IS LOWER THAT COMMAND THAT 
                    HAVE SAME BUTTON AND LESS OF THEM TO ACTIVATE THEN 
                    COMMAND WITH LESS BUTTONS WILL BE CALLED 
                */

				if (isForwardRemoveLine(event)) EDC?.dispatchCommand("FORWARD_LINE_REMOVE_COMMAND", event);
				else if (isForwardRemoveWord(event)) EDC?.dispatchCommand("FORWARD_WORD_REMOVE_COMMAND", event);
				else if (isForwardBackspace(event)) EDC?.dispatchCommand("FORWARD_LETTER_REMOVE_COMMAND", event);
				else if (isBackwardRemoveLine(event)) EDC?.dispatchCommand("LINE_REMOVE_COMMAND", event);
				else if (isBackwardRemoveWord(event)) EDC?.dispatchCommand("WORD_REMOVE_COMMAND", event);
				else EDC?.dispatchCommand("LETTER_REMOVE_COMMAND", event);
			} else if (Key === "Enter") {
				event.preventDefault();
				EDC?.dispatchCommand("ENTER_COMMAND", event);
			} else if (isArrowKey === false) event.preventDefault();
		} else if (isArrowKey === false) event.preventDefault();
	} else event.preventDefault();
}

function onKeyUpEvent(event: KeyboardEvent): void {
	const EditorState = getEditorState();
	if (EditorState !== undefined) {
		const isArrowKey = isArrow(event);

		//TODO : REPLACE ACTIVE ELEMENT CONDITION AFTER REDESIGN
		if (EditorState.EditorActiveElementState.isActive === false && isArrowKey === false) {
			if (isArrowKey === false) {
				event.preventDefault();
				EditorState.EditorCommands?.dispatchCommand("LETTER_INSERT_COMMAND", event);
			} else event.preventDefault();
		} else if (isArrowKey === false) event.preventDefault();
	} else event.preventDefault();
}

export {onBlurDecorator, onFocusDecorator, onKeyDownEvent, onKeyUpEvent};
