import {HeadNode} from '../AITE_nodes';
import {Nullable} from '../Interfaces';

class AiteTextNode {
	children: string;
	_key: Nullable<number>;
	isAiteWrapper: boolean;
	ref: Nullable<HeadNode>;
	constructor(ref: Nullable<HeadNode>, children: string, isAiteWrapper: boolean) {
		this.children = children;
		this._key = ref?.getNodeKey();
		this.isAiteWrapper = isAiteWrapper ?? false;
		this.ref = ref;
	}
}

export {AiteTextNode};
