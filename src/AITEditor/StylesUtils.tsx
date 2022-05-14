import React from 'react';
import defaultInlineStyles from './defaultStyles/defaultInlineStyles';

const StylesUtils = {
	findStyle: (StyleKey: string) => {
		let style = defaultInlineStyles.find((style) => style.style === StyleKey);
		if (style !== undefined) {
			return style;
		} else throw new Error(`Can't find inline style with name ${StyleKey}, because its not defineded `);
	},
	bulkFindStyles: (StylesKeys: Array<string>) => {
		let bulkStyle: Array<defaultInlineStyles> = [];
		defaultInlineStyles.forEach((style) => {
			if (StylesKeys.includes(style.style)) {
				bulkStyle.push(style);
			}
		});
		return bulkStyle;
	},
	CollectSingleStyle: function (StyleArray: Array<string>) {
		let CollectedStyle = '';
		let bulkStyles = this.bulkFindStyles(StyleArray);
		let bulkStylesLenth = bulkStyles.length;

		bulkStyles.forEach((style, index) => {
			CollectedStyle += style.inline;
			if (bulkStylesLenth - 1 !== index) {
				CollectedStyle += '; ';
			}
		});
		return CollectedStyle;
	},
};

export default StylesUtils;
