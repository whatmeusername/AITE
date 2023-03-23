import {EditorState} from "../EditorState";
import {isApple, isArrow, isBackwardRemoveLine, isBackwardRemoveWord, isForwardBackspace, isForwardRemoveLine, isForwardRemoveWord} from "../typeguards";

function onKeyDownEvent(event: KeyboardEvent, EditorState: EditorState): void {
	if (EditorState !== undefined) {
		const Key = event.key;
		const isArrowKey = isArrow(event);
		if (isArrowKey === false) event.preventDefault();
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
		}
	} else event.preventDefault();
}

function onKeyUpEvent(event: KeyboardEvent, EditorState: EditorState): void {
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

export {onKeyDownEvent, onKeyUpEvent};
