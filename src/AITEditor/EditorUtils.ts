
import{
	KeyboardEventCommand
} from './editorCommandsTypes'


function unpackNode(node: HTMLElement): Array<HTMLElement> {
	return Array.from(node.children) as Array<HTMLElement>;
}

function getChildrenNodes(blockNode: HTMLElement): Array<HTMLElement> {
	let childrens = unpackNode(blockNode)
	for(let i = 0; i < childrens.length; i++) {
		let node = childrens[i]
		let dataset = node.dataset
		if(dataset.aiteNodeLeaf !== undefined){
			let children = Array.from(node.children) as Array<HTMLElement>
			childrens = [...childrens.slice(0, i), ...children, ...childrens.slice(i + 1)]
		}
	}
	return childrens
}

function findEditorBlockIndex(node: HTMLElement): {node: HTMLElement, index: number} | undefined {
	while (true) {
		let nodeDataSet = (node.parentNode as HTMLElement)?.dataset;
		if (nodeDataSet.aite_editor_root !== undefined) {
			return {
				node: node,
				index: Array.from(node.parentNode!.children).indexOf(node),
			};
		} else if (node.tagName === 'BODY') break;
		node = node.parentNode as HTMLElement;
	}
	return undefined;
}

function findEditorRoot(node: HTMLElement): HTMLElement | undefined {
	while (true) {
		let nodeDataSet = (node.parentNode as HTMLElement)?.dataset;
		if (nodeDataSet.aite_editor_root !== undefined) {
			return node.parentNode as HTMLDivElement;
		} else if (node.tagName === 'BODY') break;
		node = node.parentNode as HTMLElement;
	}
	return undefined;
}

function findEditorCharIndex(node: HTMLElement): {node: HTMLElement, index: number} | undefined  {
	while (true) {
		let nodeDataSet = (node.parentNode as HTMLElement)?.dataset;
		if (nodeDataSet.aite_block_node !== undefined) {
			return {
				node: node,
				index: Array.from(node.parentNode!.children).indexOf(node),
			};
		} else if (node.tagName === 'BODY') break;
		node = node.parentNode as HTMLElement;
	}
	return undefined;
}


function isTextNode(node: HTMLElement): boolean {
	if(node.parentElement?.dataset.aite_block_node !== undefined){
		return true;
	}
	return false;
}

function isArrow(event: KeyboardEventCommand){
	return(
		event.code === 'ArrowLeft'  ||
		event.code === 'ArrowRight' ||
		event.code === 'ArrowUp' ||
		event.code === 'ArrowDown'
	)
}

function isArrowLeft(event: KeyboardEventCommand){
	return event.code === 'ArrowLeft'
}

function isArrowRight(event: KeyboardEventCommand){
	return event.code === 'ArrowRight'
}

function isArrowUp(event: KeyboardEventCommand){
	return event.code === 'ArrowUp'
}

function isArrowDown(event: KeyboardEventCommand){
	return event.code === 'ArrowDown'
}


function editorWarning(shoudThrow: boolean, message: string){
	if(shoudThrow) {
		console.warn(
		`AITE internal warning: ${message}`
	)
}
}

function editorError(shoudThrow: boolean, message: string){
	if(shoudThrow) throw new Error(
		`AITE internal error: ${message}`
	)
}


function isDefined(obj: any): boolean{
	return (obj !== undefined && obj !== null)
}


function isSafari(): boolean{
	let userAgent = navigator.userAgent
	return (/safari/i.test(userAgent) && !/chromium|edg|ucbrowser|chrome|crios|opr|opera|fxios|firefox/i.test(userAgent))
}
function isApple(): boolean{
	return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
}

function isMeta(event: KeyboardEventCommand){
	if(isApple()){
		return event.metaKey
	}
	return false
}

function isAlt(event: KeyboardEventCommand){
	return event.altKey
}

function isCtrl(event: KeyboardEventCommand){
	return event.ctrlKey
}

function isForwardBackspace(event: KeyboardEventCommand): boolean{
	return (event.code === 'Delete' || event.code === 'Backspace') && event.which === 46
}

function isBackwardRemoveLine(event: KeyboardEventCommand): boolean{
	if(isApple()){
		return (event.code === 'Delete' || event.code === 'Backspace') && isMeta(event)
	}
	else return false
}

function isForwardRemoveLine(event: KeyboardEventCommand): boolean{
	if(isApple()){
		return (event.code === 'Delete' || event.code === 'Backspace') && event.which === 46 && isMeta(event)
	}
	else return false
}

function isBackwardRemoveWord(event: KeyboardEventCommand | React.KeyboardEvent): boolean{
	if(isApple()){
		return event.code === 'Backspace' && isAlt(event)
	}
	else return event.code === 'Backspace' && isCtrl(event)
}

function isForwardRemoveWord(event: KeyboardEventCommand): boolean{
	if(isApple()){
		return (event.code === 'Delete' || event.code === 'Backspace') && isAlt(event) && event.which === 46
	}
	else return (event.code === 'Delete' || event.code === 'Backspace') && isCtrl(event) && event.which === 46
}


export {
	getChildrenNodes,
	
	editorWarning,

	findEditorBlockIndex,
	findEditorRoot,
	findEditorCharIndex,

	isApple,

	isBackwardRemoveLine,
	isBackwardRemoveWord,

	isForwardBackspace,
	isForwardRemoveWord,
	isForwardRemoveLine,

	isArrow,
	isArrowLeft,
	isArrowRight,
	isArrowUp, 
	isArrowDown,

	isTextNode,
	isDefined
	
}