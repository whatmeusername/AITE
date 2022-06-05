import type {EditorState} from './EditorState'

import type ContentNode from './ContentNode'
import type {NodeTypes, BlockType} from './BlockNode'
import type {TextNode} from './AITE_nodes/index'

import {getEditorState} from './EditorState'
import {HTML_TEXT_NODE} from './ConstVariables'

type NullUndefined = null | undefined
type StringNumberBool = string | number | boolean
type AiteNodes = AiteNode | AiteTextNode
type CSSStyles = {[K: string]: string}


interface AiteHTMLNode extends HTMLElement {
    $$AiteNodeType: string;
    $$isAiteNode: true;
    $$isAiteWrapper: boolean;
}

interface AiteHTMLTextNode extends Text {
    $$isAiteNode: true;
}

interface AiteNodeOptions{
    key?: StringNumberBool,
    isAiteWrapper?: boolean;
}



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
    childOnly: boolean = false
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
                    (parentDOMObject.children as Array<AiteNode | AiteTextNode>)[nodePath.length - 1] = updatedNodeState
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
                if(parentDOMObject.children instanceof AiteNode){
                    (parentDOMObject.children as Array<AiteNode | AiteTextNode>)[nodePath.length - 1] = updatedNodeState
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
    return /^on/.test(name);
  }
//eslint-disable-next-line
function addEventListeners($target: AiteHTMLNode, props: {[K: string]: any}) {
    Object.keys(props).forEach(name => {
      if (isEventProp(name)) {
        $target.addEventListener(
            name.slice(2).toLowerCase(),
            props[name]
        );
      }
    });
  }

function createAiteDomNode(node: AiteNode): AiteHTMLNode{
    let DOMnode = document.createElement(node.type) as AiteHTMLNode
    DOMnode.$$isAiteNode = true
    DOMnode.$$AiteNodeType = 'test'
    DOMnode.$$isAiteWrapper = node.isAiteWrapper ?? false
    return DOMnode
}

function createAiteText(string: string): AiteHTMLTextNode{
    let textNode = document.createTextNode(string) as AiteHTMLTextNode
    textNode.$$isAiteNode = true
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
            Object.entries(node.props).map(([key, value]) => {
                setAttribute($node, key, value)
            })
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
            Object.entries(node.props).map(([key, value]) => {
                setAttribute($node, key, value)
            })
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
            node.children.map(appendChildrens).forEach(currentDOMNode.appendChild.bind(currentDOMNode))
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

    constructor(EditorState: EditorState){
        this.__editorObjectState = createNewObjectState(EditorState)
		this.__rootDOMElement = createDOMElement(this.__editorObjectState.get()) as AiteHTMLNode
    }




    __setDOMElement(node: AiteHTMLNode){
        this.__rootDOMElement = node
    }

    getDOMNode(path: Array<number>, forceDOM?: AiteHTMLNode){

        let rootElement = forceDOM ? forceDOM : this.__rootDOMElement

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
                    if(nextNode !== undefined && nextNode.$$isAiteWrapper === false) node = nextNode;
                    // if node is leaf node or decorator node then we looking for needed node in current node childrens
                    else if(nextNode !== undefined && 
                        (
                            (nextNode.dataset.aite_decorator_node !== undefined && i !== pathLength - 1) || 
                            nextNode.$$isAiteWrapper === true || 
                            nextNode.dataset.aite_content_node !== undefined
                        )){
                        nodeChildrens = nextNode.childNodes as NodeListOf<AiteHTMLNode>
                        for(let i = 0; i < nodeChildrens.length; i++){
                            let nextNode = nodeChildrens[i] as AiteHTMLNode
                            if(nextNode.$$isAiteWrapper === false){
                                node = nextNode  as AiteHTMLNode
                            }
                        }
                    }
                    else return undefined
                }
            }
            return node
        }
        return undefined
    }


    // __reconciliation(){
    //     let hasMutated = false

    //     let EditorState = getEditorState()
    //     let selectionState = getSelectionState()

    //     if(EditorState === undefined || selectionState === undefined) return;

    //     console.time('performance')

    //     // let parentNode = this.__editorObjectState.getObjectNode(selectionState.anchorPath.get()) as AiteNode
    //     // let nextParentNode = createNewObjectState(EditorState, selectionState.anchorPath.get()).__editorObjectState

    //     /* 
    //         perfomance tests:
    //             input: 20000 nodes - 0.3ms - 1.1 ms
    //             remove: 20000 nodes - 0.7ms - 1.1ms (saw freezes)

    //     */

    //     let parentNode = this.__editorObjectState.getObjectNode([...selectionState.anchorPath.get(), selectionState.anchorNodeKey]) as AiteNode
    //     let nextParentNode = createNewObjectState(EditorState, [...selectionState.anchorPath.get(), selectionState.anchorNodeKey]).__editorObjectState

    //     if(nextParentNode === undefined){
    //         this.__editorObjectState = createNewObjectState(EditorState)
    //     }
    //     else if(nextParentNode !== undefined && parentNode !== undefined){
    //         this.__diffChildren(nextParentNode as AiteNode, parentNode as AiteNode);
    //         (this.__editorObjectState.getObjectNode(selectionState.anchorPath.get()) as AiteNode).children![selectionState.anchorNodeKey] = nextParentNode;
        
    //     }
    //    console.timeEnd('performance')
    // }   

    // __diffChildren(nextObject: AiteNode | AiteNodes[], currentObject: AiteNode | AiteNodes[]){
    //     let nextChildren: AiteNodes[] | NullUndefined = undefined
    //     let currentChildren: AiteNodes[] | NullUndefined = undefined

    //     if(Array.isArray(nextObject) && Array.isArray(currentObject)){
    //         nextChildren = nextObject
    //         currentChildren = currentObject
    //     }
    //     else if(nextObject instanceof AiteNode && currentObject !instanceof AiteNode){
    //         nextChildren = nextObject.children 
    //         currentChildren = currentObject.children
    //     }
    //     if(nextChildren && currentChildren){
    //         for(let i = 0; i < nextChildren.length; i++){
    //             let nextNode = nextChildren[i]
    //             let currentNode =  currentChildren[i]
    //             if(nextNode.__key !== currentNode.__key){
    //                 currentNode = currentChildren.find(child => child.__key === nextNode.__key) ?? currentNode
    //             }
    //             this.__diffNode(nextNode, currentNode)
    //         }
    //     }
    // }

    //  __diffNode(nextNode: AiteNodes, currentNode: AiteNodes): boolean{

    //     let hasMutated = false

    //     if(nextNode instanceof AiteTextNode && currentNode instanceof AiteTextNode){
    //         this.__reconcileTextNode(nextNode, currentNode)
    //     }
    //     else if(nextNode instanceof AiteNode && currentNode instanceof AiteNode){
    //         let currentDOMNode = this.getDOMNode(currentNode.__path as Array<number>)
    //         if(currentDOMNode !== undefined){
    //             if(nextNode.type !== currentNode.type){
    //                 let parentDOMNode = this.getDOMNode(getParentPath(currentNode.__path) as Array<number>)
    //                 if(parentDOMNode) parentDOMNode.replaceChild(returnSingleDOMNode(nextNode) as Node, currentDOMNode)
    //                 return true
    //             }
    //             this.__reconcileProps(currentDOMNode, nextNode, currentNode)
    //         }
    //         if(nextNode.children && nextNode.children.length > 0){
    //             this.__diffChildren(nextNode, currentNode)
    //         }
    //     }
    //     return hasMutated
    // }

    // __reconcileTextNode(nextNode: AiteNodes, currentNode: AiteNodes){
    //     if(nextNode.__key === currentNode.__key){
    //         if(currentNode.children !== nextNode.children){
    //             let currentDOMNode = this.getDOMNode(currentNode.__path as Array<number>)
    //             if(currentDOMNode !== undefined && typeof nextNode.children === 'string'){
    //                 currentDOMNode.textContent = nextNode.children as string
    //             }
    //         }
    //     }
    //     else{

    //         let currentDOMNode = this.getDOMNode(currentNode.__path as Array<number>)
    //         if(currentDOMNode?.firstChild instanceof Text && currentDOMNode !== undefined && typeof nextNode.children === 'string'){
    //             currentDOMNode.textContent = nextNode.children as string
    //         }

    //         // --- replace method
    //         // --- upodate method
    //         // --- remove method
            
    //     }
    // }

    // __reconcileStyles($target: AiteHTMLNode, currentStyles: CSSStyles, nextStyles: CSSStyles){
    //     Object.entries(currentStyles).forEach(([key, value]) => {
    //         if(nextStyles[key] !== value && nextStyles[key] !== undefined){

    //         }
    //     })
    // }

    // __reconcileProps($target: AiteHTMLNode, currentNode: AiteNode, nextNode: AiteNode){
    //     let nextNodeProps = nextNode.props as {[K: string]: string}
    //     if(nextNodeProps && currentNode.props){
    //         Object.entries(currentNode.props).forEach(([key, value]) => {
    //             if(nextNodeProps[key] !== value && nextNodeProps[key] !== undefined){
    //                 if(key !== 'style'){
    //                     setAttribute($target, key, value)
    //                 }
    //                 else if(key === 'style'){
    //                     // TODO: TEST
    //                     //this.__reconcileStyles($target, currentNode.props[key], nextNodeProps[key])
    //                 }
    //             }
    //             else if(nextNodeProps[key] === undefined){
    //                 removeAttribute($target, key, value)
    //             }
    //         })
    //     }
    // }
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
        let updatedChildren: Array<AiteNodes>  = children.map((node, index) => {
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
    __key: StringNumberBool | NullUndefined
    isAiteWrapper: boolean

    // AiteNodeType: string

    constructor(type: string, props: {[K: string]: any} | NullUndefined, children: Array<AiteNodes> | NullUndefined, options?: AiteNodeOptions){
        this.type = type
        this.props = props
        this.children = children
        this.childrenLength = this.children?.length ?? 0
        this.isAiteWrapper = options?.isAiteWrapper ?? false
        this.__key = options?.key ?? generateNewRandomKey()
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
    AiteNodes,
    AiteNodeOptions,
}