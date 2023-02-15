import {getDecoratorNode, isNodesPathEqual} from '../../EditorUtils';

import {NodePath, getSelection} from '../../SelectionUtils';
import {getEditorState, getSelectionState} from '../../index';
import {AiteHTMLNode} from '../../index';

type mouseEvent = React.MouseEvent | MouseEvent;
type EditorNodeSelectedData = {node: Node | HTMLElement; index: number} | undefined;

export default class ActiveElementState {
	allowedAllements: Array<string>;
	isActive: boolean;
	pathToActiveNode: NodePath;
	activeNodeKey: number | undefined;
	activeNodeType: string | undefined;

	constructor() {
		this.allowedAllements = ['image/gif'];
		this.isActive = false;
		this.pathToActiveNode = new NodePath();
		this.activeNodeKey = undefined;
		this.activeNodeType = undefined;
	}

	addElementToAllowed(element: string): void {
		if (this.allowedAllements.findIndex((o) => o === element) === -1) {
			this.allowedAllements.push(element);
		}
	}

	removeElementFromAllowed(element: string): void {
		let elementIndex = this.allowedAllements.findIndex((o) => o === element);
		if (elementIndex !== -1) {
			this.allowedAllements.splice(elementIndex, 1);
		}
	}
	resetActiveData(): void {
		this.isActive = false;
		this.pathToActiveNode.set([]);
		this.activeNodeKey = undefined;
	}

	handleActiveClick(target: AiteHTMLNode): void {
		let EditorState = getEditorState();
		let selectionState = EditorState.selectionState;
		let nodeType = target.$$AiteNodeType ? target.$$AiteNodeType : selectionState.$getNodeType(target);

		if (nodeType && this.allowedAllements.includes(nodeType)) {
			let decoratorNode = getDecoratorNode(target);
			let targetNodeDOMData = selectionState.__getBlockNode(decoratorNode);

			if (!isNodesPathEqual(this.pathToActiveNode, targetNodeDOMData.nodePath)) {
				let nodeType = target.$$AiteNodeType ? target.$$AiteNodeType : selectionState.$getNodeType(target);
				if (nodeType && this.allowedAllements.includes(nodeType)) {
					let previousActivePath = this.pathToActiveNode.get();
					this.resetActiveData();

					let targetNodeData = getEditorState().contentNode.getBlockByPath(previousActivePath);
					targetNodeData.remount();

					this.setActiveElement(target);
				}
			}
		} else {
			let previousActivePath = this.pathToActiveNode.get();
			this.resetActiveData();

			let targetNodeData = getEditorState().contentNode.getBlockByPath(previousActivePath);
			targetNodeData.remount();
		}
	}

	setActiveElement(target: AiteHTMLNode): void {
		let EditorState = getEditorState();
		let selectionState = EditorState.selectionState;
		let contentNode = EditorState.contentNode;

		let decoratorNode = getDecoratorNode(target);
		let targetNodeDOMData;

		if (decoratorNode.dataset?.aite_decorator_node) {
			targetNodeDOMData = selectionState.__getBlockNode(decoratorNode);
		}
		targetNodeDOMData = selectionState.__getBlockNode(target);
		let targetNodeData = contentNode.getBlockByPath(targetNodeDOMData.nodePath);
		if (targetNodeData) {
			this.isActive = true;
			this.activeNodeType = target.$$AiteNodeType ? target.$$AiteNodeType : selectionState.$getNodeType(target) ?? undefined;
			this.activeNodeKey = targetNodeData.$getNodeKey();
			this.pathToActiveNode.set(targetNodeDOMData.nodePath);
			targetNodeData.remount();
		}
	}

	handleElementClick(event: MouseEvent): void {
		let target = event.target as AiteHTMLNode;
		if (this.isActive) {
			this.handleActiveClick(target);
		} else if (target && target.$$isAiteNode) {
			let selectionState = getSelectionState();
			let nodeType = target.$$AiteNodeType ? target.$$AiteNodeType : selectionState.$getNodeType(target);
			if (nodeType && this.allowedAllements.includes(nodeType)) {
				this.setActiveElement(target);
				getSelection().removeAllRanges();
			}
		}
	}
}
