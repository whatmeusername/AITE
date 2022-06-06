import React, {useState, useEffect} from 'react';

import defaultBlocks from './defaultStyles/defaultBlocks';

import {createEmptyEditorState, updateActiveEditor} from './EditorState';
import type {EditorState as editorState} from './EditorState';
import {getMutatedSelection} from './SelectionUtils';

import EditorCommands from './EditorCommands';

import activeElementState from './packages/AITE_ActiveState/activeElementState';
import {setImageFloatDirection, toggleImageCaption} from './packages/AITE_Image/imageUtils';
import {onKeyDownEvent, onKeyUpEvent} from './EditorEvents';

import './defaultinlineStyles.scss';
import './AITE_test.scss';

import {createAITEContentNode, AiteHTMLNode, returnSingleDOMNode} from './AITEreconciliation';

export type CharData = [string, Array<string>, Array<number>];

export type HTMLBlockStyle = {type: string; tag: string};
export type HTMLCharStyle = {style: string; tag: string};

export function getElementBlockStyle(Tag: string): HTMLBlockStyle {
	let TagData = {type: 'unstyled', tag: 'div'};
	TagData = defaultBlocks.find((obj) => obj.tag === Tag || obj.type === Tag) ?? TagData;
	return TagData;
}

export function keyCodeValidator(event: KeyboardEvent | React.KeyboardEvent): boolean {
	const SYMBOLS = [
		'Comma',
		'Period',
		'Minus',
		'Equal',
		'IntlBackslash',
		'Slash',
		'Quote',
		'Semicolon',
		'Backslash',
		'BracketRight',
		'BracketLeft',
		'Backquote',
	];

	if (event.code.startsWith('Key') || event.code === 'Space' || event.code.startsWith('Digit') || SYMBOLS.includes(event.code)) return true;
	return false;
}

export default function AITEditor(): JSX.Element {
	const EditorRef = React.useRef<HTMLDivElement>(null!);

	const [EditorState, setEditorState] = useState<editorState>(createEmptyEditorState());

	useEffect(() => {
		if (EditorState.EditorCommands === undefined) {
			let EditorNodes = returnSingleDOMNode(createAITEContentNode(EditorState.contentNode)) as AiteHTMLNode[];
			EditorRef.current.replaceChildren(...EditorNodes);
			EditorState.__editorDOMState.__setDOMElement(EditorRef.current as any as AiteHTMLNode);

			EditorState.EditorActiveElementState = new activeElementState(() => setEditorState({...(EditorState as any)}), EditorState);

			EditorState.EditorCommands = new EditorCommands(() => setEditorState({...(EditorState as any)}));

			EditorState.EditorCommands.registerCommand('KEYDOWN_COMMAND', 'IGNOREMANAGER_EDITOR_COMMAND', (event) => {
				onKeyDownEvent(event);
			});

			EditorState.EditorCommands.registerCommand('KEYUP_COMMAND', 'IGNOREMANAGER_EDITOR_COMMAND', (event) => {
				onKeyUpEvent(event);
			});

			EditorState.EditorCommands.registerCommand('LETTER_INSERT_COMMAND', 'IMMEDIATELY_EDITOR_COMMAND', (event) => {
				EditorState.contentNode.insertLetterIntoTextNode(event, EditorState.selectionState);
				updateActiveEditor(EditorState);
			});

			EditorState.EditorCommands.registerCommand('LETTER_REMOVE_COMMAND', 'IMMEDIATELY_EDITOR_COMMAND', (_) => {
				EditorState.contentNode.removeLetterFromBlock(EditorState.selectionState);
			});

			EditorState.EditorCommands.registerCommand('FORWARD_LETTER_REMOVE_COMMAND', 'IMMEDIATELY_EDITOR_COMMAND', (_) => {
				getMutatedSelection('extend', 'character', 'forward');
				EditorState.selectionState.getCaretPosition();
				EditorState.contentNode.removeLetterFromBlock(EditorState.selectionState);
				EditorState.replaceActiveSelectionWithPrevious();
			});

			EditorState.EditorCommands.registerCommand('ENTER_COMMAND', 'IMMEDIATELY_EDITOR_COMMAND', (_) => {
				EditorState.contentNode.handleEnter(EditorState.selectionState);
			});

			EditorState.EditorCommands.registerCommand('WORD_REMOVE_COMMAND', 'IMMEDIATELY_EDITOR_COMMAND', (_) => {
				getMutatedSelection('extend', 'word', 'backward');
				EditorState.selectionState.getCaretPosition();
				EditorState.contentNode.removeLetterFromBlock(EditorState.selectionState);
				if (EditorState.selectionState.isOffsetOnStart() === false) {
					EditorState.selectionState.moveSelectionForward();
				}
			});

			EditorState.EditorCommands.registerCommand('FORWARD_WORD_REMOVE_COMMAND', 'IMMEDIATELY_EDITOR_COMMAND', (_) => {
				getMutatedSelection('extend', 'word', 'forward');
				EditorState.selectionState.getCaretPosition();
				EditorState.contentNode.removeLetterFromBlock(EditorState.selectionState);
				EditorState.replaceActiveSelectionWithPrevious();
			});

			EditorState.EditorCommands.registerCommand('FORWARD_LINE_REMOVE_COMMAND', 'IMMEDIATELY_EDITOR_COMMAND', (_) => {
				getMutatedSelection('extend', 'lineboundary', 'forward');
				EditorState.selectionState.getCaretPosition();
				EditorState.contentNode.removeLetterFromBlock(EditorState.selectionState);
				EditorState.replaceActiveSelectionWithPrevious();
			});

			EditorState.EditorCommands.registerCommand('LINE_REMOVE_COMMAND', 'IMMEDIATELY_EDITOR_COMMAND', (_) => {
				getMutatedSelection('extend', 'lineboundary', 'backward');
				EditorState.selectionState.getCaretPosition();
				EditorState.contentNode.removeLetterFromBlock(EditorState.selectionState);
				if (EditorState.selectionState.isOffsetOnStart() === false) {
					EditorState.selectionState.moveSelectionForward();
				}
			});

			EditorState.EditorCommands.registerCommand('SELECTION_COMMAND', 'IGNOREMANAGER_EDITOR_COMMAND', (_) => {
				EditorState.selectionState.getCaretPosition();
				updateActiveEditor(EditorState);
			});

			EditorState.EditorCommands.registerCommand('CLICK_COMMAND', 'IMMEDIATELY_EDITOR_COMMAND', (event) =>
				EditorState.EditorActiveElementState?.handleElementClick(event),
			);

			updateActiveEditor(EditorState);
			setEditorState({...(EditorState as any)});
		}
	}, [EditorState]); //eslint-disable-line

	return (
		<div className="editor__workspace">
			<div className="editor__test__toolbar">
				<p
					onMouseDown={(e) => e.preventDefault()}
					onClick={(e) => {
						e.preventDefault();
						setImageFloatDirection(EditorState, 'right');
						setEditorState({...(EditorState as any)});
					}}
				>
					RIGHT
				</p>
				<p
					onMouseDown={(e) => e.preventDefault()}
					onClick={(e) => {
						e.preventDefault();
						setImageFloatDirection(EditorState, 'left');
						setEditorState({...(EditorState as any)});
					}}
				>
					LEFT
				</p>
				<p
					onMouseDown={(e) => e.preventDefault()}
					onClick={(e) => {
						e.preventDefault();
						setImageFloatDirection(EditorState, 'none');
						setEditorState({...(EditorState as any)});
					}}
				>
					DIR NULL
				</p>
				<p
					onMouseDown={(e) => e.preventDefault()}
					onClick={(e) => {
						e.preventDefault();
						toggleImageCaption(EditorState);
						setEditorState({...(EditorState as any)});
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
					EditorState.EditorCommands?.dispatchCommand('SELECTION_COMMAND', event);
				}}
				// onClick={(event) => {
				// 	EditorState.EditorCommands?.dispatchCommand('CLICK_COMMAND', event);
				// }}
				onKeyDown={(event) => {
					EditorState.EditorCommands?.dispatchCommand('KEYDOWN_COMMAND', event);
				}}
				onKeyUp={(event) => {
					EditorState.EditorCommands?.dispatchCommand('KEYUP_COMMAND', event);
				}}
				onDrop={(event) => event.preventDefault()}
			></div>
		</div>
	);
}
