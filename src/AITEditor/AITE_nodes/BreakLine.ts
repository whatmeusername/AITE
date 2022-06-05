import { BaseNode } from "./BaseNode";
import {BREAK_LINE_TYPE} from '../ConstVariables'
import {createAiteNode} from '../AITEreconciliation'
import type {AiteNode, AiteNodeOptions} from '../AITEreconciliation'


class BreakLine extends BaseNode {
    constructor(){
        super(BREAK_LINE_TYPE, 'inline')
    }

    $updateNodeKey(){
        this.__key = 'AITE_BREAKLINE_NODE'
    }

    $getNodeState(options?: AiteNodeOptions): AiteNode{
		let className = 'AITE_breakline'
		let props = {
			className: className,
			'data-aite-node': true
		}
        this.$updateNodeKey()
		return createAiteNode(
			'br',
			props,
            null,
            {...options, key: this.__key, isAiteWrapper: false}
		)
	}

    returnContentLength(){
        return 1
    }
    
}

export {BreakLine}