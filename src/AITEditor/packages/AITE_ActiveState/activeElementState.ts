import {findEditorBlockIndex, findEditorCharIndex} from "../../EditorUtils";
import type BlockNode from '../../BlockNode'
import type {EditorState} from '../../EditorManagmentUtils'

type mouseEvent = React.MouseEvent | MouseEvent
type EditorNodeSelectedData = {node: Node | HTMLElement, index: number} | undefined

export default class ActiveElementState{

    EditorStateFunction: () => void
    EditorState: EditorState
    allowedAllements: Array<string>
    isActive: boolean
    activeNode: HTMLElement | null
    charNode: number | null
    blockNode: number | null

    constructor(EditorStateManager: () => void, editorState: EditorState){
        this.EditorStateFunction = EditorStateManager;
        this.EditorState = editorState
        this.allowedAllements = ['IMG'];
        this.isActive = false;
        this.activeNode = null;
        this.charNode = null;
        this.blockNode = null;
    }


    addElementToAllowed(element: string){
        if(this.allowedAllements.findIndex(o => o === element) === -1){
            this.allowedAllements.push(element);
        };
    }

    removeElementFromAllowed(element: string){
        let elementIndex = this.allowedAllements.findIndex(o => o === element)
        if(elementIndex !== -1){
            this.allowedAllements.splice(elementIndex, 1)
        }
    }

    resetActiveData(){
        this.isActive = false
        this.activeNode = null
        this.charNode = null
        this.blockNode = null
    }

    handleElementClick(event: MouseEvent | React.MouseEvent){
        let nodeTag = (event.target as HTMLElement).tagName;
        let currentBlockData: EditorNodeSelectedData = undefined,
            currentCharData: EditorNodeSelectedData = undefined;

        const editorClickEvent = (event: MouseEvent) => {

            if(event.target === null || event.defaultPrevented === true) return ;
            else if(
                this.allowedAllements.includes((event.target as HTMLElement).tagName)){
                let newCharData = findEditorCharIndex(event.target as HTMLElement);
                if(newCharData?.node !== currentCharData?.node){
                    currentCharData = newCharData
                    if(currentBlockData !== undefined){
                        currentCharData = findEditorCharIndex(event.target as HTMLElement);
                        if(currentCharData !== undefined){
                            this.blockNode = currentBlockData!.index;
                            this.charNode = currentCharData!.index;
                            this.EditorStateFunction();
                        }
                    }
                }
            }
            else if(!currentCharData!.node.contains(event.target as HTMLElement)){
                this.resetActiveData();
                document.removeEventListener('click', editorClickEvent);
                document.removeEventListener('keyup', backspaceEventHandler);
                this.EditorStateFunction();
            }
        }

        const backspaceEventHandler = (event: KeyboardEvent) => {
            if(event.key === 'Backspace' && this.blockNode !== null && this.charNode !== null){
                let currentBlock = this.EditorState.contentNode.findBlockByIndex(this.blockNode)
                if(currentBlock.getType() === 'standart'){
                    (currentBlock as BlockNode).removeCharNode(this.charNode) 
                    this.resetActiveData()
                    document.removeEventListener('click', editorClickEvent);
                    document.removeEventListener('keyup', backspaceEventHandler);
                    this.EditorStateFunction();
                }
            }
        }

        if(this.allowedAllements.includes(nodeTag) && event.target !== null){
            currentBlockData = findEditorBlockIndex(event.target as HTMLElement);
            currentCharData = findEditorCharIndex(event.target as HTMLElement);

            if(currentBlockData !== undefined && currentBlockData !== undefined && this.isActive === false){
                this.blockNode = currentBlockData!.index;
                this.charNode = currentCharData!.index;
                this.isActive = true;
                this.EditorStateFunction();
                let selection = window.getSelection();
                if(selection !== null){
                    selection.removeAllRanges();
                }
                document.addEventListener('click', editorClickEvent);
                document.addEventListener('keyup', backspaceEventHandler);
            }
        }
    }

    getActiveNodes(){
        if(this.blockNode !== null && this.charNode !== null){
            let currentBlock = this.EditorState.contentNode.findBlockByIndex(this.blockNode) as BlockNode
            let currentChar = currentBlock.getNodeByIndex(this.charNode)
            return {block: currentBlock, char: currentChar}
        }
        return undefined
    }
}