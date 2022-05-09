import React from 'react'
import type {ImageGifNode} from './CharNode'

export default function CreateBlockResizeElements(node: ImageGifNode){

    let StartX = 0
    let StartY = 0

    let start_height = 0
    let start_width = 0

    let Resizing = false
    let CurrentDragButtonClass: null | DOMTokenList = null
    let CurrentImageNode: null | HTMLImageElement = null
    const events = {
        onMouseDown: DragStart,
    }

    function stopResizing(){
        Resizing = false
        CurrentDragButtonClass = null
        document.removeEventListener('mouseup', stopResizing)
        document.removeEventListener('mousemove', SizeDrag)
        document.removeEventListener('onselect', (e) => e.preventDefault())
        if(CurrentImageNode !== null){
            let Rect = CurrentImageNode.getBoundingClientRect()
            node.setHeight(Rect.height)
            node.setWidth(Rect.width)
        }
    }

    function DragStart(event: React.MouseEvent){
        if(Resizing === false) {

            StartX = event.clientX
            StartY = event.clientY
            Resizing = true

            CurrentDragButtonClass = event.currentTarget.classList
            CurrentImageNode = event.currentTarget.parentNode?.firstChild as HTMLImageElement

            let Rect = CurrentImageNode.getBoundingClientRect()
            start_width =  Rect.width
            start_height = Rect.height

            document.addEventListener('mouseup', stopResizing)
            document.addEventListener('mousemove', SizeDrag)
            document.addEventListener('onselect', (e) => e.preventDefault())
        }
    }



    const SizeDrag = (event: MouseEvent) => {
        if(Resizing === true){

            if(CurrentImageNode !== null){
                let Rect = CurrentImageNode.getBoundingClientRect()

                if(CurrentDragButtonClass !== null){
                    if(CurrentDragButtonClass.contains('image-resize-se')){
                        let ratio = Math.min((start_width + (event.pageX - StartX)) / start_width, (start_height + (event.pageY - StartY)) / start_height)
                        CurrentImageNode.style.width = `${start_width * ratio}px`
                        CurrentImageNode.style.height = `${start_height * ratio}px`
                    }
                    else if(CurrentDragButtonClass.contains('image-resize-sw')){
                        let ratio = Math.min((start_width + (event.pageX - StartX)) / start_width, (start_height + (event.pageY - StartY)) / start_height)
                        CurrentImageNode.style.width = `${start_width * ratio}px`
                        CurrentImageNode.style.height = `${start_height * ratio}px`
                    }

                    else if(CurrentDragButtonClass.contains('image-resize-ne')){
                        let ratio = Math.min((start_width + (event.pageX - StartX)) / start_width, (start_height - (event.pageY - StartY)) / start_height)
                        CurrentImageNode.style.width = `${start_width * ratio}px`
                        CurrentImageNode.style.height = `${start_height * ratio}px`
                    }
                    else if(CurrentDragButtonClass.contains('image-resize-nw')){
                        let ratio = Math.min((start_width + (event.pageX - StartX)) / start_width, (start_height - (event.pageY - StartY)) / start_height)
                        CurrentImageNode.style.width = `${start_width * ratio}px`
                        CurrentImageNode.style.height = `${start_height * ratio}px`
                    }
        
                    else if(CurrentDragButtonClass.contains('image-resize-e')){
                        CurrentImageNode.style.width = `${event.pageX - Rect.left}px`
                    }
                    else if(CurrentDragButtonClass.contains('image-resize-w')){
                        CurrentImageNode.style.width = `${start_width - (event.pageX - StartX)}px`
                    }

                    else if(CurrentDragButtonClass.contains('image-resize-s')){
                        CurrentImageNode.style.height = `${start_height + (event.pageY -  StartY)}px`
                    }
                    else if(CurrentDragButtonClass.contains('image-resize-n')){
                        CurrentImageNode.style.height = `${start_height - (event.pageY -  StartY)}px`
                    }
                    
                }

                // StartX = event.clientX
                // StartY = event.clientY
            }
        }

    }


    const image_resize_n = () => {
        const data = {className: 'image-resize image-resize-n'}
        return(React.createElement('div', {...data, ...events}, null))
    }

    const image_resize_ne = () => {
        const data = {className: 'image-resize image-resize-ne'}
        return(React.createElement('div', {...data, ...events}, null))
    }

    const image_resize_e = () => {
        const data = {className: 'image-resize image-resize-e'}
        return(React.createElement('div', {...data, ...events}, null))
    }

    const image_resize_se = () => {
        const data = {className: 'image-resize image-resize-se'}
        return(React.createElement('div', {...data, ...events}, null))
    }

    const image_resize_s = () => {
        const data = {className: 'image-resize image-resize-s'}
        return(React.createElement('div', {...data, ...events}, null))
    }

    const image_resize_sw = () => {
        const data = {className: 'image-resize image-resize-sw'}
        return(React.createElement('div', {...data, ...events}, null))
    }

    const image_resize_w = () => {
        const data = {className: 'image-resize image-resize-w'}
        return(React.createElement('div', {...data, ...events}, null))
    }

    const image_resize_nw = () => {
        const data = {className: 'image-resize image-resize-nw'}
        return(React.createElement('div', {...data, ...events}, null))
    }

    return [image_resize_n(), image_resize_ne(), image_resize_e(), image_resize_se(), image_resize_s(), image_resize_sw(), image_resize_w(), image_resize_nw()]
}
