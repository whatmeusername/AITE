import {NodeTypes} from './BlockNode';

const ValidationUtils = {
	isTextNode(Node: NodeTypes | undefined) {
		if (!Node) return undefined;
		if (Node.returnType() === 'text') {
			return true;
		} else return false;
	},
};

export default ValidationUtils;
