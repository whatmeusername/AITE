import {ATEditorBlock, ATEditor, CharData} from './Interfaces';
import defaultInlineStyles from './defaultStyles/defaultInlineStyles';

const SearchUtils = {
	FindBlockByIndex: function (EditorState: ATEditor, index: number, lastItem: boolean = false, firstItem: boolean = false): ATEditorBlock | undefined {
		let SearchBlock: ATEditorBlock | undefined = undefined;
		if (lastItem === false && firstItem === false) {
			SearchBlock = EditorState.blocks[index];
		}
		if (firstItem === true) {
			SearchBlock = EditorState.blocks[0];
		} else if (lastItem === true) {
			SearchBlock = EditorState.blocks[EditorState.blocks.length - (index !== 0 ? index : 1)];
		}
		if (SearchBlock !== undefined) {
			return SearchBlock;
		}
		return undefined;
	},
	FindBlockByKey: function (EditorState: ATEditor, key: string, returnIndex = false): ATEditorBlock | number | undefined {
		if (returnIndex === true) {
			return EditorState.blocks.findIndex((obj) => obj.blockKey === key);
		}
		return EditorState.blocks.find((obj) => obj.blockKey === key);
	},
	FindMultipleBlocksByKeys: function (EditorState: ATEditor, StartKey: string, EndKey: string) {
		let FoundBlocks: Array<ATEditorBlock> = [];
		let FoundStart = false;
		console.log(StartKey, EndKey);
		for (let CurrentBlock of EditorState.blocks) {
			if (CurrentBlock.blockKey === StartKey) FoundStart = true;
			if (FoundStart === true) {
				FoundBlocks.push(CurrentBlock);
				if (CurrentBlock.blockKey === EndKey) break;
			}
		}
		return FoundBlocks;
	},
	findStyle: function (StyleKey: string) {
		let style = defaultInlineStyles.find((style) => style.style === StyleKey);
		if (style !== undefined) {
			return style;
		} else throw new Error(`Can't find inline style with name ${StyleKey}, because its not defineded `);
	},
	findCurrentCharacters: function (block: ATEditorBlock, start: number, end?: number): Array<CharData> {
		let inlineStyles = block.CharData;
		let StylesArray: Array<CharData> = [];

		if (inlineStyles === undefined || inlineStyles.length === 0) return StylesArray;

		if (end !== undefined) {
			// if(inlineStyles[inlineStyles.length - 1][2][1] < end){
			//     start -= 1
			// }
			// for(let Char of inlineStyles){
			//     let Founded = false
			//     if(Char[2].length === 2){
			//         if(Char[2][0] >= start && Char[2][1] <= end) StylesArray.push(Char)
			//         else if(Char[2][0] >= start && Char[2][1] >= end && Char[2][0] < end) StylesArray.push(Char)
			//         else if(Char[2][0] <= start && Char[2][1] >= end && Char[2][1] <= end) StylesArray.push(Char)
			//         else if(Char[2][0] <= start && Char[2][1] >= start) StylesArray.push(Char)
			//     }
			//     else{
			//         if(Char[2][0] >= start && Char[2][0] <= end){
			//             StylesArray.push(Char)
			//         }
			//     }
			// }
			for (let CharIndex = 0; CharIndex < inlineStyles.length; CharIndex++) {
				let previous = inlineStyles[CharIndex - 1];
				let current = inlineStyles[CharIndex];
				if (previous !== undefined) {
					if (previous[2][1] === current[2][0] && end <= current[2][0]) break;
					else if (previous[2][1] <= start && end <= current[2][1]) {
						StylesArray.push(current);
					}
				} else {
					if (end - 1 <= current[2][1]) StylesArray.push(current);
				}
			}
		} else {
			for (let Char of inlineStyles) {
				if (Char[2][0] <= start || start <= Char[2][1]) StylesArray.push(Char);
			}
		}
		return StylesArray;
	},
};

export default SearchUtils;
