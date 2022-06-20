import { BaseNode } from "./BaseNode";
import {BREAK_LINE_TYPE} from '../ConstVariables'
import {createAiteNode} from '../index'
import type {AiteNode, AiteNodeOptions} from '../index'


class BreakLine extends BaseNode {
    constructor(){
        super(BREAK_LINE_TYPE)
    }

    $getNodeState(options?: AiteNodeOptions): AiteNode{
		let className = 'AITE_breakline'
		let props = {
			className: className,
			'data-aite-node': true
		}
        if(options) options.AiteNodeType = 'breakline'
        else options = {AiteNodeType: 'breakline'}

		return createAiteNode(
			'br',
			props,
            null,
            {...options, key: this.$getNodeKey(), isAiteWrapper: false}
		)
	}

    getContentLength(){
        return 1
    }

    createSelfNode(){
		return new BreakLine()
	}
    
}

export {BreakLine}