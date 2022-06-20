const HTML_TEXT_NODE = 3;
const ATTRIBUTE_NODE = 2;
const ELEMENT_NODE = 1;

const BREAK_LINE_TAGNAME = 'BR';
const LINK_NODE_TAGNAME = 'A'

const BREAK_LINE_TYPE = 'breakline'
const ELEMENT_NODE_TYPE = 'element'

const TEXT_NODE_TYPE = 'text'
const LINK_NODE_TYPE = 'link/leaf'
const LIST_NODE_TYPE = 'list/leaf'
const IMAGE_NODE_TYPE = 'image/gif'

const STANDART_BLOCK_TYPE = 'standart'
const HORIZONTAL_RULE_BLOCK_TYPE = 'horizontalrule'

const ORDERED_LIST_ITEM = 'list-ordered-item'
const UNORDERED_LIST_ITEM = 'list-unordered-item'

const EDITOR_PRIORITY = {
	HIGH_EDITOR_COMMAND: 3,
	MEDIUM_EDITOR_COMMAND: 2,
	LOW_EDITOR_COMMAND: 1,
	IGNORE_EDITOR_COMMAND: 0,

	HIGH_IGNORECARET_COMMAND: 100,
	LOW_IGNORECARET_COMMAND: 1,
};


export{
	HTML_TEXT_NODE,
	ATTRIBUTE_NODE,
	ELEMENT_NODE,

	BREAK_LINE_TAGNAME,
	LINK_NODE_TAGNAME,

	BREAK_LINE_TYPE,
	ELEMENT_NODE_TYPE,

	TEXT_NODE_TYPE,
	LINK_NODE_TYPE,
	LIST_NODE_TYPE,
	IMAGE_NODE_TYPE,
	
	STANDART_BLOCK_TYPE,
	HORIZONTAL_RULE_BLOCK_TYPE,

	ORDERED_LIST_ITEM,
	UNORDERED_LIST_ITEM,

	EDITOR_PRIORITY
}
