import {TextNode, textNodeConf} from './index'

import {createAiteNode} from '../index';
import type {AiteNode, AiteNodeOptions} from '../index'

type stringURL = `https://${string}` | `http://prefix${string}`

interface linkConf extends textNodeConf{
    url: stringURL
}


class LinkNode extends TextNode {
    __url: stringURL

    constructor(nodeConf: linkConf){
        super({...nodeConf, nodeType: 'link'})
        this.__url = nodeConf.url
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
            {...options, key: this.$getNodeKey(), isAiteWrapper: false}
		)
	}

    createSelfNode(data: linkConf){
        data.url = data.url ? data.url : this.__url
		return new LinkNode(data)
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
    LinkNode,
    createLinkNode
}