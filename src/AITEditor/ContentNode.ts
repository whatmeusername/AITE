import BlockNode, {HorizontalRuleNode} from './BlockNode';
import {SelectionState, BlockPath} from './SelectionUtils';
import {BREAK_LINE_TAGNAME, BREAK_LINE_TYPE, ELEMENT_NODE_TYPE, TEXT_NODE_TYPE} from './ConstVariables';
import {TextNode, LinkNode, BreakLine} from './AITE_nodes/index'
import {createImageNode} from './packages/AITE_Image/imageNode';
import type {imageNode} from './packages/AITE_Image/imageNode'

import ValidationUtils from './ValidationUtils';
import {BlockType} from './BlockNode';

import {$$mountNode, $$unmountNode, $$updateNodeTextContent, $$bulkUnmountNodes, $$remountNode} from './AITEreconciliation'
import {isDefined} from './EditorUtils'


interface contentNodeConf {
	BlockNodes?: Array<BlockType>;
}

let test = [
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC', 'BOLD']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),
	new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}), new TextNode({plainText: 'Тестовый', stylesArr: ['BOLD']}), new TextNode({plainText: 'текст', stylesArr: ['ITALIC']}), new TextNode({plainText: 'для теста ', stylesArr: ['STRIKETHROUGH']}),

]





export function createContentNode(initData?: contentNodeConf){
	return new ContentNode(initData)
}

export default class ContentNode {
	blocksLength: () => number;
	BlockNodes: Array<BlockNode | HorizontalRuleNode>;

	constructor(initData?: contentNodeConf) {
		this.blocksLength = () => {
			return this.BlockNodes.length;
		};
		this.BlockNodes = initData?.BlockNodes ?? [
			new BlockNode({
				NodeData: [new TextNode({plainText: 'Тестовый текст для редактора', stylesArr: ['ITALIC']})],
				blockWrapper: 'header-two',
			}),
			new HorizontalRuleNode(),
			new BlockNode({
				blockWrapper: 'standart',
				NodeData: [
					new TextNode(
						{plainText: `Программи́рование — процесс создания компьютерных программ. По выражению одного из основателей языков программирования Никлауса Вирта «Программы = алгоритмы + структуры данных». Программирование основывается на использовании языков программирования, на которых записываются исходные тексты программ.`}
					),
	
				],
			}),
			new BlockNode({
				blockWrapper: 'header-one',
				NodeData: [
					new TextNode({plainText: `Языки программирования`}),
				],
			}),
			new BlockNode({
				blockWrapper: 'header-six',
				NodeData: [
					new TextNode({plainText: `совсем `}),
					new TextNode({plainText: `не видимый `, stylesArr: ['ITALIC']}),
					new TextNode({plainText: `текст`}),
				],
			}),
			new BlockNode({
				blockWrapper: 'standart',
				NodeData: [new BreakLine() as any]
			}),
			new BlockNode({
				NodeData: [
					createImageNode({
						src: 'https://i.gifer.com/2GU.gif',
						float: 'left',
						captionEnabled: true,
					}) as imageNode,
					new TextNode(
						{plainText: `Большая часть работы программистов связана с написанием исходного кода, тестированием и отладкой программ на одном из языков программирования. Исходные тексты и исполняемые файлы программ являются объектами авторского права и являются интеллектуальной собственностью их авторов и правообладателей.
		Различные языки программирования поддерживают различные стили программирования (парадигмы программирования). Выбор нужного языка программирования для некоторых частей алгоритма позволяет сократить время написания программы и решить задачу описания алгоритма наиболее эффективно. Разные языки требуют от программиста различного уровня внимания к деталям при реализации алгоритма, результатом чего часто бывает компромисс между простотой и производительностью (или между «временем программиста» и «временем пользователя»).
		Единственный язык, напрямую выполняемый ЭВМ — это машинный язык (также называемый машинным кодом и языком машинных команд). Изначально все программы писались в машинном коде, но сейчас этого практически уже не делается. Вместо этого программисты пишут исходный код на том или ином языке программирования, затем, используя компилятор, транслируют его в один или несколько этапов в машинный код, готовый к исполнению на целевом процессоре, или в промежуточное представление, которое может быть исполнено специальным интерпретатором — виртуальной машиной. Но это справедливо только для языков высокого уровня. Если требуется полный низкоуровневый контроль над системой на уровне машинных команд и отдельных ячеек памяти, программы пишут на языке ассемблера, мнемонические инструкции которого преобразуются один к одному в соответствующие инструкции машинного языка целевого процессора ЭВМ (по этой причине трансляторы с языков ассемблера получаются алгоритмически простейшими трансляторами).
		`,
						stylesArr: ['ITALIC']},
					),
					new LinkNode({
						plainText: 'wikipedia2',
						url: 'https://ru.wikipedia.org/wiki/Заглавная_страница',
					}),
					new LinkNode({
						plainText: ' wikipedia',
						stylesArr: ['BOLD'],
						url: 'https://ru.wikipedia.org/wiki/Заглавная_страница',
					}),
					new TextNode({
						plainText: 'wikipedia2',
					}),
					new LinkNode({
						plainText: ' wikipedia',
						url: 'https://ru.wikipedia.org/wiki/Заглавная_страница',
					}),
				],
			}),
			new BlockNode({
				blockWrapper: 'blockquote',
				NodeData: [
					new TextNode(
						{plainText: `В некоторых языках вместо машинного кода генерируется интерпретируемый двоичный код «виртуальной машины», также называемый байт-кодом (byte-code). Такой подход применяется в Forth, некоторых реализациях Lisp, Java, Perl, Python, языках для .NET Framework.`},
					),
				],
			}),
			new HorizontalRuleNode(),
			new BlockNode({
				blockWrapper: 'list-ordered-item',
				NodeData: [
					new TextNode(
						{plainText: `предмет листа 1`},
					),
				],
			}),
			new BlockNode({
				blockWrapper: 'list-ordered-item',
				NodeData: [
					new TextNode(
						{plainText: `предмет листа 2`},
					),
				],
			}),
			new BlockNode({
				blockWrapper: 'list-ordered-item',
				NodeData: [
					new TextNode(
						{plainText: `предмет листа 3`},
					),
				],
			}),
			new BlockNode({
				blockWrapper: 'header-five',
				NodeData: [
					new TextNode(
						{plainText: `предмет листа 4`},
					),
				],
			}),
			new BlockNode({
				blockWrapper: 'list-unordered-item',
				NodeData: [
					new TextNode(
						{plainText: `предмет листа 5`},
					),
				],
			}),
			new BlockNode({
				blockWrapper: 'list-ordered-item',
				NodeData: [
					new TextNode(
						{plainText: `предмет листа 5`},
					),
				],
			}),
		];
	}

	getCurrentContentNode(selectionKey: BlockPath): ContentNode {
		if (selectionKey.length() !== 1) {
			let currentContentNode = this.getBlockByPath(selectionKey.getPathBeforeLast()) as any;
			if (currentContentNode instanceof ContentNode) return currentContentNode;
			else if (currentContentNode.ContentNode !== undefined) return currentContentNode.ContentNode;
		}
		return this;
	}

	findBlockByIndex(index: number) {
		return this.BlockNodes[index] as BlockNode;
	}

	getBlockByPath(path: Array<number>) {
		if(path.length === 0){
			return this
		}
		else if(path.length === 1){
			return this.BlockNodes[path[0]];
		}
		else{
			let currentBlock: any = this.BlockNodes[path[0]];
			for (let i = 1; i < path.length; i++) {
				if (currentBlock instanceof BlockNode || currentBlock?.NodeData !== undefined) {
					currentBlock = currentBlock.NodeData[path[i]];
				} else if (!(currentBlock instanceof BlockNode)) {
					currentBlock = currentBlock.ContentNode !== undefined ? currentBlock.ContentNode.BlockNodes[path[i]] : currentBlock?.NodeData[path[i]];
				}
			}
			return currentBlock;
		}
	}

	spliceBlockByPath(path: Array<number>): void {
		let currentBlock: any = this.BlockNodes[path[0]];
		if (path.length === 0) {
			this.BlockNodes.splice(path[0], 1);
		} else {
			for (let i = 1; i < path.length; i++) {
				if (i !== path.length - 1) {
					if (currentBlock instanceof BlockNode || currentBlock[0] instanceof BlockNode) {
						currentBlock = currentBlock.NodeData[path[i]];
					} else if (!(currentBlock instanceof BlockNode)) {
						currentBlock = currentBlock?.NodeData[path[i]];
					}
				} else currentBlock.splice(path[i], 1);
			}
		}
	}

	TextNodeSlice(char: TextNode, CharToInsert: string = '', start: number, end?: number): void {
		if (start === -1) {
			char.__content = char.__content + CharToInsert;
		} else if (end !== undefined && end !== -1) {
			char.__content = char.__content.slice(0, start) + CharToInsert + char.__content.slice(end);
		} else if (end === -1) {
			char.__content = char.__content.slice(start) + CharToInsert;
		} else {
			char.__content = char.__content.slice(0, start) + CharToInsert;
		}
	}

	MergeWithUpdate(
		BlockNodes: Array<BlockType> | ContentNode,
		selectionState: SelectionState,
		joiningBlockDirection: 'up' | 'down',
		joiningSideDirection: 'backward' | 'forward',
	): void {
		let AnchorIndex = new BlockPath([...selectionState.anchorPath.get()]);
		let lastConnectingNode = undefined;
		let anchorNodeKey = 0;
		let newAnchorOffset = 0;
		let connectingBlockLength = 0;

		if (joiningSideDirection === 'backward') {
			joiningBlockDirection === 'down' ? AnchorIndex.decrementLastPathIndex(1) : AnchorIndex.incrementLastPathIndex(1);
			let connectingBlock = this.getBlockByPath([...selectionState.anchorPath.get()]) as BlockNode;

			connectingBlockLength = connectingBlock.lastNodeIndex() + 1;
			lastConnectingNode = connectingBlock.NodeData[connectingBlockLength - 1];
			let lastConnectingNodeLength = connectingBlock.NodeData[connectingBlockLength - 1].returnContentLength();

			let connectingMaxSize = connectingBlock.countToIndex(connectingBlockLength - 1);

			let joiningBlock = this.getBlockByPath(AnchorIndex.get()) as BlockNode;

			connectingBlock.NodeData = [...connectingBlock.NodeData, ...joiningBlock.NodeData];

			connectingBlock.blockUpdate();


			if (BlockNodes instanceof ContentNode) BlockNodes.BlockNodes.splice(AnchorIndex.getLastIndex(), 1);
			else BlockNodes.splice(AnchorIndex.getLastIndex(), 1);

			$$unmountNode(AnchorIndex.get())
			$$remountNode(connectingBlock, selectionState.anchorPath.get(), true)

			if (connectingBlock.NodeData.length <= connectingBlockLength) {
				let updateAnchorChar = connectingBlock.findNodeByOffset(connectingMaxSize);
				anchorNodeKey = updateAnchorChar.offsetKey;
				newAnchorOffset = updateAnchorChar.letterIndex;
			} else {
				anchorNodeKey = connectingBlockLength - 1;
				newAnchorOffset = lastConnectingNodeLength;
			}
		} else {
			joiningBlockDirection === 'down' ? AnchorIndex.decrementLastPathIndex(1) : AnchorIndex.incrementLastPathIndex(1);

			let connectingBlock = this.getBlockByPath([...selectionState.anchorPath.get()]) as BlockNode;
			let joiningBlock = this.getBlockByPath(AnchorIndex.get()) as BlockNode;

			connectingBlockLength = connectingBlock.lastNodeIndex() + 1;

			lastConnectingNode = connectingBlock.NodeData[connectingBlockLength - 1];

			connectingBlock.NodeData = [...connectingBlock.NodeData, ...joiningBlock.NodeData];

			connectingBlock.blockUpdate();
			if (BlockNodes instanceof ContentNode){
				BlockNodes.BlockNodes.splice(AnchorIndex.getLastIndex(), 1);
			}
			else BlockNodes.splice(AnchorIndex.getLastIndex(), 1);


			
			$$unmountNode(AnchorIndex.get())
			$$remountNode(connectingBlock, selectionState.anchorPath.get(), true)

			newAnchorOffset = selectionState.anchorOffset;
			anchorNodeKey = selectionState.anchorNodeKey;
			AnchorIndex.decrementLastPathIndex(1);
		}

		selectionState.focusPath = joiningSideDirection !== 'backward' ? AnchorIndex : selectionState.anchorPath;
		selectionState.anchorPath = joiningSideDirection !== 'backward' ? AnchorIndex : selectionState.anchorPath;

		selectionState.anchorNodeKey = anchorNodeKey;
		selectionState.focusNodeKey = selectionState.anchorNodeKey;

		selectionState._anchorNode = selectionState.anchorNodeKey;
		selectionState._focusNode = selectionState.anchorNodeKey;

		selectionState.anchorOffset = newAnchorOffset;
		selectionState.focusOffset = newAnchorOffset;

		selectionState.anchorType = lastConnectingNode.returnType();
		selectionState.focusType = lastConnectingNode.returnType();

		selectionState.isDirty = true;
		selectionState.isCollapsed = true;
	}

	removeBlock(blockIndex: number): void {
		this.BlockNodes.splice(blockIndex, 1)
	}

	sliceBlockFromContent(start: number, end?: number): void {
		this.BlockNodes = [...this.BlockNodes.slice(0, start), ...this.BlockNodes.slice(end ?? start)];
	}

	insertBlockNodeBetween(block: BlockNode, start: number, end?: number): void {
		if (end !== undefined) {
			this.BlockNodes = [...this.BlockNodes.slice(0, start), block, ...this.BlockNodes.slice(end ?? start)];
		} else {
			this.BlockNodes = [...this.BlockNodes.slice(0, start), block];
		}
	}

	getTextNodeOffset(node: TextNode, offset: number): number {
		let TextContentLength = node.returnContentLength();
		if (offset === -1) {
			offset = TextContentLength;
		} else if (offset > TextContentLength) {
			offset = TextContentLength;
		}
		return offset;
	}

	insertLetterIntoTextNode(KeyBoardEvent: React.KeyboardEvent, selectionState: SelectionState): void {
		let Key = KeyBoardEvent.key;
		
		let anchorBlockNode = this.getBlockByPath(selectionState.anchorPath.get()) as BlockNode;
		let focusBlockNode

		let anchorNodeData = anchorBlockNode.NodeData !== undefined ? anchorBlockNode.getNodeByIndex(selectionState.anchorNodeKey) : undefined;
		let focusNodeData

		let isBlockPathEqual = false

		if(anchorNodeData?.returnType() === BREAK_LINE_TYPE){
			let newNode = new TextNode();
			anchorNodeData = newNode
			anchorBlockNode.replaceNode(selectionState.anchorNodeKey, newNode)
			$$remountNode(anchorNodeData, [...selectionState.anchorPath.get(), selectionState.anchorNodeKey], false)
		}
		if(selectionState.isCollapsed === false){
			isBlockPathEqual = selectionState.isBlockPathEqual()
			if(selectionState.anchorNodeKey !== selectionState.focusNodeKey || isBlockPathEqual === false){
				focusBlockNode = this.getBlockByPath(selectionState.focusPath.get()) as BlockNode;
				focusNodeData = focusBlockNode.NodeData !== undefined ? focusBlockNode.getNodeByIndex(selectionState.focusNodeKey) : undefined;
			}
			else{
				focusBlockNode = anchorBlockNode
				focusNodeData = anchorBlockNode.getNodeByIndex(selectionState.focusNodeKey);
			}
			if(focusNodeData && focusNodeData.returnType() === BREAK_LINE_TYPE){
				let newNode = new TextNode();
				focusNodeData = newNode
				focusBlockNode.replaceNode(selectionState.anchorNodeKey, newNode)
			}
			} 
		else {
			focusBlockNode = anchorBlockNode
			focusNodeData = anchorNodeData
		}


		if (selectionState.isCollapsed) {
			if (anchorNodeData instanceof TextNode) {

				let SliceFrom = selectionState.anchorOffset;
				let SliceTo = selectionState.focusOffset;

				if (Key === ' ' && KeyBoardEvent.which === 229) {
					Key = '. ';
					SliceFrom -= 1;
				}

				this.TextNodeSlice(anchorNodeData, Key, SliceFrom, SliceTo);
				$$updateNodeTextContent(anchorNodeData, [...selectionState.anchorPath.get(), selectionState.anchorNodeKey])

				selectionState.moveSelectionForward();
				
			}
		} else if (isBlockPathEqual === true) {
			if (selectionState.isNodesSame() === false) {

				let NodeSplitStart = selectionState.anchorNodeKey + 1;
				let NodeSplitEnd = selectionState.focusNodeKey;

				if (anchorNodeData instanceof TextNode) {

					this.TextNodeSlice(anchorNodeData, Key, selectionState.anchorOffset);
					$$updateNodeTextContent(anchorNodeData, [...selectionState.anchorPath.get(), selectionState.anchorNodeKey])

				} 
				else {

					let previousSibling = anchorBlockNode.previousSibling(selectionState.anchorNodeKey);
					if (previousSibling !== undefined && previousSibling instanceof TextNode) {
						this.TextNodeSlice(previousSibling, Key, -1);
						$$updateNodeTextContent(previousSibling, [...selectionState.anchorPath.get(), selectionState.anchorNodeKey])
					}
					 else NodeSplitStart -= 1;
				}

				if (focusNodeData instanceof TextNode) {

					this.TextNodeSlice(focusNodeData, '', selectionState.focusOffset, -1);
					$$updateNodeTextContent(focusNodeData, [...selectionState.focusPath.get(), selectionState.focusNodeKey])

				} else NodeSplitEnd += 1;

				let nodesToRemove = NodeSplitEnd - NodeSplitStart
				if(nodesToRemove > 0){
					anchorBlockNode.splitNodes(true, NodeSplitStart, NodeSplitEnd);
					$$bulkUnmountNodes(selectionState.anchorPath.get(), nodesToRemove, NodeSplitStart)
				}

				selectionState.moveSelectionForward().toggleCollapse();

			} else {
				if (anchorNodeData instanceof TextNode) {
					this.TextNodeSlice(anchorNodeData, Key, selectionState.anchorOffset, selectionState.focusOffset);
					if (anchorNodeData.returnContent() === '') {
						anchorBlockNode.splitNodes(true, selectionState.anchorNodeKey);
						$$unmountNode([...selectionState.anchorPath.get(), selectionState.anchorNodeKey])
						selectionState.moveSelectionToPreviousSibling(this);
					} else {
						$$updateNodeTextContent(anchorNodeData, [...selectionState.anchorPath.get(), selectionState.anchorNodeKey])
						selectionState.toggleCollapse().moveSelectionForward();
					}	
				} else {
					anchorBlockNode.splitNodes(false, selectionState.anchorNodeKey, selectionState.anchorNodeKey + 1);
					$$unmountNode([...selectionState.anchorPath.get(), selectionState.anchorNodeKey])
				}
			}
		} else if (isBlockPathEqual === false) {

			let NodeSplitStart = selectionState.anchorNodeKey + 1;
			let NodeSplitEnd = selectionState.focusNodeKey;

			if (isDefined(anchorNodeData)) {
				if (anchorNodeData instanceof TextNode) {
					this.TextNodeSlice(anchorNodeData, Key, selectionState.anchorOffset);
				} 
				else {
					let previousSibling = anchorBlockNode.previousSibling(selectionState.anchorNodeKey);
					if (isDefined(previousSibling) && previousSibling instanceof TextNode) {
						this.TextNodeSlice(previousSibling, Key, -1);
					} 
					else anchorBlockNode.splitNodes(false, NodeSplitStart, NodeSplitStart + 1, new TextNode());
					NodeSplitStart -= 1;
				}

				let nodesToRemove = anchorBlockNode.NodeData.length - NodeSplitStart
				if(nodesToRemove > 0){
					anchorBlockNode.removeNodes(true, NodeSplitStart);
				}
			}

			if (isDefined(focusNodeData)) {
				if (focusNodeData instanceof TextNode) {
					this.TextNodeSlice(focusNodeData, anchorNodeData === undefined ? Key : '', selectionState.focusOffset, -1);
				} else NodeSplitEnd += 1;
				if(NodeSplitEnd > 0) focusBlockNode.removeNodes(false, NodeSplitEnd, undefined);
			}

			if(isDefined(anchorNodeData) && isDefined(focusNodeData)) {

				let ParentNode = this.getBlockByPath(selectionState.anchorPath.getPathBeforeLast());
				let ParentContentNode = ParentNode.ContentNode ? ParentNode.ContentNode : ParentNode
				let anchorBlockSlice = selectionState.anchorPath.getPathIndexByIndex(0) + 1
				let focusBlockSlice = selectionState.focusPath.getPathIndexByIndex(0)

				ParentContentNode.sliceBlockFromContent(anchorBlockSlice, focusBlockSlice)
				
				if(focusBlockSlice - anchorBlockSlice > 0){
					$$bulkUnmountNodes(selectionState.anchorPath.getPathBeforeLast(), focusBlockSlice - anchorBlockSlice, anchorBlockSlice)
				}

				this.MergeWithUpdate(ParentContentNode, selectionState, 'up', 'forward');
				selectionState.moveSelectionForward();
			}
			else if (anchorNodeData !== undefined) selectionState.moveSelectionForward();
			else if (focusNodeData !== undefined) {
				selectionState.focusOffset = 0;
				selectionState.toggleCollapse(true);
			}
		}
	}
	removeLetterFromBlock(selectionState: SelectionState): void {

		let anchorBlockNode = this.getBlockByPath(selectionState.anchorPath.get()) as BlockNode;
		let focusBlockNode

		let anchorNodeData = anchorBlockNode.NodeData !== undefined ? anchorBlockNode.getNodeByIndex(selectionState.anchorNodeKey) : undefined;
		let focusNodeData

		let isBlockPathEqual = false
		
		if(selectionState.isCollapsed === false){
			isBlockPathEqual = selectionState.isBlockPathEqual()
			if(selectionState.anchorNodeKey !== selectionState.focusNodeKey || isBlockPathEqual === false){
				focusBlockNode = this.getBlockByPath(selectionState.focusPath.get()) as BlockNode;
				focusNodeData = focusBlockNode.NodeData !== undefined ? focusBlockNode.getNodeByIndex(selectionState.focusNodeKey) : undefined;
			}
			else{
				focusBlockNode = anchorBlockNode
				focusNodeData = anchorBlockNode.getNodeByIndex(selectionState.focusNodeKey);
			}
			} 
		else {
			focusBlockNode = anchorBlockNode
			focusNodeData = anchorNodeData
		}

		if (anchorNodeData === undefined && focusNodeData === undefined) return;
		else if (selectionState.isCollapsed) {
			if (selectionState.isOffsetOnStart()) {

				let currentContentNode: ContentNode | undefined = undefined;
				if (selectionState.anchorPath.length() === 1) currentContentNode = this;
				else currentContentNode = this.getBlockByPath(selectionState.anchorPath.getPathBeforeLast());

				currentContentNode = (currentContentNode as any).ContentNode ?? currentContentNode;


				if (selectionState.anchorPath.getLastIndex() !== 0 && currentContentNode instanceof ContentNode) {
					let previousBlockPath = new BlockPath([...selectionState.anchorPath.get()]);
					previousBlockPath.decrementLastPathIndex(1);

					let previousBlock = currentContentNode.BlockNodes[previousBlockPath.getLastIndex()];
 
					if(!(previousBlock instanceof BlockNode)){
						currentContentNode.removeBlock(previousBlockPath.getLastIndex())
						$$unmountNode(previousBlockPath.get())
						selectionState.anchorPath.decrementLastPathIndex(1)
						selectionState.toggleCollapse()
					}
					else if(
						(anchorBlockNode.isBreakLine() && previousBlock.isBreakLine()) || 
						(anchorBlockNode.isBreakLine() === false && previousBlock.isBreakLine())
						)
					{
						currentContentNode.removeBlock(previousBlockPath.getLastIndex())
						$$unmountNode(previousBlockPath.get())
						selectionState.anchorPath.decrementLastPathIndex(1)
						selectionState.toggleCollapse()
					}
					else if(anchorBlockNode.isBreakLine() && previousBlock.isBreakLine() === false){
						currentContentNode.removeBlock(selectionState.anchorPath.getLastIndex())
						$$unmountNode(selectionState.anchorPath.get())
						selectionState.moveSelectionToPreviousBlock(this)
					}
					else {
						selectionState.anchorPath.decrementLastPathIndex(1);
						this.MergeWithUpdate(currentContentNode.BlockNodes, selectionState, 'up', 'backward');
					}
				}
			} else {

				let textSliceAnchor = selectionState.anchorOffset - 1;
				let SliceFocus = selectionState.focusOffset;

				if (selectionState.anchorOffset === 0) {

					if (anchorBlockNode.previousSibling(selectionState.anchorNodeKey)?.returnType() === ELEMENT_NODE_TYPE) {
						anchorBlockNode.removeNode(selectionState.anchorNodeKey - 1);
						$$unmountNode([...selectionState.anchorPath.get(), selectionState.anchorNodeKey - 1])
						selectionState.anchorNodeKey -= 1;
						selectionState.toggleCollapse().enableDirty();
					}

				} else if (anchorNodeData instanceof TextNode) {

					this.TextNodeSlice(anchorNodeData, '', textSliceAnchor, SliceFocus);

					if (anchorNodeData.returnContent() === '') {

						if(anchorBlockNode.isBreakLine()){
							anchorBlockNode.replaceNode(selectionState.anchorNodeKey, new BreakLine())
							$$remountNode(anchorBlockNode, selectionState.anchorPath.get(), true)
							selectionState.offsetToZero()	
						}
						else{
							anchorBlockNode.removeNode(selectionState.anchorNodeKey)
							$$unmountNode([...selectionState.anchorPath.get(), selectionState.anchorNodeKey])
							selectionState.moveSelectionToPreviousSibling(this);
						}

					} else {
						$$updateNodeTextContent(anchorNodeData, [...selectionState.anchorPath.get(), selectionState.anchorNodeKey])
						selectionState.moveSelectionBackward();
					}
				}
			}
		} else {
			if (isBlockPathEqual) {
				if (selectionState.isNodesSame()) {
					if (anchorNodeData instanceof TextNode) {

						let textSliceAnchor = selectionState.anchorOffset;
						let textSliceFocus = selectionState.focusOffset;

						this.TextNodeSlice(anchorNodeData, '', textSliceAnchor, textSliceFocus);

						if (anchorNodeData.returnContent() === '') {

							if(anchorBlockNode.isBreakLine()){
								anchorBlockNode.replaceNode(selectionState.anchorNodeKey, new BreakLine())
								$$remountNode(anchorBlockNode, selectionState.anchorPath.get(), true)
								selectionState.offsetToZero()	
							}
							else{
								anchorBlockNode.removeNode(selectionState.anchorNodeKey)
								$$unmountNode([...selectionState.anchorPath.get(), selectionState.anchorNodeKey])
								selectionState.moveSelectionToPreviousSibling(this);
							}
	
						} else {
							$$updateNodeTextContent(anchorNodeData, [...selectionState.anchorPath.get(), selectionState.anchorNodeKey])
							selectionState.moveSelectionBackward();
						}
					} else {
						anchorBlockNode.removeNode(selectionState.anchorNodeKey); 
						$$unmountNode([...selectionState.anchorPath.get(), selectionState.anchorNodeKey])
						selectionState.moveSelectionToPreviousSibling(this);
					}

				} else if (selectionState.anchorNodeKey !== selectionState.focusNodeKey) {

					let textSliceAnchor = selectionState.anchorOffset;
					let textSliceFocus = selectionState.focusOffset;

					let nodeSliceAnchor = selectionState.anchorNodeKey + 1;
					let nodeSliceFocus = selectionState.focusNodeKey;

					if (anchorNodeData instanceof TextNode) {
						this.TextNodeSlice(anchorNodeData, '', textSliceAnchor);

						if (anchorNodeData?.returnContent() === '') nodeSliceAnchor -= 1;
						else if(anchorNodeData !== undefined) {
							$$updateNodeTextContent(anchorNodeData, [...selectionState.anchorPath.get(), selectionState.anchorNodeKey])
						}
					} else nodeSliceFocus -= 1;

					if (focusNodeData instanceof TextNode) {
						
						focusNodeData = focusNodeData;
						this.TextNodeSlice(focusNodeData, '', textSliceFocus, -1);

						if (focusNodeData.returnContent() === '') nodeSliceFocus += 1;
						else $$updateNodeTextContent(focusNodeData, [...selectionState.focusPath.get(), selectionState.focusNodeKey])

					} else nodeSliceFocus += 1;

					let nodesToRemove = nodeSliceFocus - nodeSliceAnchor
					if(nodesToRemove > 0){ 
						anchorBlockNode.splitNodes(true, nodeSliceAnchor, nodeSliceFocus);
						if(anchorBlockNode.isBreakLine()){
							let breakLineNode = new BreakLine()
							anchorBlockNode.replaceNode(0, breakLineNode)
							$$remountNode(anchorBlockNode, selectionState.anchorPath.get())
							selectionState.offsetToZero()
						}
						else {
							$$bulkUnmountNodes([...selectionState.anchorPath.get()], nodeSliceFocus - nodeSliceAnchor, nodeSliceAnchor)
							if (anchorNodeData instanceof TextNode && anchorNodeData?.returnContent() === '') {
								selectionState.moveSelectionToPreviousSibling(this);
							}
							else if(anchorNodeData !== undefined) selectionState.toggleCollapse().enableDirty();
						}
					}
					else if(anchorBlockNode.isBreakLine()){
						let breakLineNode = new BreakLine()
						anchorBlockNode.replaceNode(0, breakLineNode)
						$$remountNode(anchorBlockNode, selectionState.anchorPath.get())
						selectionState.offsetToZero()
					}
				}

			} else if (isBlockPathEqual === false) {
				let textSliceAnchor = selectionState.anchorOffset;
				let textSliceFocus = selectionState.focusOffset;

				let BlockSliceAnchor = selectionState.anchorPath.getLastIndex() + 1;
				let BlockSliceFocus = selectionState.focusPath.getLastIndex();

				let nodeSliceAnchor = selectionState.anchorNodeKey + 1;
				let nodeSliceFocus = selectionState.focusNodeKey;

				let anchorBlockPath =  [...selectionState.anchorPath.get()]
	

				if (anchorNodeData instanceof TextNode) {
					this.TextNodeSlice(anchorNodeData, '', textSliceAnchor);
					if (anchorNodeData.returnContent() === '') {
						nodeSliceAnchor -= 1;
					} 
			
				} else nodeSliceAnchor -= 1;
				if(nodeSliceAnchor > 0) anchorBlockNode.removeNodes(true, nodeSliceAnchor);

				if (focusNodeData instanceof TextNode) {
					this.TextNodeSlice(focusNodeData, '', textSliceFocus, -1);
					if (focusNodeData.returnContent() === '') nodeSliceFocus += 1;
				} else nodeSliceFocus += 1;
				if(nodeSliceFocus > 0) focusBlockNode.removeNodes(false, nodeSliceFocus);

				let ParentNode = this.getBlockByPath(selectionState.anchorPath.getPathBeforeLast());
				let ParentContentNode = ParentNode.ContentNode ? ParentNode.ContentNode : ParentNode 
				if (ParentContentNode instanceof ContentNode) {
					ParentContentNode.sliceBlockFromContent(BlockSliceAnchor, BlockSliceFocus);
					let blockToRemove = BlockSliceFocus - BlockSliceAnchor
					$$bulkUnmountNodes(selectionState.anchorPath.getPathBeforeLast(), blockToRemove, BlockSliceAnchor)
					if(anchorBlockNode.isBreakLine() && focusBlockNode.isBreakLine()) {
						let breakLine = new BreakLine()
						anchorBlockNode.replaceNode(0, breakLine)
						$$remountNode(anchorBlockNode, anchorBlockPath, true)
						selectionState.offsetToZero().toggleCollapse();
					}
					else {
						this.MergeWithUpdate(ParentContentNode, selectionState, 'up', 'backward');
						if ((anchorNodeData as TextNode).returnContent() === '') {
							selectionState.moveSelectionToPreviousSibling(this);
						} 
						else selectionState.toggleCollapse();
					}
				}
			}
		}
	}
	handleEnter(selectionState: SelectionState): void {
		let anchorBlockPath = selectionState.anchorPath;

		if (selectionState.isOffsetOnStart()) {
			let newBlockNode = new BlockNode({NodeData: [new BreakLine()]})
			this.getCurrentContentNode(anchorBlockPath).insertBlockNodeBetween(
				newBlockNode,
				anchorBlockPath.getLastIndex(),
				anchorBlockPath.getLastIndex(),
			);
			$$mountNode(newBlockNode, anchorBlockPath.get(), 'before')
			selectionState.anchorPath.incrementLastPathIndex(1)
			selectionState.toggleCollapse()

		} else if (selectionState.isCollapsed) {

			let CurrentBlock = this.getBlockByPath(anchorBlockPath.get());
			let anchorNode = CurrentBlock.findCharByIndex(selectionState.anchorNodeKey);

			let anchorNodeSlice = selectionState.anchorNodeKey;
			let SlicedNodes = undefined;
			let currentContentNode: ContentNode = this.getCurrentContentNode(anchorBlockPath);

			if (selectionState.anchorOffset !== 0) {
				if (anchorNode instanceof TextNode) {
					let SliceContent = anchorNode.getSlicedContent(false, selectionState.anchorOffset);
					this.TextNodeSlice(anchorNode, '', selectionState.anchorOffset);
					anchorNodeSlice += 1;
					if(SliceContent !== ''){
						SlicedNodes = anchorNode.createSelfNode({plainText: SliceContent, stylesArr: anchorNode.returnNodeStyle()});
					}
				} else {
					anchorNodeSlice += 1;
					SlicedNodes = undefined;
				}
			}
			let SliceCharNodes = CurrentBlock.NodeData.slice(anchorNodeSlice);
			let blockLength = CurrentBlock.getLength() - 1
			if(SliceCharNodes.length > 0) CurrentBlock.splitNodes(true, anchorNodeSlice);

			if(blockLength === selectionState.anchorNodeKey){
				$$updateNodeTextContent(anchorNode, [...anchorBlockPath.get(), selectionState.anchorNodeKey])
			}
			else if(blockLength - 1 !== selectionState.anchorNodeKey){
				$$remountNode(CurrentBlock, anchorBlockPath.get(), true)
			}
		

			if(SlicedNodes !== undefined) SliceCharNodes = [SlicedNodes ?? [], ...SliceCharNodes];
			else if(SlicedNodes === undefined && SliceCharNodes.length === 0) SliceCharNodes = [new BreakLine()]

			let newBlockNode = new BlockNode({
				NodeData: SliceCharNodes,
				blockWrapper: CurrentBlock.blockWrapper,
			});


			currentContentNode.insertBlockNodeBetween(newBlockNode, anchorBlockPath.getLastIndex() + 1, anchorBlockPath.getLastIndex() + 1);
			$$mountNode(newBlockNode, anchorBlockPath.get(), 'after')

			selectionState.moveSelectionToNextSibling(this);
		} else {

			if (selectionState.isBlockPathEqual()) {
				let AnchorBlock = this.getBlockByPath(anchorBlockPath.get()) as BlockNode;
				let currentContentNode: ContentNode = this.getCurrentContentNode(anchorBlockPath);

				let anchorNodeData = AnchorBlock.getNodeByIndex(selectionState.anchorNodeKey);
				let focusNodeData = AnchorBlock.getNodeByIndex(selectionState.focusNodeKey);

				let anchorNodeSlice = selectionState.anchorNodeKey + 1;
				let focusNodeSlice = selectionState.focusNodeKey + 1;
				let SlicedTextNode: undefined | TextNode = undefined;

				if (anchorNodeSlice !== focusNodeSlice) {
					if (anchorNodeData instanceof TextNode) {
						this.TextNodeSlice(anchorNodeData, '', selectionState.anchorOffset);
					} else focusNodeSlice += 1;

					if (focusNodeData instanceof TextNode) {
						SlicedTextNode = focusNodeData.createSelfNode({
							plainText: focusNodeData.getSlicedContent(false, selectionState.focusOffset),
							stylesArr: focusNodeData.returnNodeStyle(),
						});
						this.TextNodeSlice(focusNodeData, '', selectionState.focusOffset, -1);
					} else focusNodeSlice += 1;
				} else {
					if (focusNodeData instanceof TextNode) {
						SlicedTextNode = focusNodeData.createSelfNode({
							plainText: focusNodeData.getSlicedContent(false, selectionState.focusOffset),
							stylesArr: focusNodeData.returnNodeStyle(),
						});
						this.TextNodeSlice(focusNodeData, '', selectionState.anchorOffset);
					} else focusNodeSlice += 1;
				}

				let SliceCharNodes = AnchorBlock.NodeData.slice(focusNodeSlice);
				if (SlicedTextNode !== undefined) {
					SliceCharNodes = [SlicedTextNode, ...SliceCharNodes];
				}

				if(SliceCharNodes.length > 0){
					AnchorBlock.splitNodes(true, anchorNodeSlice);
					$$remountNode(AnchorBlock, selectionState.anchorPath.get(), true)
				}
				else if(anchorNodeData instanceof TextNode){
					this.TextNodeSlice(anchorNodeData, '', selectionState.anchorOffset);
					$$updateNodeTextContent(anchorNodeData, [...anchorBlockPath.get(), selectionState.anchorNodeKey])
					SliceCharNodes = [new BreakLine()];
				}

				let newBlockNode = new BlockNode({
					NodeData: SliceCharNodes,
					blockType: AnchorBlock.blockType,
				});

				currentContentNode.insertBlockNodeBetween(newBlockNode, anchorBlockPath.getLastIndex() + 1, anchorBlockPath.getLastIndex() + 1);
				$$mountNode(newBlockNode, anchorBlockPath.get(), 'after')

				selectionState.moveSelectionToNextSibling(this);
			} else if (selectionState.isBlockPathEqual() === false) {
				this.removeLetterFromBlock(selectionState);
			}
		}
	}
}
