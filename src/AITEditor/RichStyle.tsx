import React from 'react';
import {ATEditorBlock, ATEditor, CSSUnit} from './Interfaces';
import defaultInlineStyles from './defaultStyles/defaultInlineStyles';
import SearchUtils from './SearchUtils';
import FormatingUtils from './FormatingUtils';

interface StyleSettings {
	CSSprefix: string;
	CSSvalue: number | string;
	CSSunit?: CSSUnit;
}

interface DynamicStyleSetting {
	CSSprefix: string;
	CSSvalue: number;
	CSSunit: CSSUnit;
	Operator: 'increment' | 'decrement';
	RemoveIfZero?: boolean;
	defaultValue?: number;
}

const RichStyle = {
	removeInlineStyle: (EditorState: ATEditor, CSSPrefix: string, CSSValue: string) => {}, // --- TO BE CREATED

	addInlineStyle: (EditorState: ATEditor, CSSPrefix: string, CSSValue: string) => {
		let CurrentBlock = SearchUtils.FindBlockByKey(
			EditorState,
			EditorState.selectionState.anchorKey,
		) as ATEditorBlock;
		let CurrentBlockIndex = SearchUtils.FindBlockByKey(
			EditorState,
			EditorState.selectionState.anchorKey,
			true,
		) as number;
		let CurrentSelection = {...EditorState.selectionState};
		if (CurrentBlock !== undefined) {
			if (CurrentSelection.anchorOffset === CurrentSelection.focusOffset) {
				let SplittedPlainText = CurrentBlock.plainText.split(' ');
				let CharCount = 0;
				for (let word of SplittedPlainText) {
					CharCount += word.length;
					if (CharCount >= CurrentSelection.anchorOffset) {
						CurrentSelection.anchorOffset = CharCount - word.length;
						CurrentSelection.focusOffset = CharCount;
						CurrentSelection.SelectionText = word;
						break;
					}
					CharCount += 1;
				}
			}
			let CSSstyle = FormatingUtils.AddStyleToStorage(CSSPrefix, CSSValue);
			FormatingUtils.ApplyStyleToCharData(CurrentBlock, CurrentSelection, CSSstyle);
		}
		return EditorState;
	},
	addDynamicStyle: function (EditorState: ATEditor, settings: DynamicStyleSetting) {
		let CSSValue = settings.CSSvalue + (settings.defaultValue ?? 0) + settings.CSSunit;
		let CSSstyle = FormatingUtils.CreateStyleName(settings.CSSprefix, CSSValue);

		let CurrentBlock = SearchUtils.FindBlockByKey(
			EditorState,
			EditorState.selectionState.anchorKey,
		) as ATEditorBlock;
		let CurrentSelection = {...EditorState.selectionState};
		let CharData = SearchUtils.findCurrentCharacters(
			CurrentBlock,
			CurrentSelection.anchorOffset,
			CurrentSelection.focusOffset,
		);
		let CurrentStyle = FormatingUtils.FindStyle(CharData, CSSstyle) as string;

		if (CurrentSelection.anchorOffset === CurrentSelection.focusOffset) {
			let SplittedPlainText = CurrentBlock.plainText.split(' ');
			let CharCount = 0;
			for (let word of SplittedPlainText) {
				CharCount += word.length;
				if (CharCount >= CurrentSelection.anchorOffset) {
					CurrentSelection.anchorOffset = CharCount - word.length;
					CurrentSelection.focusOffset = CharCount;
					CurrentSelection.SelectionText = word;
					break;
				}
				CharCount += 1;
			}
		}

		if (CurrentStyle !== undefined) {
			let CurrentValue = FormatingUtils.ParseValueFromStyle(CurrentStyle);
			if (CurrentValue !== undefined) {
				if (settings.Operator === 'decrement') {
					CurrentValue = CurrentValue - settings.CSSvalue;
					if (CurrentValue === 0) return EditorState;
					else if (CurrentValue < 0) CurrentValue = 0;
					CSSstyle = FormatingUtils.AddStyleToStorage(settings.CSSprefix, CurrentValue + settings.CSSunit);
					FormatingUtils.ApplyStyleToCharData(CurrentBlock, CurrentSelection, CSSstyle);
				} else if (settings.Operator === 'increment') {
					CurrentValue = CurrentValue + settings.CSSvalue;
					CSSstyle = FormatingUtils.AddStyleToStorage(settings.CSSprefix, CurrentValue + settings.CSSunit);
					FormatingUtils.ApplyStyleToCharData(CurrentBlock, CurrentSelection, CSSstyle);
				}
				return EditorState;
			}
		}
		if (settings.Operator !== 'decrement') {
			CSSstyle = FormatingUtils.AddStyleToStorage(settings.CSSprefix, CSSValue);
			FormatingUtils.ApplyStyleToCharData(CurrentBlock, CurrentSelection, CSSstyle);
		}
		return EditorState;
	},
	toggleInlineStyle: (EditorState: ATEditor, CSSPrefix: string, CSSValue: string) => {}, // --- TO BE CREATED
};

export default RichStyle;
