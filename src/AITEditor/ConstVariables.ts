const HTML_TEXT_NODE = 3;
const ATTRIBUTE_NODE = 2;
const ELEMENT_NODE = 1;

const BREAK_LINE_TAGNAME = 'BR';
const LINK_NODE_TAGNAME = 'A'

const BREAK_LINE_TYPE = 'breakline'
const ELEMENT_NODE_TYPE = 'element'

const TEXT_NODE_TYPE = 'text'
const LINK_NODE_TYPE = 'link'
const IMAGE_NODE_TYPE = 'image'

const STANDART_BLOCK_TYPE = 'standart'
const HORIZONTAL_RULE_BLOCK_TYPE = 'horizontalrule'

const ORDERED_LIST_ITEM = 'list-ordered-item'
const UNORDERED_LIST_ITEM = 'list-unordered-item'

const IMMEDIATELY_EDITOR_COMMAND = 3;
const HIGH_EDITOR_COMMAND = 2;
const STANDART_EDITOR_COMMAND = 1;
const IGNOREMANAGER_EDITOR_COMMAND = 10;

const EDITOR_PRIORITY = {
	IMMEDIATELY_EDITOR_COMMAND: 3,
	HIGH_EDITOR_COMMAND: 2,
	STANDART_EDITOR_COMMAND: 1,
	IGNOREMANAGER_EDITOR_COMMAND: 10,
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
	IMAGE_NODE_TYPE,
	
	STANDART_BLOCK_TYPE,
	HORIZONTAL_RULE_BLOCK_TYPE,

	ORDERED_LIST_ITEM,
	UNORDERED_LIST_ITEM,

	EDITOR_PRIORITY
}
