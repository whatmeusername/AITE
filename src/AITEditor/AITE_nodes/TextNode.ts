import {BaseNode, DOMattr, DOMhtml} from './index';
import SearchUtils from '../SearchUtils';
import React from 'react';

export interface DOMTextAttr extends DOMhtml{
    className?: string;
	'data-aite-node'?: boolean;
}


export interface textNodeConf{
	plainText: string;
	stylesArr?: Array<string>
	nodeType?: 'text' | 'link'

}

export class TextNode extends BaseNode{
	
    __content: string;
    __styles: Array<string>

	constructor(nodeConf?: textNodeConf){
        super(nodeConf?.nodeType ?? 'text', 'inline')
		this.__content = nodeConf?.plainText ?? ''
        this.__styles = nodeConf?.stylesArr ?? []
	}

	__prepareStyles() {
		let classString = ''
		this.__styles.forEach((Style) => {
			let currentStyle = SearchUtils.findStyle(Style);
			if (currentStyle.class !== undefined) {
 				classString += currentStyle.class + ' ';
			}
		});
		if (classString !== '') return classString
		return null
	}

    createDOM(attr?: DOMattr){
        let styles = this.__prepareStyles();
		let s: DOMTextAttr = {
			...attr?.html,
			'data-aite-node': true
		};
		if (styles !== null) s.className = styles
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
