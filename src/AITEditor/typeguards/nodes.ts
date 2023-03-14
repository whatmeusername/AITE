import {BlockNode, HorizontalRuleNode, BaseBlockNode} from "../index";
import {BaseNode, BreakLine, HeadNode, LeafNode, TextNode, ContentNode} from "../nodes/index";

function isTextNode(node: any): node is TextNode {
	return node instanceof TextNode;
}

function isHorizontalRuleNode(node: any): node is HorizontalRuleNode {
	return node instanceof HorizontalRuleNode;
}

function isBlockNode(node: any): node is BlockNode {
	return node instanceof BlockNode;
}

function isBaseBlockNode(node: any): node is BaseBlockNode {
	return node instanceof BaseBlockNode;
}

function isContentNode(node: any): node is ContentNode {
	return node instanceof ContentNode;
}

function isBreakLine(node: any): node is BlockNode {
	if (isLeafNode(node)) return false;
	return node.children.length === 1 && (node.children[0] instanceof BreakLine || (node.children[0] as TextNode).content === "");
}

function isLeafNode(node: any): node is LeafNode {
	return node instanceof LeafNode;
}

function isHeadNode(node: any): node is HeadNode {
	return node instanceof HeadNode;
}
function isBaseNode(node: any): node is BaseNode {
	return node instanceof BaseNode;
}

export {isTextNode, isHorizontalRuleNode, isBlockNode, isBaseBlockNode, isContentNode, isBreakLine, isHeadNode, isBaseNode, isLeafNode};
