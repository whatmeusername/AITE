import {BaseNode} from "./index";
import {findStyle, DiffNodeState} from "../EditorUtils";

import {createAiteNode} from "../index";
import type {AiteNode, AiteNodeOptions} from "../index";

import {updateTextNodeContent} from "../index";
import {NodeStatus, NodeUpdateOptions, TextNodeAttr} from "./interface";

function createTextNode(text: string = "", styles?: Array<string>) {
	return new TextNode({plainText: text, styles: styles ?? []});
}

const TEXT_NODE_CONTENT_KEY = "__content";

class TextNode extends BaseNode {
	[TEXT_NODE_CONTENT_KEY]: string;
	_styles: Array<string>;

	constructor(initData?: TextNodeAttr) {
		super("text");
		this.__content = initData?.plainText ?? "";
		this._styles = initData?.styles ?? [];

		return new Proxy(this, {
			set(target: TextNode, key: keyof TextNode, value) {
				if (key === TEXT_NODE_CONTENT_KEY) {
					if (target[TEXT_NODE_CONTENT_KEY] === "") {
						target.remove();
					} else if (target[TEXT_NODE_CONTENT_KEY] !== value) {
						target[TEXT_NODE_CONTENT_KEY] = value;
						updateTextNodeContent(target);
					}
				} else (target as any)[key] = value;
				return true;
			},
			get(target: TextNode, key: keyof TextNode): TextNode[keyof TextNode] {
				return target[key];
			},
		});
	}

	// DEPRECATED REPLACED WITH PROXY
	update(func: (textNode: TextNode) => void, options?: NodeUpdateOptions): number {
		const copiedState = {...this};

		func(this);

		const removeIfEmpty = options?.removeIfEmpty ?? true;

		if (this.__content === "" && removeIfEmpty) {
			this.remove();
		} else if (this.status === NodeStatus.MOUNTED) {
			const diffResult = DiffNodeState(copiedState, this);

			if (Object.keys(diffResult).length > 0) {
				if (diffResult.__content) {
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
		return createAiteNode(this, "span", props, [this.__content], {...options});
	}

	getContent(): string {
		return this.__content;
	}

	//DEPRECATED
	appendContent(string: string): void {
		this.__content += string;
	}
	getContentLength(): number {
		return this.__content.length;
	}

	getNodeStyle(): Array<string> {
		return this._styles;
	}

	getSlicedContent(startFromZero: boolean = true, start: number, end?: number): string {
		if (end) return this.__content.slice(start, end);
		else if (startFromZero === true) return this.__content.slice(0, start);
		else return this.__content.slice(start);
	}

	createSelfNode(data: TextNodeAttr) {
		return new TextNode(data);
	}

	getData(asCreation?: boolean) {
		if (asCreation) {
			return {
				...this,
				plaintText: this.__content,
				stylesArr: this._styles,
			};
		}
		return {...this};
	}

	sliceContent(start?: number, end?: number, CharToInsert?: string) {
		CharToInsert = CharToInsert ?? "";
		if (start === undefined && end === undefined) {
			this.__content = this.__content + CharToInsert;
		} else if (end !== undefined && end !== -1) {
			this.__content = this.__content.slice(0, start) + CharToInsert + this.__content.slice(end);
		} else if (end === undefined) {
			this.__content = this.__content.slice(start) + CharToInsert;
		} else {
			this.__content = this.__content.slice(0, start) + CharToInsert;
		}
	}
}

export {createTextNode, TextNode};
