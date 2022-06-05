import {createContentNode} from '../../ContentNode'
import {createEmptyEditorState} from '../../EditorState'
import {createBlockNode} from '../../BlockNode'
import {createTextNode} from '../../AITE_nodes/TextNode'


let testContentNode1 =  createContentNode({
        BlockNodes: [createBlockNode({
            NodeData: [createTextNode({plainText: 'Testing text for editor'})]
        })]
    })


function createTestEditor(preset: 'one-line' | 'one-line-items' | 'two-line' | 'two-line-items' | 'three-line' | 'three-line-items'){
    if(preset === 'one-line') return createEmptyEditorState({ContentNode: testContentNode1})
    return createEmptyEditorState({ContentNode: testContentNode1})
}

export {
    createTestEditor
}