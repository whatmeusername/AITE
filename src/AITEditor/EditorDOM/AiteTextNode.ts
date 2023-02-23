import {TextNode} from '../AITE_nodes';
import {Nullable} from '../Interfaces';
import {AiteHTMLTextNode} from './interface';

class AiteTextNode {
	children: string;
	_key: Nullable<number>;
	isAiteWrapper: boolean;
	ref: Nullable<TextNode>;
	constructor(ref: Nullable<TextNode>, children: string, isAiteWrapper: boolean) {
		this.children = children;
		this._key = ref?.key;
		this.isAiteWrapper = isAiteWrapper ?? false;
		this.ref = ref;
	}
}

function createAiteText(string: string, ref?: Nullable<TextNode>): AiteHTMLTextNode {
	let textNode: AiteHTMLTextNode = document.createTextNode(string) as AiteHTMLTextNode;
	textNode.$$isAiteNode = true;
	textNode.$$isAiteTextNode = true;
	textNode.$$AiteNodeType = 'text';
	textNode.$$ref = ref ?? null;
	return textNode;
}

export {AiteTextNode, createAiteText};
