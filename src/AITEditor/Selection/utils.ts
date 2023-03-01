import {AiteSelection, SelectionAlter, SelectionDirection, SelectionGranularity} from "./interface";

/**
 * Checks if selection is backward direction
 * @returns boolean
 */
const isSelectionBackward = (rangeOrSelection: Selection | Range): boolean => {
	if (rangeOrSelection instanceof Selection) {
		const pos = rangeOrSelection?.anchorNode?.compareDocumentPosition(rangeOrSelection.focusNode as Node);
		return (!pos && rangeOrSelection.anchorOffset > rangeOrSelection.focusOffset) || pos === Node.DOCUMENT_POSITION_PRECEDING;
	} else {
		const pos = rangeOrSelection?.startContainer?.compareDocumentPosition(rangeOrSelection.endContainer as HTMLElement);
		return (!pos && rangeOrSelection.startOffset > rangeOrSelection.endOffset) || pos === Node.DOCUMENT_POSITION_PRECEDING;
	}
};
/**
 * Returns window getSelection()
 * @returns Selection
 */
const getSelection = (): AiteSelection => window.getSelection() as AiteSelection;

/**
 * Returns window getSelection() with applied modifications to selection
 * @returns Selection
 */
const getMutatedSelection = (alter: SelectionAlter, granularity: SelectionGranularity, direction?: SelectionDirection): AiteSelection => {
	const selection = getSelection();
	(selection as any).modify(alter, direction ? direction : isSelectionBackward(selection) ? "backward" : "forward", granularity);

	return selection;
};

export {isSelectionBackward, getSelection, getMutatedSelection};
