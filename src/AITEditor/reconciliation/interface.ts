import type {TextNode, HeadNode} from '../AITE_nodes/index';
import {Nullable} from '../Interfaces';
import type {AiteNode, AiteTextNode} from './index';

type StringNumberBool = string | number | boolean;
type AiteNodes = AiteNode | AiteTextNode;
type CSSStyles = {[K: string]: string};

interface AiteHTMLNode extends HTMLElement {
	$$AiteNodeType: string;
	$$AiteNodeKey: Nullable<number>;
	$$isAiteNode: true;
	$$isAiteWrapper: boolean;
	$$ref: Nullable<HeadNode>;
}

interface AiteHTMLTextNode extends Text {
	$$AiteNodeType: string;
	$$AiteNodeKey: Nullable<string>;
	$$isAiteNode: true;
	$$isAiteTextNode: true;
	$$ref: Nullable<TextNode>;
}

type AiteNodeTypes = 'text' | 'breakline' | 'element' | 'unsigned' | 'image/gif';

type AiteHTML = AiteHTMLNode | AiteHTMLTextNode;

interface AiteNodeOptions {
	isAiteTextNode?: boolean;
	isAiteWrapper?: boolean;
	AiteNodeType?: AiteNodeTypes;
}

export type {AiteHTMLNode, AiteHTMLTextNode, AiteNodes, AiteNodeOptions, AiteNodeTypes, AiteHTML, StringNumberBool, CSSStyles};
