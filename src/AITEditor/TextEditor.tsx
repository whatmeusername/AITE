import {useEffect, useRef} from "react";

import defaultBlocks from "./defaultStyles/defaultBlocks";

import {setImageFloatDirection, toggleImageCaption} from "./packages/AITE_Image/imageUtils";

import "./defaultinlineStyles.scss";
import "./AITE_test.scss";

import {createAITEContentNode, AiteHTMLNode, AiteHTMLTextNode, returnSingleDOMNode, createEmptyEditorState, getEditorState} from "./index";
import {NodeType} from "./nodes";

type HTMLBlockStyle = {type: string; tag: string};

function getElementBlockStyle(Tag: string): HTMLBlockStyle {
	let TagData = {type: "unstyled", tag: "div"};
	TagData = defaultBlocks.find((obj) => obj.tag === Tag || obj.type === Tag) ?? TagData;
	return TagData;
}

interface DragData {
	data: {
		nodePath: Array<number>;
		nodeType: NodeType;
	};
}

interface DropEvent extends DragEvent {
	rangeParent: Node;
	rangeOffset: number;
}

//eslint-disable-next-line
function getDropCaretRange(event: DropEvent): Range | null {
	event.preventDefault();
	let range;
	const selection = getSelection();
	if (!selection) return null;
	if (document.caretRangeFromPoint) {
		range = document.caretRangeFromPoint(event.clientX, event.clientY);
	} else {
		selection.collapse(event.rangeParent || null, (event as any).rangeOffset || 0);
		range = selection.getRangeAt(0);
	}
	return range;
}

function canDropElement(event: DropEvent): boolean {
	const target = event.target as AiteHTMLNode;
	if (target && target.$isAiteNode) {
		const firstChild: AiteHTMLTextNode | AiteHTMLNode = target.firstChild as any;
		if ((firstChild as AiteHTMLTextNode).$isTextNode || (firstChild as AiteHTMLNode).$AiteNodeType === "breakline") {
			return true;
		} else if ((firstChild.firstChild as AiteHTMLTextNode).$isTextNode) {
			return true;
		}
	}
	return false;
}

let test2 = false;

//eslint-disable-next-line
function getDragData(event: DragEvent): DragData | null {
	const data = event.dataTransfer?.getData("application/aite-drag-event");
	if (!data) return null;

	const parsedData = JSON.parse(data);
	if (!parsedData) return null;
	return parsedData;
}

createEmptyEditorState();

function AITEditor(): JSX.Element {
	const EditorRef = useRef<HTMLDivElement>(null!);
	const EditorState = getEditorState();

	useEffect(() => {
		if (test2 === false) {
			test2 = true;
			const EditorNodes = returnSingleDOMNode(createAITEContentNode(EditorState.contentNode)) as AiteHTMLNode[];
			EditorRef.current.replaceChildren(...EditorNodes);

			// EditorRef.current.addEventListener("mousedown", (e) => {
			// 	if (getEditorEventStatus() === false) e.preventDefault();
			// });

			// EditorRef.current.addEventListener("dragstart", (event: any) => {
			// 	const EditorState = getEditorState();

			// 	const dataTransfer = event.dataTransfer;
			// 	if (!dataTransfer) {
			// 		return false;
			// 	}

			// 	const img = document.createElement("img");
			// 	img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

			// 	dataTransfer.setDragImage(img, 0, 0);
			// 	dataTransfer.setData("text/plain", "");

			// 	const nodeData = EditorState.selectionState.getNodeData(getDecoratorNode(event.target));
			// 	dataTransfer.setData(
			// 		"application/aite-drag-event",
			// 		JSON.stringify({
			// 			data: {
			// 				nodeType: nodeData.elementType,
			// 			},
			// 		}),
			// 	);
			// });

			// EditorRef.current.addEventListener("drop", (event) => {
			// 	const dataTransfer = event.dataTransfer;
			// 	if (!dataTransfer) {
			// 		return false;
			// 	}
			// 	if (canDropElement(event as DropEvent)) {
			// 		// let dropRange = getDropCaretRange(event as DropEvent);
			// 		// if (dropRange !== null) {
			// 		// 	let dropData = getDragData(event)?.data;
			// 		// 	let EditorState = getEditorState();
			// 		// 	EditorState.selectionState.getCaretPosition(dropRange);
			// 		// 	let SelectionState = EditorState.selectionState;
			// 		// 	if (dropData !== undefined && dropData.nodePath !== null) {
			// 		// 		let DragElementData = getBlockNodeWithNode(new NodePath(dropData.nodePath), undefined);
			// 		// 		let CaretElementData = getBlockNodeWithNode(SelectionState.anchorPath, 'anchor');
			// 		// 		let DragElementBlock = DragElementData?.block.node;
			// 		// 		let CaretBlockNode = CaretElementData?.block.node;
			// 		// 		if (CaretBlockNode instanceof BlockNode && DragElementBlock instanceof BlockNode && DragElementData?.node) {
			// 		// 			let movedNodeKey = DragElementData?.node?.node.key ?? '';
			// 		// 			let isSameBlock = DragElementBlock.key === CaretBlockNode.key;
			// 		// 			DragElementBlock.removeNodeByKey(movedNodeKey);
			// 		// 			if (isSameBlock === false) {
			// 		// 				DragElementBlock.remount();
			// 		// 			}
			// 		// 			CaretBlockNode.remount();
			// 		// 		}
			// 		// 	}
			// 		// }
			// 	}
			// });

			EditorState.EditorDOMState.__setDOMElement(EditorRef.current as any as AiteHTMLNode);
		}
	}, []); //eslint-disable-line

	return (
		<div className="editor__workspace">
			<div className="editor__test__toolbar">
				<p
					onMouseDown={(e) => e.preventDefault()}
					onClick={(e) => {
						e.preventDefault();
						setImageFloatDirection("right");
					}}
				>
					RIGHT
				</p>
				<p
					onMouseDown={(e) => e.preventDefault()}
					onClick={(e) => {
						e.preventDefault();
						setImageFloatDirection("left");
					}}
				>
					LEFT
				</p>
				<p
					onMouseDown={(e) => e.preventDefault()}
					onClick={(e) => {
						e.preventDefault();
						setImageFloatDirection("none");
					}}
				>
					DIR NULL
				</p>
				<p
					onMouseDown={(e) => e.preventDefault()}
					onClick={(e) => {
						e.preventDefault();
						toggleImageCaption();
					}}
				>
					TOGGLE CAP
				</p>
			</div>
			<div
				ref={EditorRef}
				style={{fontSize: "16px"}}
				className="AITE__editor"
				data-aite_editor_root={true}
				contentEditable={true}
				suppressContentEditableWarning={true}
				spellCheck={false}
				onClick={(event) => {
					EditorState.EditorCommands.dispatchCommand("CLICK_COMMAND", event);
				}}
				onKeyDown={(event) => {
					EditorState?.EditorCommands.dispatchCommand("KEYDOWN_COMMAND", event);
				}}
				onKeyUp={(event) => {
					EditorState?.EditorCommands.dispatchCommand("KEYUP_COMMAND", event);
				}}
				onDrop={(event) => event.preventDefault()}
			></div>
		</div>
	);
}

export {AITEditor, getElementBlockStyle};

export type {HTMLBlockStyle};
