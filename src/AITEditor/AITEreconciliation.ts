
import type {TextNode} from './AITE_nodes/index'

import type {NodeTypes, BlockType, ContentNode} from './index'
import {getEditorState, EditorState} from './index'
import {HTML_TEXT_NODE} from './ConstVariables'
import {isDefined} from './EditorUtils'

type NullUndefined = null | undefined
type StringNumberBool = string | number | boolean
type AiteNodes = AiteNode | AiteTextNode
type CSSStyles = {[K: string]: string}


interface AiteHTMLNode extends HTMLElement {
    $$AiteNodeType: string;
    $$AiteNodeKey: string | undefined;
    $$isAiteNode: true;
    $$isAiteWrapper: boolean;
}

interface AiteHTMLTextNode extends Text {
    $$AiteNodeType: string;
    $$AiteNodeKey: string | undefined;
    $$isAiteNode: true;
    $$isAiteTextNode: true;
}

type AiteNodeTypes = 'text' | 'breakline' | 'element' | 'unsigned' | 'image/gif';


interface AiteNodeOptions{
    key?: string,
    isAiteTextNode?: boolean
    isAiteWrapper?: boolean;
    AiteNodeType?: AiteNodeTypes;
}


const __nodeMap: Map<string | undefined, AiteHTMLNode> = new Map()


function $$bulkUnmountNodes(
    nodePath: Array<number>,
    nodesToRemove: number,
    removeStart?: number,
): void{
    let EditorStateDOMState = getEditorState()?.__editorDOMState
    let currentDOMElement: AiteHTMLNode | undefined

    currentDOMElement = EditorStateDOMState?.getDOMNode(nodePath)
    if(currentDOMElement !== undefined){
        let parentNode = currentDOMElement.parentNode
        let parentDOMObject = EditorStateDOMState?.__editorObjectState.getObjectNode(getParentPath(nodePath))
        if(parentNode === undefined ||  parentDOMObject === undefined) {
            // TODO: REPLACE WITN ERROR FUNCTION
            throw new Error('')
         }
        else if(parentDOMObject !== undefined && Array.isArray(parentDOMObject.children)){
            let sliceStart = removeStart ?? nodePath[nodePath.length - 1]
            parentDOMObject.children = [...parentDOMObject.children.slice(0, sliceStart), ...parentDOMObject.children.slice(sliceStart + nodesToRemove)]
            let childNodes: NodeListOf<AiteHTMLNode> = currentDOMElement.childNodes as NodeListOf<AiteHTMLNode>
            for(let i = 0; i < nodesToRemove; i++){
                childNodes[sliceStart].remove()
            }
        }
    }   
}

function $$mountNode(
    newNode: NodeTypes | BlockType,
    nodePath: Array<number>, 
    insertDirection: 'after' | 'before'
    ): void
    {
        let EditorStateDOMState = getEditorState()?.__editorDOMState
        let currentDOMElement = EditorStateDOMState?.getDOMNode(nodePath)
        if(currentDOMElement !== undefined){
            let parentDOMObject = EditorStateDOMState?.__editorObjectState.getObjectNode(getParentPath(nodePath))
            if(parentDOMObject !== undefined && Array.isArray(parentDOMObject.children)){
                let newAiteNode = newNode.$getNodeState()
                parentDOMObject.children.splice(nodePath[nodePath.length - 1], 0, newAiteNode)
                if(insertDirection === 'after'){
                    currentDOMElement.parentNode?.insertBefore(createDOMElement(newAiteNode), currentDOMElement.nextSibling)
                }
                else if(insertDirection === 'before'){
                    currentDOMElement.parentNode?.insertBefore(createDOMElement(newAiteNode), currentDOMElement)
                }
            }
        }
}

function $$remountNode(
    updatedNode: NodeTypes | BlockType,
    nodePath: Array<number>,
    childOnly: boolean = false,
): void{
    let EditorStateDOMState = getEditorState()?.__editorDOMState
    if(EditorStateDOMState !== undefined){
        let currentDOMElement = EditorStateDOMState?.getDOMNode(nodePath)
        if(currentDOMElement?.$$isAiteNode){
            let parentDOMObject: AiteNodes | undefined = EditorStateDOMState.__editorObjectState.getObjectNode(getParentPath(nodePath))
            let updatedNodeState = updatedNode.$getNodeState()
            if(parentDOMObject === undefined) {
                // TODO: REPLACE WITH ERROR FUNCTION
                throw new Error('')
            }
            else if(childOnly === false){
                let parentNode = currentDOMElement.parentNode as AiteHTMLNode
                let updatedAiteHTMLNode = createDOMElement(updatedNodeState)
                parentNode.replaceChild(updatedAiteHTMLNode, currentDOMElement)
                if(parentDOMObject.children instanceof AiteNode){
                    let nodeIndex = nodePath[nodePath.length - 1];
                    (parentDOMObject.children as Array<AiteNode | AiteTextNode>)[nodeIndex] = updatedNodeState
                }
            }
            else if(childOnly === true && updatedNodeState.children){
                let updatedAiteHTMLNode = returnSingleDOMNode(updatedNodeState.children)
                if(Array.isArray(updatedAiteHTMLNode)){
                    currentDOMElement.replaceChildren(...updatedAiteHTMLNode)   
                }
                else{
                    currentDOMElement.replaceChildren(updatedAiteHTMLNode) 
                }
                if(parentDOMObject instanceof AiteNode){
                    let nodeIndex = nodePath[nodePath.length - 1];
                    (parentDOMObject.children as Array<AiteNode | AiteTextNode>)[nodeIndex] = updatedNodeState
                }
            }
            else{
                // TODO: REPLACE WITH ERROR FUNCTION
                throw new Error('')
            }
        }
    }
}

function $$unmountNode(
    nodePath: Array<number>, 
): void
{
    let EditorStateDOMState = getEditorState()?.__editorDOMState
    if(EditorStateDOMState !== undefined){
        let currentDOMElement = EditorStateDOMState?.getDOMNode(nodePath)
        if(currentDOMElement?.$$isAiteNode){
            let parentDOMObject: AiteNodes | undefined = EditorStateDOMState.__editorObjectState.getObjectNode(getParentPath(nodePath))
            let parentNode = currentDOMElement.parentNode as AiteHTMLNode
            if(parentNode === undefined ||  parentDOMObject === undefined) {
               // TODO: REPLACE WITN ERROR FUNCTION
               throw new Error('')
            }
            else if(parentDOMObject !== undefined && Array.isArray(parentDOMObject.children)) {
                parentDOMObject.children.splice(nodePath[nodePath.length - 1], 1)
                parentNode.removeChild(currentDOMElement)
            }
        }
    }
}

function $$updateNodeTextContent(
    node: TextNode,
    nodePath: Array<number>, 
){
    let EditorStateDOMState = getEditorState()?.__editorDOMState
    if(EditorStateDOMState !== undefined){
        let currentDOMElement: AiteHTMLNode | AiteHTMLTextNode | undefined = EditorStateDOMState?.getDOMNode(nodePath)
        if(currentDOMElement?.$$isAiteNode){
            let currentDOMObject: AiteNodes | undefined = EditorStateDOMState.__editorObjectState.getObjectNode(getParentPath(nodePath))
            if(currentDOMObject !== undefined){
                if(currentDOMElement.nodeType !== HTML_TEXT_NODE && currentDOMObject instanceof AiteNode){
                    currentDOMElement = currentDOMElement.firstChild as AiteHTMLTextNode
                    currentDOMObject = currentDOMObject.children ? currentDOMObject.children[0] as AiteTextNode: undefined
                    if(currentDOMElement.nodeType !== HTML_TEXT_NODE || currentDOMObject === undefined){
                        // TODO: REPLACE WITN ERROR FUNCTION
                        throw new Error('')
                    }
                }
                if(node.__content !== currentDOMElement.textContent ){
                    currentDOMElement.textContent  = node.__content
                    currentDOMObject.children = node.__content
                }
            }
        }
    }
}

function generateNewRandomKey(length: number = 5): string {
    return (Math.random()).toString(32).slice(2, length + 2)
}

function getParentPath(path: Array<number>){
    if(path.length === 1){
        return []
    }
    else if(path.length > 1){
        return path.slice(0, path.length - 1)
    }
    return path
}

function isEventProp(name: string) {
    return name.startsWith('on');
  }
//eslint-disable-next-line
function addEventListeners($target: AiteHTMLNode, type: string, listener: (...args: any[]) => void) {
      if (isEventProp(type)) {
        $target.addEventListener(
            type.slice(2).toLowerCase(),
            listener
        )
      }
    };

function createAiteDomNode(node: AiteNode): AiteHTMLNode{
    let DOMnode = document.createElement(node.type) as AiteHTMLNode
    DOMnode.$$isAiteNode = true
    DOMnode.$$AiteNodeKey = node.__key
    DOMnode.$$AiteNodeType = node.AiteNodeType
    DOMnode.$$isAiteWrapper = node.isAiteWrapper ?? false
    return DOMnode
}

function createAiteText(string: string): AiteHTMLTextNode{
    let textNode = document.createTextNode(string) as AiteHTMLTextNode
    textNode.$$isAiteNode = true
    textNode.$$isAiteTextNode = true
    textNode.$$AiteNodeType = 'text'
    return textNode
}

function isNotEmpty(value: StringNumberBool | NullUndefined): boolean {
    if(value === null || value === undefined || value === '') return false
    return true
}

function setStyles($target: AiteHTMLNode, styleObject: CSSStyles): void{
    if(typeof styleObject !== 'object') return;
    //eslint-disable-next-line
    Object.entries(styleObject).map(([key, value]): void => {
        $target.style[key as any] = value
    })
}

function setProps($target: AiteHTMLNode, props: {[K: string]: any}){
    Object.entries(props).map(([key, value]) => {
        if(isEventProp(key)){
            addEventListeners($target, key, value)
        }
        else setAttribute($target, key, value)
    })
}

function setAttribute($target: AiteHTMLNode, attrName: string, value: StringNumberBool | CSSStyles): void {
    if(attrName === 'style' && typeof value === 'object'){
        setStyles($target, value)
    } else if (attrName === 'className' && isNotEmpty(value as StringNumberBool)) {
        $target.setAttribute('class', value.toString());
    } else if(isNotEmpty(value as StringNumberBool)){
        $target.setAttribute(attrName, value.toString());
    }
  }

//eslint-disable-next-line
function removeAttribute($target: AiteHTMLNode, attrName: string, value: StringNumberBool | CSSStyles): void {
    if (attrName === 'className' && isNotEmpty(value as StringNumberBool)) {
        $target.removeAttribute('class');
    } else if(isNotEmpty(value as StringNumberBool)){
        $target.removeAttribute(attrName);
    }
}

function createDOMElementWithoutChildren(node: AiteNode | string): AiteHTMLNode | Text {
    if(typeof node === 'string'){
        return createAiteText(node);
    } else if(node instanceof AiteNode){
        let $node: AiteHTMLNode = createAiteDomNode(node);
        if(node.props){
            //eslint-disable-next-line
            setProps($node, node.props);
        }
        return $node
    } else throw new Error('') 
}

function createDOMElement(node: AiteNodes): AiteHTMLNode | Text{
    if(typeof node.children === 'string'){
        return createAiteText(node.children);
    } else if(node instanceof AiteNode){
        let $node: AiteHTMLNode = createAiteDomNode(node);
        if(node.props){
            //eslint-disable-next-line
            setProps($node, node.props);
        }
        if(node.children){
            node.children.map(createDOMElement).forEach($node.appendChild.bind($node));
        }
        return $node
    } else throw new Error('')
}


function appendChildrens(node: AiteNodes): AiteHTMLNode | Text{
    if(node instanceof AiteNode){
        let currentDOMNode = createDOMElementWithoutChildren(node)
        if(node.children && node.children.length > 0){
            node.children.map(appendChildrens).forEach(
                currentDOMNode.appendChild.bind(currentDOMNode)
            )
        }
        if(currentDOMNode instanceof HTMLElement){
            __nodeMap.set(node.__key, currentDOMNode)
        }
        return currentDOMNode
    } else return createAiteText(node.children);

}

function createNewDOMstate(EditorState: EditorState){
    return createAITENode('div', {}, createAITEContentNode(EditorState.contentNode))
}

function returnSingleDOMNode(CurrentState: AiteNodes | AiteNodes[]): AiteHTMLNode | Array<AiteHTMLNode | Text>{
    if(Array.isArray(CurrentState)){
        let childrens: Array<AiteHTMLNode | Text> = []
        CurrentState.map(appendChildrens).forEach($node => childrens.push($node))
        return childrens
    }
    return appendChildrens(CurrentState as AiteNodes) as AiteHTMLNode
}


function createAITEContentNode($ContentNode: ContentNode, options?: AiteNodeOptions): Array<AiteNode>{
    let BlockNodes = $ContentNode.BlockNodes
    let BlockArray: Array<AiteNode> = []
    for(let i = 0; i < BlockNodes.length; i++){
        BlockArray.push(BlockNodes[i].$getNodeState({...options}))
    }
    return BlockArray
}

function createAITENode(type: string, props: {[K: string]: any} | NullUndefined, children: Array<AiteNode> | NullUndefined): AiteNode{
    return createAiteNode(type, props, children)
}

function createNewObjectState(EditorState: EditorState, offsetPath?: Array<number>): editorObjectState{
    if(offsetPath){
        let currentNode = EditorState.contentNode.getBlockByPath(offsetPath)
        if(currentNode !== undefined){
            return new editorObjectState(currentNode.$getNodeState({path: offsetPath}))
        }
    }

    return new editorObjectState(createNewDOMstate(EditorState))
}

class editorObjectState{
    __editorObjectState: AiteNode;
    constructor(objectNode: AiteNode, offsetPath?: Array<number>){
        this.__editorObjectState = objectNode
    }

    get(){
        return this.__editorObjectState
    }

    getObjectNode(path: Array<number>): AiteNodes | undefined{
        if(path.length === 0){
            return this.__editorObjectState
        }
        else if(path.length === 1){
            return this.__editorObjectState?.children ? this.__editorObjectState?.children[path[0]] as AiteNode: undefined 
        }
        else if(path.length > 1){
            let node: AiteNodes | undefined = this.__editorObjectState?.children ? this.__editorObjectState?.children[path[0]] as AiteNode: undefined 
            if(node){
                let pathLength = path.length
                for(let i = 1; i < pathLength; i++){
                    let currentIndex = path[i]
                    if(node && node instanceof AiteNode){
                            let childNode: AiteNodes | undefined = node.children ? node.children[currentIndex] : undefined
                            let isDecoratorNode = (childNode as AiteNode)?.props?.hasOwnProperty('data-aite_decorator_node') ?? false
                            if(childNode === undefined){
                                return undefined
                            }
                            else if(childNode.isAiteWrapper === false && isDecoratorNode === false){
                                node = childNode
                            }
                            else if(childNode !== undefined && childNode.children && (childNode.isAiteWrapper === true || isDecoratorNode === true)){
                                let childChildrenLength = childNode.children ? childNode.children.length : 0
                                for(let i = 0; i < childChildrenLength; i++){
                                    let nextNode = childNode.children[i] as AiteNodes
                                    if(nextNode.isAiteWrapper === false){
                                        node = childNode.children[i] as AiteNodes
                                        break;
                                    }
                                }
                            }
                            else if(childNode) {
                                node = childNode
                            }
                        }
                    }
                }
                return node
            }
        return undefined

    }
}

class editorDOMState{
    __editorObjectState: editorObjectState;
	__rootDOMElement: AiteHTMLNode;
    __nodeMap: Map<string | undefined, AiteHTMLNode>;
    
    constructor(EditorState: EditorState){
        this.__editorObjectState = createNewObjectState(EditorState)
        this.__nodeMap = __nodeMap
		this.__rootDOMElement = createDOMElement(this.__editorObjectState.get()) as AiteHTMLNode

    }



    getNodeByKey(key: string | undefined): AiteHTMLNode | undefined{
        if(isDefined(key)){
            return this.__nodeMap.get(key) ?? undefined
        }
        return undefined
    }


    __setDOMElement(node: AiteHTMLNode){
        this.__rootDOMElement = node
    }

    getDOMNode(path: Array<number>){

        let rootElement = this.__rootDOMElement

        if(rootElement === undefined || path === undefined) return undefined
        else if(path.length === 0){
            return rootElement
        }
        else if(path.length === 1){
            return rootElement.childNodes[path[0]] as AiteHTMLNode
        }
        else if(path.length > 1){
            let node: AiteHTMLNode | undefined = rootElement.childNodes[path[0]] as AiteHTMLNode
            let pathLength = path.length;
            if(node){
                for(let i = 1; i < pathLength; i++){
                    let currentIndex = path[i]
                    let nodeChildrens = node.childNodes as NodeListOf<AiteHTMLNode>
                    let nextNode = nodeChildrens[currentIndex]
                    if(i !== pathLength - 1 && nextNode?.dataset?.aite_decorator_node){
                        nodeChildrens = nextNode.childNodes as NodeListOf<AiteHTMLNode>
                        for(let i = currentIndex + 1; i < nodeChildrens.length; i++){
                            if(nodeChildrens[i]?.dataset?.aite_content_node){
                                node = nodeChildrens[i]
                            }
                        }
                    }
                    else if(i === pathLength - 1 && nextNode?.dataset?.aite_decorator_node){
                        return nextNode
                    }
                    else if(nextNode?.dataset?.aite_content_node === 'true') node = nextNode.childNodes[currentIndex] as AiteHTMLNode
                    else if(nextNode !== undefined && nextNode?.$$isAiteWrapper === false) node = nextNode;
                    else return undefined
                }
            }
            return node
        }
        return undefined
    }
}


class AiteTextNode{
    children: string
    __key: StringNumberBool | NullUndefined
    isAiteWrapper: boolean;
    constructor(children: string, isAiteWrapper: boolean, key: StringNumberBool | NullUndefined){
        this.children = children
        this.__key = key ?? generateNewRandomKey()
        this.isAiteWrapper = isAiteWrapper ?? false 
    }
}




function createAiteNode(
    type: string, 
    props: {[K: string]: any} | NullUndefined, 
    children: Array<AiteNode | string> | NullUndefined, 
    options?: AiteNodeOptions
): AiteNode{
    if(children){
        let updatedChildren: Array<AiteNodes> = children.map((node, index) => {
            if(typeof node === 'string'){
                let key = `AITE_TEXT_${node.length}`
                return new AiteTextNode(node, true, key)
            }
            return node
        })
        return new AiteNode(type, props, updatedChildren, options)
    }
    return new AiteNode(type, props, children as NullUndefined, options)
}

class AiteNode{
    type: string
    props: {[K: string]: any} | NullUndefined
    children: Array<AiteNodes> | NullUndefined
    childrenLength: number
    __key: string | undefined
    isAiteWrapper: boolean
    AiteNodeType: AiteNodeTypes

    // AiteNodeType: string

    constructor(type: string, props: {[K: string]: any} | NullUndefined, children: Array<AiteNodes> | NullUndefined, options?: AiteNodeOptions){
        this.type = type
        this.props = props
        this.children = children
        this.childrenLength = this.children?.length ?? 0
        this.isAiteWrapper = options?.isAiteWrapper ?? false
        this.__key = options?.key ?? undefined
        this.AiteNodeType = options?.AiteNodeType ?? 'unsigned'
    }

    __findChildByKey(key: StringNumberBool | NullUndefined): AiteNodes | undefined{
        if(this.children){
            return this.children.find(child => child.__key === key)
        }
        return undefined
    }
}

export {
    editorDOMState,
    AiteNode,

    createNewDOMstate,
    returnSingleDOMNode,
    createAiteNode,
    createDOMElement,
    createNewObjectState,
    createAITEContentNode,
    
    $$mountNode,
    $$unmountNode,
    $$updateNodeTextContent,
    $$bulkUnmountNodes,
    $$remountNode,
}

export type{
    AiteHTMLNode,
    AiteHTMLTextNode,
    AiteTextNode,
    AiteNodes,
    AiteNodeOptions,
    AiteNodeTypes
}