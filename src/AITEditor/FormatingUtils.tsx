import React from 'react';
import defaultInlineStyles from './defaultStyles/defaultInlineStyles';
import SearchUtils from './SearchUtils';

import {CharData, EditorSelection, ATEditorBlock, CSSUnit} from './Interfaces';

const FormatingUtils = {
	CreateStyleName: function (CSSPrefix: string, CSSValue: string | number, CSSUnit?: CSSUnit): string {
		return `${CSSPrefix}__${this.StyleValueReplacer(CSSValue.toString())}${CSSUnit ?? ''}`;
	},
	CreateInlineName: function (CSSPrefix: string, CSSValue: string | number, CSSUnit?: CSSUnit): string {
		return `${CSSPrefix}: ${this.StyleValueReplacer(CSSValue.toString())}${CSSUnit ?? ''}`;
	},
	AddStyleToStorage: function (CSSPrefix: string, CSSValue: string): string {
		let CSSstyle: string = this.CreateInlineName(CSSPrefix, CSSValue);
		let StyleName = `${CSSPrefix}__${this.StyleValueReplacer(CSSValue)}`;
		if (this.CheckIfStyleExists(StyleName) === false) {
			defaultInlineStyles.push({
				style: StyleName,
				tag: '',
				inline: CSSstyle,
			});
		}
		return StyleName;
	},
	CheckIfStyleExists: function (StyleName: string) {
		let FindIndex = defaultInlineStyles.findIndex((obj) => obj.style === StyleName);
		if (FindIndex !== -1) return true;
		else return false;
	},
	ParseValueFromStyle: function (Style: string): number | undefined {
		let SplicedStyle = Style.split('__');
		let value = parseInt(SplicedStyle[1]);
		if (value !== NaN) return value;
		else return undefined;
	},
	StyleValueReplacer: function (StyleValue: string) {
		let NewString = StyleValue.replaceAll('(', '').replaceAll(')', '').replaceAll(',', '_').replaceAll(' ', '_');

		return NewString;
	},
	FindCharFragmentByOffset: (CharData: Array<CharData>, offset: number, End = false) => {
		return CharData.findIndex((obj) => obj[2][End ? 1 : 0] === offset);
	},
	ApplyStyleToCharData: function (CurrentBlock: ATEditorBlock, selectionState: EditorSelection, Style: string) {
		let NewCharData: Array<CharData> = [];
		let CharDataArr: Array<CharData> = SearchUtils.findCurrentCharacters(
			CurrentBlock,
			selectionState.anchorOffset,
			selectionState.focusOffset,
		);
		if (CharDataArr !== undefined) {
			CharDataArr.forEach((CharData: CharData) => {
				NewCharData = this.InsertStyleToChar(CharData, selectionState, Style);
				this.InsertDataInBlock(CurrentBlock, NewCharData);
			});
		}
	},
	EqualStyles(A1: Array<string>, A2: Array<string>) {
		let AL1 = A1.length;
		let AL2 = A2.length;
		let res = true;

		if (AL1 !== AL2) {
			return false;
		}

		for (let style of A2) {
			if (!A1.includes(style)) return false;
		}
		return true;
	},
	OptimizeCharData: function (CharData: Array<CharData>) {
		CharData = JSON.parse(JSON.stringify(CharData));

		CharData.forEach((CurrentCharData: CharData, index: number) => {
			if (CharData[index - 1] !== undefined && this.EqualStyles(CharData[index - 1][1], CurrentCharData[1])) {
				CharData[index - 1][0] += CurrentCharData[0];
				CharData[index - 1][2][1] += CurrentCharData[0].length;
				CharData.splice(index, 1);
			}
		});
		return CharData;
	},
	UpdateLetterRanges: (CharData: Array<CharData>): Array<CharData> => {
		let wordCount = 0;

		CharData.forEach((CharData: CharData) => {
			let CharLength = CharData[0].length;
			CharData[2] = [wordCount, wordCount + CharLength];
			wordCount += CharLength;
		});

		return CharData;
	},
	FindSimilarStyle: (
		CharStyles: Array<string>,
		Style: string,
		returnIndex: boolean = false,
	): string | number | undefined => {
		let StylePrefix = Style.split('__')[0];
		let StyleSearch;
		if (returnIndex === true) StyleSearch = CharStyles.findIndex((s) => s.startsWith(StylePrefix));
		else StyleSearch = CharStyles.find((s) => s.startsWith(StylePrefix));
		return StyleSearch;
	},
	FindStyle: function (CharData: Array<CharData>, Style: string): string | undefined {
		let StylePrefix = Style.split('__')[0];

		for (let CurrentChar of CharData) {
			let SimilarStyle = CurrentChar[1].find((s) => s.startsWith(StylePrefix));
			if (SimilarStyle !== undefined) return SimilarStyle;
		}
		return undefined;
	},
	ReplaceSimilarOrAddInlineStyle: function (
		CharStyles: Array<string>,
		Style: string,
		ToRemove: boolean = false,
	): Array<string> {
		let StyleIndex = this.FindSimilarStyle(CharStyles, Style, true) as number;
		if (StyleIndex !== -1) {
			if (CharStyles[StyleIndex] === Style) {
				if (ToRemove === true) {
					CharStyles.splice(StyleIndex, 1);
				}
			} else CharStyles[StyleIndex] = Style;
		} else {
			CharStyles = [...CharStyles, Style];
		}
		return CharStyles;
	},
	RemoveInlineStyle: (CharStyles: Array<string>, Style: string): Array<string> => {
		let StyleIndex = CharStyles.findIndex((s) => s === Style);
		if (StyleIndex !== -1) {
			CharStyles.splice(StyleIndex, 1);
		}
		return CharStyles;
	},
	AddInlineStyle: (CharStyles: Array<string>, Style: string) => {
		let StyleIndex = CharStyles.findIndex((s) => s === Style);
		if (StyleIndex === -1) {
			CharStyles = [...CharStyles, Style];
		}
		return CharStyles;
	},
	InsertStyleToChar: function (CharData: CharData, SelectionState: EditorSelection, Style: string): Array<CharData> {
		CharData = JSON.parse(JSON.stringify(CharData));

		let CutLength = SelectionState.focusOffset - SelectionState.anchorOffset;
		let offsetStart = SelectionState.anchorOffset - CharData[2][0];
		let offsetEnd = CutLength + offsetStart;
		let CharDataArr: Array<CharData> = [];

		let FirstFragment: CharData = [CharData[0].slice(0, offsetStart), [...CharData[1]], [...CharData[2]]];
		if (FirstFragment[0] !== '') CharDataArr.push(FirstFragment);

		let CentralFragment: CharData = [
			CharData[0].slice(offsetStart, offsetEnd),
			this.ReplaceSimilarOrAddInlineStyle(CharData[1], Style),
			[...CharData[2]],
		];
		if (CentralFragment[0] !== '') CharDataArr.push(CentralFragment);

		let LastFragment: CharData = [CharData[0].slice(offsetEnd), [...CharData[1]], [...CharData[2]]];
		if (LastFragment[0] !== '') CharDataArr.push(LastFragment);

		return CharDataArr;
	},
	InsertDataInBlock: function (Block: ATEditorBlock, NewCharData: Array<CharData>) {
		let CharDataLength: number = NewCharData.length;
		let CharData = Block.CharData;

		let offsetStart = this.FindCharFragmentByOffset(CharData, NewCharData[0][2][0]);
		let offsetEnd = this.FindCharFragmentByOffset(CharData, NewCharData[CharDataLength - 1][2][1], true);

		let NewData = this.UpdateLetterRanges([
			...CharData.slice(0, offsetStart),
			...NewCharData,
			...CharData.slice(offsetEnd + 1),
		]);
		NewData = this.OptimizeCharData(NewData);
		Block.CharData = NewData;
	},
};

export default FormatingUtils;
