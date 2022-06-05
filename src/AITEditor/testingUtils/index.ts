import {Component} from "react";
import { renderToString } from 'react-dom/server'


function nodeToString(node: JSX.Element | HTMLElement): string {
    if(node instanceof Component) {
        return renderToString(node as JSX.Element)
    }
    return (node as HTMLElement).outerHTML
}


export {
    nodeToString
}