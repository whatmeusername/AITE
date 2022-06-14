import React from 'react';
import type {imageNode} from './imageNode';

import {createAiteNode, AiteNode, getEditorState} from '../../index'

export default function CreateBlockResizeElements(node: imageNode) {
	let StartX = 0;
	let StartY = 0;

	let start_height = 0;
	let start_width = 0;

	let Resizing = false;
	let CurrentDragButtonClass: null | DOMTokenList = null;
	let CurrentImageNode: null | HTMLImageElement = null;
	let imageWrapperNode: null | HTMLSpanElement = null;

	const events = {
		onMouseDown: DragStart,
	};

	function stopResizing(): void {
		Resizing = false;
		CurrentDragButtonClass = null;
		document.removeEventListener('mouseup', stopResizing);
		document.removeEventListener('mousemove', SizeDrag);
		if (CurrentImageNode !== null) {
			setWrapperSize()
			let Rect = CurrentImageNode.getBoundingClientRect();
			if(Rect.width !== 0 && Rect.height !== 0) {
				node.setHeight(Rect.height);
				node.setWidth(Rect.width);
			}
			else{
				node.setHeight(parseInt(CurrentImageNode.style.height));
				node.setWidth(parseInt(CurrentImageNode.style.width));
			}
		}
		getEditorState().editorEventsActive = true
	}

	function DragStart(event: React.MouseEvent): void {
		if (Resizing === false) {
			StartX = event.clientX;
			StartY = event.clientY;
			Resizing = true;

			CurrentDragButtonClass = event.currentTarget.classList;
			CurrentImageNode = event.currentTarget.parentNode?.firstChild as HTMLImageElement;
			imageWrapperNode = event.currentTarget.parentNode as HTMLSpanElement;

			let Rect = CurrentImageNode.getBoundingClientRect();
			start_width = Rect.width;
			start_height = Rect.height;

			document.addEventListener('mouseup', stopResizing);
			document.addEventListener('mousemove', SizeDrag);
			setTimeout(() => getEditorState().editorEventsActive = false, 0)
		}
	}

	const setWrapperSize = () => {
		if(imageWrapperNode !== null && CurrentImageNode !== null ){
			imageWrapperNode.style.width = CurrentImageNode.style.width;
			imageWrapperNode.style.minHeight = CurrentImageNode.style.height;
		}
	}

	const SizeDrag = (event: MouseEvent): void => {
		if (Resizing === true) {
			if (CurrentImageNode !== null) {
				let Rect = CurrentImageNode.getBoundingClientRect();

				if (CurrentDragButtonClass !== null) {
					if (CurrentDragButtonClass.contains('image-resize-se')) {
						let ratio = Math.min(
							(start_width + (event.clientX - StartX)) / start_width,
							(start_height + (event.clientY - StartY)) / start_height,
						);
						CurrentImageNode.style.width = `${start_width * ratio}px`;
						CurrentImageNode.style.height = `${start_height * ratio}px`;
					} else if (CurrentDragButtonClass.contains('image-resize-sw')) {
						let ratio = Math.min(
							(start_width - (event.clientX - StartX)) / start_width,
							(start_height + (event.clientY - StartY)) / start_height,
						);
						CurrentImageNode.style.width = `${start_width * ratio}px`;
						CurrentImageNode.style.height = `${start_height * ratio}px`;
					} else if (CurrentDragButtonClass.contains('image-resize-ne')) {
						let ratio = Math.min(
							(start_width + (event.clientX - StartX)) / start_width,
							(start_height - (event.clientY - StartY)) / start_height,
						);
						CurrentImageNode.style.width = `${start_width * ratio}px`;
						CurrentImageNode.style.height = `${start_height * ratio}px`;
					} else if (CurrentDragButtonClass.contains('image-resize-nw')) {
						let ratio = Math.min(
							(start_width - (event.clientX - StartX)) / start_width,
							(start_height - (event.clientY - StartY)) / start_height,
						);
						CurrentImageNode.style.width = `${start_width * ratio}px`;
						CurrentImageNode.style.height = `${start_height * ratio}px`;
					} else if (CurrentDragButtonClass.contains('image-resize-e')) {
						CurrentImageNode.style.width = `${event.clientX - Rect.left}px`;
					} else if (CurrentDragButtonClass.contains('image-resize-w')) {
						CurrentImageNode.style.width = `${start_width - (event.clientX - StartX)}px`;
					} else if (CurrentDragButtonClass.contains('image-resize-s')) {
						CurrentImageNode.style.height = `${start_height + (event.clientY - StartY)}px`;
					} else if (CurrentDragButtonClass.contains('image-resize-n')) {
						CurrentImageNode.style.height = `${start_height - (event.clientY - StartY)}px`;
					}
					setWrapperSize()
				}
			}
		}
	};

	const image_resize_n = (): AiteNode => {
		const data = {className: 'image-resize image-resize-n'};
		return createAiteNode('div', {...data, ...events}, null, {isAiteWrapper: true});
	};

	const image_resize_ne = (): AiteNode => {
		const data = {className: 'image-resize image-resize-ne'};
		return createAiteNode('div', {...data, ...events}, null, {isAiteWrapper: true});
	};

	const image_resize_e = (): AiteNode => {
		const data = {className: 'image-resize image-resize-e'};
		return createAiteNode('div', {...data, ...events}, null, {isAiteWrapper: true});
	};

	const image_resize_se = (): AiteNode => {
		const data = {className: 'image-resize image-resize-se'};
		return createAiteNode('div', {...data, ...events}, null, {isAiteWrapper: true});
	};

	const image_resize_s = (): AiteNode => {
		const data = {className: 'image-resize image-resize-s'};
		return createAiteNode('div', {...data, ...events}, null, {isAiteWrapper: true});
	};

	const image_resize_sw = (): AiteNode => {
		const data = {className: 'image-resize image-resize-sw'};
		return createAiteNode('div', {...data, ...events}, null, {isAiteWrapper: true});
	};

	const image_resize_w = (): AiteNode => {
		const data = {className: 'image-resize image-resize-w'};
		return createAiteNode('div', {...data, ...events}, null, {isAiteWrapper: true});
	};

	const image_resize_nw = (): AiteNode => {
		const data = {className: 'image-resize image-resize-nw'};
		return createAiteNode('div', {...data, ...events}, null, {isAiteWrapper: true});
	};

	return [
		image_resize_n(),
		image_resize_ne(),
		image_resize_e(),
		image_resize_se(),
		image_resize_s(),
		image_resize_sw(),
		image_resize_w(),
		image_resize_nw(),
	];
}
