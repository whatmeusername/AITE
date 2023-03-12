import type {AiteHTML, AiteHTMLNode} from "../EditorDOM";
import {Nullable} from "../Interfaces";

interface SelectedNodeData {
	node: AiteHTMLNode;
	nodeKey: Nullable<number>;
}

interface SelectionData {
	nodeKey: Nullable<number>;
	node: AiteHTMLNode;
	nodePath: Array<number>;
}

interface AiteRange extends Omit<Range, "startContainer" | "endContainer"> {
	startContainer: AiteHTML;
	endContainer: AiteHTML;
}

interface AiteSelection extends Omit<Selection, "focusNode" | "anchorNode"> {
	focusNode: AiteHTML;
	anchorNode: AiteHTML;
	getRangeAt: (index: number) => AiteRange;
}

type SelectionGranularity = "character" | "word" | "sentence" | "line" | "lineboundary" | "sentenceboundary";
type SelectionAlter = "move" | "extend";
type SelectionDirection = "backward" | "forward";

export type {SelectedNodeData, SelectionData, AiteRange, AiteSelection, SelectionGranularity, SelectionAlter, SelectionDirection};
