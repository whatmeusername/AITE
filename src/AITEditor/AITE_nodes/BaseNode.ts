import {TEXT_NODE_TYPE, LINK_NODE_TYPE, BREAK_LINE_TYPE} from "../ConstVariables"

type nodeTypes = typeof TEXT_NODE_TYPE | 'image' | typeof LINK_NODE_TYPE | typeof BREAK_LINE_TYPE
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

abstract class BaseNode{
    private __type: nodeTypes;
    private __display: displayType;
    __key: string | undefined; 

    constructor(type: nodeTypes, displayType: displayType){
        this.__type = type;
        this.__display = displayType;
        this.__key = undefined;
    }

    $getNodeKey(){
		return this.__key
	}
    returnElementDisplay(){
        return this.__display
    }
    returnActualType(): string {
		return this.__type;
	}
	returnType(): string {
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