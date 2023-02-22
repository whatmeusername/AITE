import {HeadNode} from '../AITE_nodes';
import {Nullable} from '../Interfaces';
import {AiteNodeOptions, AiteNodes, AiteNodeTypes} from './interface';

class AiteNode {
	type: string;
	props: {[K: string]: any};
	children: Array<AiteNodes>;
	childrenLength: number;
	_key: Nullable<number>;
	isAiteWrapper: boolean;
	AiteNodeType: AiteNodeTypes;
	ref: Nullable<HeadNode>;

	constructor(ref: HeadNode | null, type: string, props: Nullable<{[K: string]: any}>, children: Nullable<Array<AiteNodes>>, options?: AiteNodeOptions) {
		this.type = type;
		this.props = props ?? {};
		this.children = children ?? [];
		this.childrenLength = this.children?.length ?? 0;
		this.isAiteWrapper = options?.isAiteWrapper ?? false;
		this._key = ref?.getNodeKey();
		this.AiteNodeType = options?.AiteNodeType ?? 'unsigned';
		this.ref = ref;
	}
}

export {AiteNode};
