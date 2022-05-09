

export function findEditorBlockIndex(node: HTMLElement){
    while(true){
        let nodeDataSet = (node.parentNode as HTMLElement)?.dataset
        if(nodeDataSet.aite_editor_root !== undefined){
            return {
                node: node,
                index: Array.from(node.parentNode!.children).indexOf(node)
            }
        }
        else if(node.tagName === 'BODY') break;
        node = node.parentNode as HTMLElement
    }
    return undefined
}

export function findEditorCharIndex(node: HTMLElement){
    while(true){
        let nodeDataSet = (node.parentNode as HTMLElement)?.dataset
        if(nodeDataSet.aite_block_node !== undefined){
            return {
                node: node,
                index: Array.from(node.parentNode!.children).indexOf(node)
            }
        }
        else if(node.tagName === 'BODY') break;
        node = node.parentNode as HTMLElement
    }
    return undefined
}