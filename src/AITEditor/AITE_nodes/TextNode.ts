import {BaseNode, DOMattr, DOMhtml} from './index';
import SearchUtils from '../SearchUtils';
import React from 'react';

import {createAiteNode} from '../AITEreconciliation';
import type {AiteNode, AiteNodeOptions} from '../AITEreconciliation'




interface DOMTextAttr extends DOMhtml{
    className?: string;
	'data-aite-node'?: boolean;
}


interface textNodeConf{
	plainText: string;
	stylesArr?: Array<string>
	nodeType?: 'text' | 'link'

}


function createTextNode(initData?: textNodeConf){
	return new TextNode(initData)
}

class TextNode extends BaseNode{
	
    __content: string;
    __styles: Array<string>

	constructor(initData?: textNodeConf){
        super(initData?.nodeType ?? 'text', 'inline')
		this.__content = initData?.plainText ?? ''
        this.__styles = initData?.stylesArr ?? []
	}

	__prepareStyles() {
		let classString = ''
		this.__styles.forEach((Style) => {
			let currentStyle = SearchUtils.findStyle(Style);
			if (currentStyle.class !== undefined) {
 				classString += currentStyle.class + ' ';
			}
		});
		return classString
	}
	
	$updateNodeKey(){
		this.__key = `AITE_TEXT_NODE_${this.__content.length}_${this.__styles.length}`
	}

	$getNodeState(options?: AiteNodeOptions): AiteNode{
		let className = this.__prepareStyles()
		let props = {
			className: className,
			'data-aite-node': true
		}
		this.$updateNodeKey()
		return createAiteNode(
			'span',
			props,
			[this.__content],
			{...options, key: this.__key, isAiteWrapper: false}
		)
	}

    createDOM(attr?: DOMattr){
        let styles = this.__prepareStyles();
		let s: DOMTextAttr = {
			...attr?.html,
			'data-aite-node': true
		};
		if (styles !== '') s.className = styles
		return React.createElement('span', s, [this.returnContent()]);
    }

	returnContent(): string {
		return this.__content;
	}

	appendContent(string: string): void {
		this.__content += string;
	}
	returnContentLength(): number {
		return this.__content.length;
	}

	returnNodeStyle(): Array<string> {
		return this.__styles;
	}

	getSlicedContent(startFromZero: boolean = true, start: number, end?: number): string {
		if (end) return this.__content.slice(start, end);
		else if (startFromZero === true) return this.__content.slice(0, start);
		else return this.__content.slice(start);
	}

	createSelfNode(data: textNodeConf){
		return new TextNode(data)
	}
}

export{
	createTextNode,
	TextNode
}

export type{
	DOMTextAttr,
	textNodeConf
}
