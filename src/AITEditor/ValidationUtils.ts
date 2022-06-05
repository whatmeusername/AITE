import {NodeTypes} from './BlockNode';
import {TEXT_NODE_TYPE, BREAK_LINE_TYPE} from './ConstVariables';
import  {TextNode, BreakLine} from './AITE_nodes/index'

const ValidationUtils = {
	isTextNode(Node: NodeTypes) {
		return Node instanceof TextNode;
	},

	isBreakLine(Node: NodeTypes | undefined){
		return Node instanceof BreakLine;
	}
};

export default ValidationUtils;
