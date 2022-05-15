import SearchUtils from './SearchUtils';
import {TEXT_NODE_TYPE} from './ConstVariables';

export type CharStyleArr = {c: string | null};
type TextNodeData = [typeof TEXT_NODE_TYPE, string, Array<string>, CharStyleArr];

export default class TextNode {
	d: TextNodeData;

	// PT - plain text
	// SA - inline style array
	// CR - char range in block

	//`Hello world ${Math.random().toString(36).slice(4, 9)} `

	constructor(PT?: string, SA?: Array<string>) {
		this.d = [TEXT_NODE_TYPE, PT ?? '', SA ?? [], {c: null}];
	}

	prepareStyles() {
		let StylesArr: CharStyleArr = {c: null};
		let SingleClass = '';
		this.d[2].forEach((Style) => {
			let currentStyle = SearchUtils.findStyle(Style);
			if (currentStyle.class !== undefined) {
				SingleClass += `${currentStyle.class} `;
			}
		});
		if (SingleClass !== '') {
			StylesArr.c = SingleClass !== '' ? SingleClass : null;
		}
		this.d[3] = StylesArr;
	}

	returnActualType(): string {
		return this.d[0];
	}
	returnType(): string {
		return TEXT_NODE_TYPE;
	}
	returnContent(): string {
		return this.d[1];
	}
	returnContentLength(): number {
		return this.d[1].length;
	}

	returnNodeStyle(): Array<string> {
		return this.d[2];
	}

	getSlicedContent(startFromZero: boolean = true, start: number, end?: number): string {
		if (end) return this.d[1].slice(start, end);
		else if (startFromZero === true) return this.d[1].slice(0, start);
		else return this.d[1].slice(start);
	}
}
