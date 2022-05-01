interface defaultInlineStyles{
    style: string
    tag: string,
    class?: string
    inline?: string
}


const defaultInlineStyles: Array<defaultInlineStyles> = [
    {
        style: 'BOLD',
        tag: 'strong',
        class: 'ATEditor__standart__BOLD'
    },
    {
        style: 'STANDART',
        tag: 'span',
        class: 'ATEditor__standart__STANDART'
    },
    {
        style: 'ITALIC',
        tag: 'em',
        class: 'ATEditor__standart__ITALIC'
    },
    {
        style: 'SUPERSCRIPT',
        tag: 'sup',
        class: 'ATEditor__standart__SUPERSCRIPT'
    },
    {
        style: 'SUBSCRIPT',
        tag: 'sub',
        class: 'ATEditor__standart__SUBSCRIPT'
    },
    {
        style: 'UNDERLINE',
        tag: 'u',
        class: 'ATEditor__standart__UNDERLINE'
    },
    {
        style: 'STRIKETHROUGH',
        tag: 'strike',
        class: 'ATEditor__standart__STRIKETHROUGH'
    }
]

export default defaultInlineStyles