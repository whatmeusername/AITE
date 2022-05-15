import {NodeTypes} from './BlockNode';
import {TEXT_NODE_TYPE} from './ConstVariables';

const ValidationUtils = {
	isTextNode(Node: NodeTypes | undefined) {
		if (!Node) return undefined;
		if (Node.returnType() === TEXT_NODE_TYPE) {
			return true;
		} else return false;
	},
};

export default ValidationUtils;
