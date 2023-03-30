import {BaseNode} from "./index";
import {getStyleData} from "../EditorUtils";

import {createAiteNode} from "../index";
import type {AiteNode} from "../index";

import {TextNodeAttr} from "./interface";
import {ObservableTextNode} from "../observers/TextNodeObserver";
import {StyleData} from "../Interfaces";
import {isTextNode} from "../typeguards";
import {TEXT_NODE_TYPE} from "../ConstVariables";

function createTextNode(text: string = "", styles?: Array<string>) {
	return new TextNode({plainText: text, styles: styles ?? []});
}

class TextNode extends BaseNode {
	public content: string;
	private styles: StyleData[];

	constructor(initData?: TextNodeAttr) {
		super(true, initData?.type ?? TEXT_NODE_TYPE, initData);
		this.content = initData?.plainText ?? "";
		this.styles = initData?.styles ? initData.styles.map((style) => getStyleData(style)) : [];

		return ObservableTextNode(this).value();
	}

	public get length(): number {
		return this.content.length;
	}

	public clone(): TextNode {
		return new TextNode(this.initData);
	}

	public createNodeState(): AiteNode {
		const props = {
			className: this.styles.map((style) => style.class).join(" "),
		};
		return createAiteNode(this, "span", props, [this.content]);
	}

	public createSelfNode(data: TextNodeAttr) {
		return new TextNode(data);
	}

	public sliceContent(start?: number, end?: number, CharToInsert?: string) {
		CharToInsert = CharToInsert ?? "";
		if (start === undefined && end === undefined) {
			this.content = this.content + CharToInsert;
		} else if (end !== undefined && end !== -1) {
			this.content = this.content.slice(0, start) + CharToInsert + this.content.slice(end);
		} else if (end === undefined) {
			this.content = this.content.slice(start) + CharToInsert;
		} else {
			this.content = this.content.slice(0, start) + CharToInsert;
		}
	}

	public sliceToTextNode(start: number, end: number): TextNode {
		let slicedContent = "";
		if (end !== undefined && end !== -1) {
			slicedContent = this.content.slice(start, end);
			this.content = this.content.slice(0, start) + this.content.slice(end);
		} else if (end === undefined) {
			slicedContent = this.content.slice(0, start);
			this.content = this.content.slice(start);
		} else {
			slicedContent = this.content.slice(start);
			this.content = this.content.slice(0, start);
		}
		return this.createSelfNode({...this.initData, plainText: slicedContent});
	}

	public tryToMerge(node: BaseNode): TextNode | null {
		if (!isTextNode(node) || node.styles.length !== this.styles.length) return null;
		for (let i = 0; i < this.styles.length; i++) {
			if (!node.styles.find((s) => s.style === this.styles[i].style)) return null;
		}
		return this.createSelfNode({...this.initData, plainText: this.content + node.content});
	}
}

export {createTextNode, TextNode};
