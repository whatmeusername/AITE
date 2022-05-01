

import {NodeTypes} from './BlockNode'

const ValidationUtils = {
    isTextNode(Node: NodeTypes){
        if(Node.d[0] === 'text'){
            return true
        }
        else return false
    }
}

export default ValidationUtils