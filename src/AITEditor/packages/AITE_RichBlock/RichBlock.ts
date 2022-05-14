import React from 'react';

import {EditorState as editorState} from '../../EditorManagmentUtils';
import type {BlockType} from '../../BlockNode';
import type BlockNode from '../../BlockNode';

import defaultBlocks from '../../defaultStyles/defaultBlocks';
import defaultStyle from '../../defaultStyles/defaultStyle';

interface styleCheck {
	blockIndex?: number;
	charIndex?: number;
}

export default class RichBlock {
	EditorState: editorState;
	EditorStateFunction: () => void;

	constructor(EditorState: editorState, EditorStateFunction: () => void) {
		this.EditorState = EditorState;
		this.EditorStateFunction = EditorStateFunction;
	}

	// findSimilar(style: string, forcedData?: styleCheck){
	//     let CurrentBlock = this.EditorState.contentNode.findBlockByIndex(forcedData?.blockIndex ?? this.EditorState.selectionState.anchorKey) as BlockNode
	//     if(CurrentBlock !== undefined && CurrentBlock.getType() === 'standart'){
	//         let StylePrefix = style.split('__')[0]
	//         return CurrentBlock.blockInlineStyles.find(style => style.startsWith(StylePrefix))
	//         // TBC INDEX
	//     }
	//     return undefined
	// }

	// has(style: string, forcedData?: styleCheck){
	//     let CurrentBlock = this.EditorState.contentNode.findBlockByIndex(forcedData?.blockIndex ?? this.EditorState.selectionState.anchorKey) as BlockNode
	//     if(CurrentBlock !== undefined && CurrentBlock.getType() === 'standart'){
	//         return (CurrentBlock.blockInlineStyles.findIndex(style => style === style) !== -1)
	//     }
	//     return false
	// }

	// toggleBlockWrapper(wrapper: string){
	//     let blockWrapper = defaultBlocks.find(obj => obj.type === wrapper)
	//     if(blockWrapper !== undefined){
	//         let blocksToApply = this.EditorState.contentNode.blocks.slice(this.EditorState.selectionState.anchorKey, this.EditorState.selectionState.focusKey + 1)
	//         blocksToApply.forEach((block: BlockType) => {
	//             if(block.getType() === 'standart'){
	//                 (block as BlockNode).blockWrapper = blockWrapper!.type
	//             }
	//         })
	//     }
	// }
	// toggleBlockStyle(style: string){
	//     let blockStyle = defaultStyle.find(obj => obj.style === style)
	//     if(blockStyle === undefined) return;
	//     let similarStyle = this.findSimilar(blockStyle?.style)
	//     // TBC
	// }
}
