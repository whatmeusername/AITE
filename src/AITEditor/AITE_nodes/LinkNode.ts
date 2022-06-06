import React from 'react'
import {TextNode, DOMattr, DOMTextAttr, textNodeConf} from './index'

import {createAiteNode} from '../index';
import type {AiteNode, AiteNodeOptions} from '../index'

type stringURL = `https://${string}` | `http://prefix${string}`

interface linkConf extends textNodeConf{
    url: stringURL
}

interface DOMLinkAttr extends DOMTextAttr{
    href: stringURL
}

class LinkNode extends TextNode {
    __url: stringURL

    constructor(nodeConf: linkConf){
        super({...nodeConf, nodeType: 'link'})
        this.__url = nodeConf.url
    }

    createDOM(attr?: DOMattr){
        let styles = this.__prepareStyles();
		let s: DOMLinkAttr = {
			...attr?.html,
            href: this.__url,
		};
		if (styles !== '') s.className = styles
        let textNode = this.createSelfTextNode(attr)
		return React.createElement('a', s, [textNode]);
    }


    $updateNodeKey(){
        this.__key = `AITE_LINK_${this.__content.length}_${this.__styles.length}`
    }


    $getNodeState(options?: AiteNodeOptions): AiteNode{
		let className = this.__prepareStyles()
		let props = {
			className: className,
            src: this.__url,
			'data-aite-node': true
		}
        this.$updateNodeKey()
		return createAiteNode(
			'a',
			props,
			[this.__content],
            {...options, key: this.__key, isAiteWrapper: false}
		)
	}

    createSelfNode(data: linkConf){
        data.url = data.url ? data.url : this.__url
		return new LinkNode(data)
	}

    createSelfTextNode(attr?: DOMattr){
        const textNodeKey = attr?.html?.key ? attr.html.key + '-text' : 'link-text-node'
        return super.createDOM({html: {key: textNodeKey}})
    }

    getURL(){
        return this.__url
    }
}


function URLvalidator(url: stringURL): boolean {

    let urlString: URL | string = url

    try {
        urlString = new URL(url);
      } catch (_) {
        return false;  
      }
    
      return urlString.protocol === "http:" || urlString.protocol === "https:";
}

function createLinkNode(nodeConf: linkConf): LinkNode | undefined{

    if(URLvalidator(nodeConf.url)){
        return new LinkNode(nodeConf)
    }
    else return undefined;
}

export{
    LinkNode
}