import {AiteHTMLNode, NodeMap} from "./interface";
import {Nullable} from "../Interfaces";

export const __nodeMap: NodeMap = new Map();

class EditorDOMState {
	private __rootDOMElement: AiteHTMLNode | null;
	private readonly __nodeMap: Map<string, AiteHTMLNode>;

	constructor() {
		this.__nodeMap = __nodeMap;
		this.__rootDOMElement = null;
	}

	public getNodeFromMap(key: Nullable<number>): AiteHTMLNode | undefined {
		if (key) {
			return this.__nodeMap.get(`${key}`) ?? undefined;
		}
		return undefined;
	}

	public removeNodeFromMap(key: Nullable<number>): void {
		if (key) {
			this.__nodeMap.delete(`${key}`);
		}
	}

	public getRootHTMLNode(): AiteHTMLNode | null {
		return this.__rootDOMElement;
	}

	public setDOMElement(node: AiteHTMLNode) {
		this.__rootDOMElement = node;
	}
}

export {EditorDOMState};
