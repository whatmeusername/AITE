import {getKeyPathNodeByNode, getParentNode, getBlockNode, unmountNode, getEditorState, BlockNode, generateRandomKey, remountNode, ContentNode, AiteHTMLNode} from '../index'
import {LinkNode} from './index'


abstract class HeadNode{
    protected _status: 0 | 1;
    private _key: string;
    
    constructor(){
        this._status = 1;
        this._key = generateRandomKey(5)
    }

    $updateNodeKey(){
        this._key = generateRandomKey(5)
       }
    $getNodeKey(){
        return this._key
    }

    $getNodeStatus(){
        return this._status
    }

    remove(): void{
		let DOMnode = getEditorState().__editorDOMState.getNodeFromMap(this._key)
		if(DOMnode !== undefined && this._key){
			let parentDOMNode = getParentNode(DOMnode)
			let parentPath = parentDOMNode ? getKeyPathNodeByNode(parentDOMNode) : undefined
			let parentNode = parentPath ? getEditorState().contentNode.getBlockByKeyPath(parentPath) : undefined
			if(parentNode && (parentNode instanceof BlockNode || parentNode instanceof ContentNode || parentNode instanceof LinkNode)){
				this._status = 0
				unmountNode(this)
				parentNode.removeNodeByKey(this._key)
			}
		}
	}
    

    remount(): void{
        let DOMnode = getEditorState().__editorDOMState.getNodeFromMap(this._key)

        // HERE WE IGNORING SELF TYPE BECAUSE WE DOING DUCK TYPING TO CHECK IF CHILDREN CLASSES HAVE $getNodeState
        if(this._status = 1 && DOMnode !== undefined && this._key && (this as any).$getNodeState){
            if((this as any).collectSameNodes){
                (this as any).collectSameNodes();
            }
			remountNode(this)
		}
    }
}


export{
    HeadNode
}