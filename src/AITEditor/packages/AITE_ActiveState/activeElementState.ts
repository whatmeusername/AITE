import {findEditorBlockIndex, findEditorCharIndex} from "../../EditorUtils";

type mouseEvent = React.MouseEvent | MouseEvent
type EditorNodeSelectedData = {node: Node | HTMLElement, index: number} | undefined

export default class ActiveElementState{

    EditorStateFunction: () => void
    allowedAllements: Array<string>
    isActive: boolean
    activeNode: HTMLElement | null
    charNode: number | null
    blockNode: number | null

    constructor(EditorStateManager: () => void){
        this.EditorStateFunction = EditorStateManager
        this.allowedAllements = ['IMG']
        this.isActive = false
        this.activeNode = null
        this.charNode = null
        this.blockNode = null
    }


    addElementToAllowed(element: string){
        if(this.allowedAllements.findIndex(o => o === element) === -1){
            this.allowedAllements.push(element)
        }
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

    handleElementClick(event: mouseEvent){
        let nodeTag = (event.target as HTMLElement).tagName
        let currentBlockData: EditorNodeSelectedData = undefined,
            currentCharData: EditorNodeSelectedData = undefined

        const editorClickEvent = (event: MouseEvent) => {

            if(event.target === null) return ;
    
            else if(!currentCharData!.node.contains(event.target as HTMLElement)){
                this.resetActiveData()
                document.removeEventListener('click', editorClickEvent)
                this.EditorStateFunction()
            }
        }

        if(this.allowedAllements.includes(nodeTag) && event.target !== null){
            currentBlockData = findEditorBlockIndex(event.target as HTMLElement)
            currentCharData = findEditorCharIndex(event.target as HTMLElement)

            if(currentBlockData !== undefined && currentBlockData !== undefined && this.isActive === false){
                this.blockNode = currentBlockData!.index
                this.charNode = currentCharData!.index
                this.isActive = true
                this.EditorStateFunction()
                document.addEventListener('click', editorClickEvent)
            }
            else if(currentBlockData !== undefined && currentBlockData !== undefined && this.isActive === true){
                this.blockNode = currentBlockData!.index
                this.charNode = currentCharData!.index
                this.isActive = true
                document.removeEventListener('click', editorClickEvent)
                this.EditorStateFunction()
                document.addEventListener('click', editorClickEvent)
            }
        }
    }
}