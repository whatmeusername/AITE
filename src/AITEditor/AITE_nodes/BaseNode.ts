import {TEXT_NODE_TYPE, LINK_NODE_TYPE, BREAK_LINE_TYPE, IMAGE_NODE_TYPE, LIST_NODE_TYPE} from "../ConstVariables"

import {HeadNode} from './index'

type nodeTypes = typeof TEXT_NODE_TYPE | typeof IMAGE_NODE_TYPE | typeof LINK_NODE_TYPE | typeof BREAK_LINE_TYPE | typeof LIST_NODE_TYPE
type displayType = 'inline' | 'block'


interface DOMhtml {
    key?: string
    target?: '_blank' | '_self' | '_parent' | '_top'
}

type DOMattr = {
    html?: {
        key?: string
        target?: '_blank' | '_self' | '_parent' | '_top'
    }
    other?: {
        isActive?: boolean
        isActiveFunction?: (charIndex: number, blockIndex: number) => boolean
    }
}

abstract class BaseNode extends HeadNode{
    private __type: nodeTypes;
    protected __status: 0 | 1;

    constructor(type: nodeTypes){
        super()
        this.__type = type;
        this.__status = 1;
        
        this.$updateNodeKey()
    }


    getActualType(): string {
		return this.__type;
	}
	getType(): string {
		if(this.__type === TEXT_NODE_TYPE || this.__type === LINK_NODE_TYPE){
            return TEXT_NODE_TYPE
        }
        else if(this.__type === BREAK_LINE_TYPE) return BREAK_LINE_TYPE
        return 'element'
	}
}

export{
    BaseNode
}

export type{
    DOMattr,
    DOMhtml
}