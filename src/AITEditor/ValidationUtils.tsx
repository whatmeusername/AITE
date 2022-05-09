

import {NodeTypes} from './BlockNode'

const ValidationUtils = {
    isTextNode(Node: NodeTypes | undefined){
        if(!Node) return undefined
        if(Node.d[0] === 'text'){
            return true
        }
        else return false
    }
}

export default ValidationUtils