import {BaseNode} from "./index";
import {findStyle, DiffNodeState} from "../EditorUtils";

import {createAiteNode} from "../index";
import type {AiteNode, AiteNodeOptions} from "../index";

import {updateTextNodeContent} from "../index";
import {NodeStatus, NodeUpdateOptions, TextNodeAttr} from "./interface";
import {ObservableTextNode} from "../observers/TextNodeObserver";

function createTextNode(text: string = "", styles?: Array<string>) {
	return new TextNode({plainText: text, styles: styles ?? []});
}

class TextNode extends BaseNode {
	content: string;
	_styles: Array<string>;

	constructor(initData?: TextNodeAttr) {
		super("text");
		this.content = initData?.plainText ?? "";
		this._styles = initData?.styles ?? [];

		return ObservableTextNode(this).value();
	}

	// DEPRECATED REPLACED WITH PROXY
	update(func: (textNode: TextNode) => void, options?: NodeUpdateOptions): number {
		const copiedState = {...this};

		func(this);

		const removeIfEmpty = options?.removeIfEmpty ?? true;

		if (this.content === "" && removeIfEmpty) {
			this.remove();
		} else if (this.status === NodeStatus.MOUNTED) {
			const diffResult = DiffNodeState(copiedState, this);

			if (Object.keys(diffResult).length > 0) {
				if (diffResult.content) {
					updateTextNodeContent(this);
				}
				if (diffResult.__styles) {
					// TODO:
				}
			}
		}

		return this.status;
	}

	getStyles() {
		return this._styles;
	}

	private prepareStyles() {
		return this._styles.map((style) => findStyle(style)?.class ?? "").join(" ");
	}

	$getNodeState(options?: AiteNodeOptions): AiteNode {
		const props = {
			className: this.prepareStyles(),
			"data-aite-node": true,
		};
		return createAiteNode(this, "span", props, [this.content], {...options});
	}

	getContent(): string {
		return this.content;
	}

	//DEPRECATED
	appendContent(string: string): void {
		this.content += string;
	}
	getContentLength(): number {
		return this.content.length;
	}

	getNodeStyle(): Array<string> {
		return this._styles;
	}

	getSlicedContent(startFromZero: boolean = true, start: number, end?: number): string {
		if (end) return this.content.slice(start, end);
		else if (startFromZero === true) return this.content.slice(0, start);
		else return this.content.slice(start);
	}

	createSelfNode(data: TextNodeAttr) {
		return new TextNode(data);
	}

	getData(asCreation?: boolean) {
		if (asCreation) {
			return {
				...this,
				plaintText: this.content,
				stylesArr: this._styles,
			};
		}
		return {...this};
	}

	sliceContent(start?: number, end?: number, CharToInsert?: string) {
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
}

export {createTextNode, TextNode};
