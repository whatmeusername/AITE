import {HeadNode} from './HeadNode';

import {
    BaseNode,
    DOMattr,
    DOMhtml
} from './BaseNode';

import {TextNode, DOMTextAttr, textNodeConf, createTextNode} from './TextNode';
import {LinkNode, createLinkNode} from './LinkNode';
import {BreakLine} from './BreakLine'

export {
    HeadNode,
    
    BaseNode,
    TextNode,
    LinkNode,
    BreakLine,
    createTextNode,
    createLinkNode,

}

export type {DOMattr, DOMTextAttr, textNodeConf, DOMhtml}