import {BaseNode, DOMhtml} from './index';
import {findStyle, DiffNodeState} from '../EditorUtils';

import {createAiteNode} from '../index';
import type {AiteNode, AiteNodeOptions} from '../index';

import {updateTextNodeContent} from '../index';

interface DOMTextAttr extends DOMhtml {
	className?: string;
	'data-aite-node'?: boolean;
}

interface textNodeConf {
	plainText: string;
	styles?: Array<string>;
}

interface updateOptions {
	removeIfEmpty?: boolean;
}

function createTextNode(text: string = '', styles?: Array<string>) {
	return new TextNode({plainText: text, styles: styles ?? []});
}

const TEXT_NODE_CONTENT_KEY = '__content';

class TextNode extends BaseNode {
	[TEXT_NODE_CONTENT_KEY]: string;
	_styles: Array<string>;

	constructor(initData?: textNodeConf) {
		super('text');
		this.__content = initData?.plainText ?? '';
		this._styles = initData?.styles ?? [];

		return new Proxy(this, {
			set(target: TextNode, key: string, value) {
				const copiedState: TextNode = {...this} as TextNode;
				(target as any)[key] = value;
				if (key === TEXT_NODE_CONTENT_KEY) {
					if (target[TEXT_NODE_CONTENT_KEY] === '') {
						target.remove();
						target.status = 0;
					} else if (target[TEXT_NODE_CONTENT_KEY] !== copiedState[TEXT_NODE_CONTENT_KEY]) {
						updateTextNodeContent(target);
					}
				}
				return true;
			},
			get(target: TextNode, key: keyof TextNode): TextNode[keyof TextNode] {
				return target[key];
			},
		});
	}

	update(func: (textNode: TextNode) => void, options?: updateOptions): number {
		let copiedState = {...this};

		func(this);

		let removeIfEmpty = options?.removeIfEmpty ?? true;

		if (this.__content === '' && removeIfEmpty) {
			this.remove();
			this.status = 0;
		} else if (this.__status === 1) {
			let diffResult = DiffNodeState(copiedState, this);

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

	__prepareStyles() {
		let classString = '';
		this._styles.forEach((Style) => {
			let currentStyle = findStyle(Style);
			if (currentStyle.class !== undefined) {
				classString += currentStyle.class + ' ';
			}
		});
		return classString;
	}

	$getNodeState(options?: AiteNodeOptions): AiteNode {
		let className = this.__prepareStyles();
		let props = {
			className: className,
			'data-aite-node': true,
		};
		return createAiteNode(this, 'span', props, [this.__content], {...options, isAiteWrapper: false});
	}

	getContent(): string {
		return this.__content;
	}

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

	createSelfNode(data: textNodeConf) {
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

	sliceText(start?: number, end?: number, CharToInsert?: string) {
		CharToInsert = CharToInsert ?? '';
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

export type {DOMTextAttr, textNodeConf};
