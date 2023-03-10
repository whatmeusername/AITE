import {BaseNode} from "./index";
import {findStyle} from "../EditorUtils";

import {createAiteNode} from "../index";
import type {AiteNode} from "../index";

import {TextNodeAttr} from "./interface";
import {ObservableTextNode} from "../observers/TextNodeObserver";

function createTextNode(text: string = "", styles?: Array<string>) {
	return new TextNode({plainText: text, styles: styles ?? []});
}

class TextNode extends BaseNode {
	content: string;
	_styles: Array<string>;

	constructor(initData?: TextNodeAttr) {
		super(initData?.type ?? "text", initData);
		this.content = initData?.plainText ?? "";
		this._styles = initData?.styles ?? [];

		return ObservableTextNode(this).value();
	}

	public get length(): number {
		return this.content.length;
	}

	public clone(): TextNode {
		return new TextNode(this.initData);
	}

	private prepareStyles() {
		return this._styles.map((style) => findStyle(style)?.class ?? "").join(" ");
	}

	public createNodeState(): AiteNode {
		const props = {
			className: this.prepareStyles(),
			"data-aite-node": true,
		};
		return createAiteNode(this, "span", props, [this.content]);
	}

	public getContent(): string {
		return this.content;
	}

	public getNodeStyle(): Array<string> {
		return this._styles;
	}

	public getSlicedContent(startFromZero: boolean = true, start: number, end?: number): string {
		if (end) return this.content.slice(start, end);
		else if (startFromZero === true) return this.content.slice(0, start);
		else return this.content.slice(start);
	}

	public createSelfNode(data: TextNodeAttr) {
		return new TextNode(data);
	}

	public getData(asCreation?: boolean) {
		if (asCreation) {
			return {
				...this,
				plaintText: this.content,
				stylesArr: this._styles,
			};
		}
		return {...this};
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
}

export {createTextNode, TextNode};
