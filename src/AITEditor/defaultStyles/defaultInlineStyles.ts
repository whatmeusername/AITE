interface defaultInlineStyles {
	style: string;
	tag: string;
	class?: string;
	inline?: string;
}

const defaultInlineStyles: Array<defaultInlineStyles> = [
	{
		style: "BOLD",
		tag: "strong",
		class: "AITEditor__standart__BOLD",
	},
	{
		style: "STANDART",
		tag: "span",
		class: "AITEditor__standart__STANDART",
	},
	{
		style: "ITALIC",
		tag: "em",
		class: "AITEditor__standart__ITALIC",
	},
	{
		style: "SUPERSCRIPT",
		tag: "sup",
		class: "AITEditor__standart__SUPERSCRIPT",
	},
	{
		style: "SUBSCRIPT",
		tag: "sub",
		class: "AITEditor__standart__SUBSCRIPT",
	},
	{
		style: "UNDERLINE",
		tag: "u",
		class: "AITEditor__standart__UNDERLINE",
	},
	{
		style: "STRIKETHROUGH",
		tag: "strike",
		class: "AITEditor__standart__STRIKETHROUGH",
	},
];

export default defaultInlineStyles;
