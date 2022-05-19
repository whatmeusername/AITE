import {TEXT_NODE_TYPE, LINK_NODE_TYPE} from "../ConstVariables"

type nodeTypes = 'text' | 'image' | 'link'
type displayType = 'inline' | 'block'


export interface DOMhtml {
    key?: string
    target?: '_blank' | '_self' | '_parent' | '_top'
}

export type DOMattr = {
    html?: {
        key?: string
        target?: '_blank' | '_self' | '_parent' | '_top'
    }
    other?: {
        isActive?: boolean
        isActiveFunction?: (charIndex: number, blockIndex: number) => boolean
    }
}

export class BaseNode{
    private __type: nodeTypes;
    private __display: displayType;

    constructor(type: nodeTypes, displayType: displayType){
        this.__type = type;
        this.__display = displayType;
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
        return 'element'
	}
}