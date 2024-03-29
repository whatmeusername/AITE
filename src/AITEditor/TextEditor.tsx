import {useEffect, useRef} from "react";
import {createTextNode, createBreakLine, createLinkNode, createHorizontalRule, createBlockNode} from "./index";

import defaultBlocks from "./defaultStyles/defaultBlocks";

import "./defaultStyles/defaultinlineStyles.scss";
import "./defaultStyles/AITE_test.scss";

import {AiteHTMLNode, AiteHTMLTextNode, createEmptyEditorState} from "./index";
import {NodeType} from "./nodes";
import {BREAK_LINE_TYPE} from "./ConstVariables";

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

//eslint-disable-next-line
function canDropElement(event: DropEvent): boolean {
	const target = event.target as AiteHTMLNode;
	if (target && target.$isAiteNode) {
		const firstChild: AiteHTMLTextNode | AiteHTMLNode = target.firstChild as any;
		if ((firstChild as AiteHTMLTextNode).$isTextNode || (firstChild as AiteHTMLNode).$AiteNodeType === BREAK_LINE_TYPE) {
			return true;
		} else if ((firstChild.firstChild as AiteHTMLTextNode).$isTextNode) {
			return true;
		}
	}
	return false;
}

//eslint-disable-next-line
function getDragData(event: DragEvent): DragData | null {
	const data = event.dataTransfer?.getData("application/aite-drag-event");
	if (!data) return null;

	const parsedData = JSON.parse(data);
	if (!parsedData) return null;
	return parsedData;
}

function ReactAiteEditor(): JSX.Element {
	const EditorRef = useRef<HTMLDivElement>(null!);
	const EditorState = createEmptyEditorState();

	useEffect(() => {
		EditorState.setInitialLayout(
			createBlockNode({blockWrapper: "header-two"}).append(
				createTextNode("Программи́рование процесс"),
				createTextNode(" создания"),
				createTextNode(" чего то там"),
			),
			createHorizontalRule(),
			createHorizontalRule(),
			createHorizontalRule(),
			createBreakLine(),
			createBlockNode({blockWrapper: "standart"}).append(
				createTextNode(
					"Программи́рование — процесс создания компьютерных программ. По выражению одного из основателей языков программирования Никлауса Вирта «Программы = алгоритмы + структуры данных». Программирование основывается на использовании языков программирования, на которых записываются исходные тексты программ.",
					["ITALIC", "UNDERLINE", "BOLD"],
				),
				createTextNode("some amazing text number 1 ", ["ITALIC", "UNDERLINE", "BOLD"]),
				createTextNode("some amazing text number 2", ["ITALIC", "UNDERLINE", "BOLD"]),
			),
			createBlockNode({blockWrapper: "header-one"}).append(
				createTextNode("Языки программирования", ["STRIKETHROUGH", "UNDERLINE"]),
				createLinkNode("https://yandex.ru").append(
					createTextNode("начало ", ["ITALIC", "UNDERLINE"]),
					createTextNode("середина ", []),
					createTextNode("конец", ["UNDERLINE"]),
				),
				createTextNode(" текст после ссылки", ["ITALIC", "UNDERLINE"]),
			),
		).render(EditorRef.current);

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
	}, []);

	return <div ref={EditorRef}></div>;
}

export {ReactAiteEditor, getElementBlockStyle};

export type {HTMLBlockStyle};
