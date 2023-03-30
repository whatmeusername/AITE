import {AiteNode, createAiteNode} from "./AiteNode";
import type {EditorState} from "../EditorState";

function createEditorRoot(EditorState: EditorState): AiteNode {
	const props = {
		contentEditable: true,
		style: {fontSize: "16px"},
		class: "AITE__editor",
		"data-aite_editor_root": true,
		spellCheck: "false",
		onClick: (event: MouseEvent) => {
			EditorState.EditorCommands.dispatchCommand("CLICK_COMMAND", event);
		},
		onKeyDown: (event: KeyboardEvent) => {
			EditorState?.EditorCommands.dispatchCommand("KEYDOWN_COMMAND", event);
		},
		onKeyUp: (event: KeyboardEvent) => {
			EditorState?.EditorCommands.dispatchCommand("KEYUP_COMMAND", event);
		},
		onDrop: (event: DragEvent) => {
			event.preventDefault();
		},
	};

	return createAiteNode(null, "div", props, [EditorState.contentNode.createNodeState()]);
}

export {createEditorRoot};
