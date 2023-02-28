import {ClassAttribute, StringNumberBool} from "./interface";
import {isEventProp, isNotEmpty} from "./utils";

function addEventListeners<T extends HTMLElement>(target: T, type: string, listener: (...args: any[]) => void): T {
	if (isEventProp(type)) {
		target.addEventListener(type.slice(2).toLowerCase(), listener);
	}
	return target;
}

function setStyles<T extends HTMLElement>(target: T, styleObject: CSSStyleDeclaration): T {
	Object.entries(styleObject).forEach(([key, value]): void => {
		target.style[key as any] = value;
	});
	return target;
}

function setProps<T extends HTMLElement>(target: T, props: {[K: string]: any}): T {
	Object.entries(props).forEach(([key, value]) => {
		if (isEventProp(key)) addEventListeners(target, key, value);
		else setAttribute(target, key, value);
	});
	return target;
}

function setAttribute<T extends HTMLElement>(target: T, attrName: string, value: StringNumberBool | CSSStyleDeclaration): T {
	if (attrName === "style" && typeof value === "object") {
		setStyles(target, value);
	} else if ((attrName === ClassAttribute.className || attrName === ClassAttribute.class) && isNotEmpty(value)) {
		target.setAttribute("class", value.toString());
	} else if (isNotEmpty(value)) {
		target.setAttribute(attrName, value.toString());
	}
	return target;
}

function removeAttribute<T extends HTMLElement>(target: T, attrName: string, value: StringNumberBool | CSSStyleDeclaration): T {
	if (attrName === "className" && isNotEmpty(value)) {
		target.removeAttribute("class");
	} else if (isNotEmpty(value as StringNumberBool)) {
		target.removeAttribute(attrName);
	}
	return target;
}

export {addEventListeners, setStyles, setProps, setAttribute, removeAttribute};