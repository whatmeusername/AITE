
interface selectionData {
    charNode: HTMLElement
    charIndex: null | number
    blockNode: HTMLElement | null
    blockPath: Array<number>

} 


export function findEditorFullPathToCharNode(node: HTMLElement){
    let path: Array<number> = [];

    node = node.firstChild ? node.firstChild as HTMLElement : node

    let data: selectionData = {
        charNode: node,
        charIndex: null,
        blockNode: null,
        blockPath: path
    }

    while(true){
        let nodeDataSet = (node.parentNode as HTMLElement)?.dataset;
        if(nodeDataSet.aite_block_node !== undefined || nodeDataSet.aite_block_content_node !== undefined){
            let index = Array.from(node.parentNode!.children).indexOf(node);
            if(data.charIndex === null){
                data.charIndex = index;
                data.blockNode = node.parentNode as HTMLElement;
            }
            else path.unshift(index);
        }
        if(nodeDataSet.aite_editor_root !== undefined){
            path.unshift(Array.from(node.parentNode!.children).indexOf(node));
            return data;
        }
        else if(node.tagName === 'BODY') break;
        node = node.parentNode as HTMLElement;
    };
    return data;
}

export function findEditorBlockIndex(node: HTMLElement){
    while(true){
        let nodeDataSet = (node.parentNode as HTMLElement)?.dataset;
        if(nodeDataSet.aite_editor_root !== undefined){
            return {
                node: node,
                index: Array.from(node.parentNode!.children).indexOf(node)
            };
        }
        else if(node.tagName === 'BODY') break;
        node = node.parentNode as HTMLElement;
    };
    return undefined;
}

export function findEditorRoot(node: HTMLElement){
    while(true){
        let nodeDataSet = (node.parentNode as HTMLElement)?.dataset;
        if(nodeDataSet.aite_editor_root !== undefined){
            return node.parentNode as HTMLDivElement;
        }
        else if(node.tagName === 'BODY') break;
        node = node.parentNode as HTMLElement;
    }
    return undefined;
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