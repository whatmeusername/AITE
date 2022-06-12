import {BaseNode, DOMhtml} from './index';
import {findStyle} from '../EditorUtils';

import {createAiteNode} from '../index';
import type {AiteNode, AiteNodeOptions} from '../index'




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
			let currentStyle = findStyle(Style);
			if (currentStyle.class !== undefined) {
 				classString += currentStyle.class + ' ';
			}
		});
		return classString
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
			{...options, key: this.$getNodeKey(), isAiteWrapper: false}
		)
	}

	getContent(): string {
		return this.__content;
	}

	appendContent(string: string): void {
		this.__content += string;
	}
	getContentLength(): number {
		return this.__content.length;
	}

	getNodeStyle(): Array<string> {
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

	getData(asCreation?: boolean){
		if(asCreation){
			return {
			...this,
			plaintText: this.__content,
			stylesArr: this.__styles
			}
		}
		return {...this}
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
