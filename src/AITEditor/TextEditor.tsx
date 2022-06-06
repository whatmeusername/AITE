import React, {useEffect} from 'react';

import defaultBlocks from './defaultStyles/defaultBlocks';
import type {EditorState} from './index';

import {setImageFloatDirection, toggleImageCaption} from './packages/AITE_Image/imageUtils';

import './defaultinlineStyles.scss';
import './AITE_test.scss';

import {createAITEContentNode, AiteHTMLNode, returnSingleDOMNode, createEmptyEditorState, getEditorState} from './index';

type HTMLBlockStyle = {type: string; tag: string};

function getElementBlockStyle(Tag: string): HTMLBlockStyle {
	let TagData = {type: 'unstyled', tag: 'div'};
	TagData = defaultBlocks.find((obj) => obj.tag === Tag || obj.type === Tag) ?? TagData;
	return TagData;
}

createEmptyEditorState();

function AITEditor(): JSX.Element {
	const EditorRef = React.useRef<HTMLDivElement>(null!);
	const EditorState = getEditorState();

	useEffect(() => {
		if (EditorState) {
			let EditorNodes = returnSingleDOMNode(createAITEContentNode(EditorState.contentNode)) as AiteHTMLNode[];
			EditorRef.current.replaceChildren(...EditorNodes);
			EditorState.__editorDOMState.__setDOMElement(EditorRef.current as any as AiteHTMLNode);
		}
	}, []); //eslint-disable-line

	return (
		<div className="editor__workspace">
			<div className="editor__test__toolbar">
				<p
					onMouseDown={(e) => e.preventDefault()}
					onClick={(e) => {
						e.preventDefault();
						setImageFloatDirection(getEditorState() as EditorState, 'right');
					}}
				>
					RIGHT
				</p>
				<p
					onMouseDown={(e) => e.preventDefault()}
					onClick={(e) => {
						e.preventDefault();
						setImageFloatDirection(getEditorState() as EditorState, 'left');
					}}
				>
					LEFT
				</p>
				<p
					onMouseDown={(e) => e.preventDefault()}
					onClick={(e) => {
						e.preventDefault();
						setImageFloatDirection(getEditorState() as EditorState, 'none');
					}}
				>
					DIR NULL
				</p>
				<p
					onMouseDown={(e) => e.preventDefault()}
					onClick={(e) => {
						e.preventDefault();
						toggleImageCaption(getEditorState() as EditorState);
					}}
				>
					TOGGLE CAP
				</p>
			</div>
			<div
				ref={EditorRef}
				style={{fontSize: '16px'}}
				className="AITE__editor"
				data-aite_editor_root={true}
				contentEditable={true}
				suppressContentEditableWarning={true}
				spellCheck={false}
				//onPaste={(e) => console.log(e.clipboardData.getData('text/html'))}
				onSelect={(event) => {
					EditorState?.EditorCommands?.dispatchCommand('SELECTION_COMMAND', event);
				}}
				// onClick={(event) => {
				// 	EditorState.EditorCommands?.dispatchCommand('CLICK_COMMAND', event);
				// }}
				onKeyDown={(event) => {
					EditorState?.EditorCommands?.dispatchCommand('KEYDOWN_COMMAND', event);
				}}
				onKeyUp={(event) => {
					EditorState?.EditorCommands?.dispatchCommand('KEYUP_COMMAND', event);
				}}
				onDrop={(event) => event.preventDefault()}
			></div>
		</div>
	);
}

export {AITEditor, getElementBlockStyle};

export type {HTMLBlockStyle};
