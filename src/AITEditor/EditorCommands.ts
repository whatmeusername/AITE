import {EDITOR_PRIORITY} from './ConstVariables';
import {editorWarning, keyCodeValidator} from './EditorUtils';
import {getEditorState} from './index';

import type {
	KeyboardEventCommand,
	EventCommands,
	KEYBOARD_COMMAND,
	SELECTION_COMMAND,
	MOUSE_COMMAND,
	LETTER_INSERT_COMMAND,
	ENTER_COMMAND,
	LETTER_REMOVE_COMMAND,
	WORD_REMOVE_COMMAND,
	LINE_REMOVE_COMMAND,
	FORWARD_LETTER_REMOVE_COMMAND,
	FORWARD_WORD_REMOVE_COMMAND,
	FORWARD_LINE_REMOVE_COMMAND,
	KEYDOWN_COMMAND,
	KEYUP_COMMAND,
	DRAGSTART_COMMAND,
	DRAG_COMMAND,
	DRAGEND_COMMAND,
} from './editorCommandsTypes';

type commandPriority = keyof typeof EDITOR_PRIORITY;

type commandTypes =
	| 'KEYBOARD_COMMAND'
	| 'SELECTION_COMMAND'
	| 'CLICK_COMMAND'
	| 'LETTER_INSERT_COMMAND'
	| 'LETTER_REMOVE_COMMAND'
	| 'ENTER_COMMAND'
	| 'WORD_REMOVE_COMMAND'
	| 'LINE_REMOVE_COMMAND'
	| 'FORWARD_LETTER_REMOVE_COMMAND'
	| 'FORWARD_WORD_REMOVE_COMMAND'
	| 'FORWARD_LINE_REMOVE_COMMAND'
	| 'KEYDOWN_COMMAND'
	| 'KEYUP_COMMAND'
	| 'DRAGSTART_COMMAND'
	| 'DRAGEND_COMMAND';

interface KEYBIND_COMMAND {
	//eslint-disable-line
	key: string;
	shiftKey?: boolean;
	ctrlKey?: boolean;
	altKey?: boolean;
	commandPriority: commandPriority;
	action: (event: KeyboardEventCommand, ...args: any) => void;
}

interface rootCommandStorage {
	SELECTION_COMMAND?: SELECTION_COMMAND;

	// COPY_COMMAND?: any
	// PASTE_COMMAND?: any

	FOCUS_COMMAND?: MOUSE_COMMAND;
	BLUR_COMMAND?: MOUSE_COMMAND;

	DRAGSTART_COMANND?: any;
	// DRAG_OVER_COMMAND?: any
	// DRAG_END_COMMAND?: any
	// DROP_COMMAND?: any
}

interface commandStorage {
	DRAGSTART_COMMAND?: DRAGSTART_COMMAND;
	DRAGEND_COMMAND?: DRAGEND_COMMAND;

	KEYBOARD_COMMAND?: KEYBOARD_COMMAND;

	KEYDOWN_COMMAND?: KEYDOWN_COMMAND;
	KEYUP_COMMAND?: KEYUP_COMMAND;

	SELECTION_COMMAND?: SELECTION_COMMAND;

	CLICK_COMMAND?: MOUSE_COMMAND;

	ENTER_COMMAND?: ENTER_COMMAND;

	LETTER_INSERT_COMMAND?: LETTER_INSERT_COMMAND;
	LETTER_REMOVE_COMMAND?: LETTER_REMOVE_COMMAND;
	WORD_REMOVE_COMMAND?: WORD_REMOVE_COMMAND;
	LINE_REMOVE_COMMAND?: LINE_REMOVE_COMMAND;
	FORWARD_LETTER_REMOVE_COMMAND?: FORWARD_LETTER_REMOVE_COMMAND;
	FORWARD_WORD_REMOVE_COMMAND?: FORWARD_WORD_REMOVE_COMMAND;
	FORWARD_LINE_REMOVE_COMMAND?: FORWARD_LINE_REMOVE_COMMAND;
}

type FindWithoutUndefined<O, K extends keyof O> = {[I in K]-?: O[K]};
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type GetCommandEventType<C extends keyof commandStorage> = ('action' extends keyof FindWithoutUndefined<commandStorage, C>[C]
	? FindWithoutUndefined<FindWithoutUndefined<commandStorage, C>[C], 'action'>['action'] extends (...args: infer A) => any
		? A
		: never
	: never)[0];

type GetCommandActionType<S extends keyof commandStorage> = 'action' extends keyof FindWithoutUndefined<commandStorage, S>[S]
	? FindWithoutUndefined<FindWithoutUndefined<commandStorage, S>[S], 'action'>['action']
	: never;

type ActionType = UnionToIntersection<GetCommandActionType<keyof commandStorage>>;

type decoratorStorage<S> = {[K in keyof S]+?: Function};

const rootDecoratorStorage: decoratorStorage<rootCommandStorage> = {
	// FOCUS_COMMAND: onFocusDecorator,
	// BLUR_COMMAND: onBlurDecorator
};

const DecoratorStorage: decoratorStorage<commandStorage> = {
	LETTER_INSERT_COMMAND: keyCodeValidator,
	LETTER_REMOVE_COMMAND: (event: KeyboardEventCommand) => {
		return event.code === 'Backspace';
	},
	ENTER_COMMAND: (event: KeyboardEventCommand) => {
		return event.code === 'Enter';
	},
};

class EditorCommands {
	commandStorage: commandStorage;
	removeHandles: {[K: string]: (...args: any) => void};
	rootCommands: rootCommandStorage;
	currentEventPriority: null | number;

	constructor() {
		this.commandStorage = {};
		this.rootCommands = {
			SELECTION_COMMAND: undefined,
			FOCUS_COMMAND: undefined,
			BLUR_COMMAND: undefined,
		};
		this.removeHandles = {};
		this.currentEventPriority = null;
	}

	listenRootEvent(): void {
		if (this.removeHandles.SELECTION_COMMAND === undefined) {
			let SelectionEvent = (event: any) => getEditorState().selectionState.getCaretPosition();
			document.addEventListener('selectionchange', SelectionEvent);
			this.removeHandles['selectionchange'] = () => document.removeEventListener('selectionchange', SelectionEvent);
		}

		let EditorDOM = getEditorState().__editorDOMState.getRootHTMLNode();
		Object.entries(this.rootCommands).map(([eventname, event]) => {
			if (event !== undefined) {
				let eventData = {eventname: undefined, event: undefined} as {eventname: undefined | string; event: undefined | ((...args: any) => void)};
				eventData = (() => {
					switch (eventname) {
						case 'COPY_COMMAND':
							return {eventname: 'copy', event: event};
						case 'PASTE_COMMAND':
							return {eventname: 'paste', event: event};
						case 'DRAGSTART_COMANND':
							return {eventname: 'dragstart', event: event};
						case 'DRAGEND_COMANND':
							return {eventname: 'dragend', event: event};
						case 'DRAGOVER_COMMAND':
							return {eventname: 'dragover', event: event};
						case 'DRAG_COMANND':
							return {eventname: 'drag', event: event};
						default:
							return {eventname: undefined, event: undefined};
					}
				})();
				if (eventData.eventname && eventData.event) {
					EditorDOM.addEventListener(eventData.eventname, eventData.event);
					this.removeHandles[eventData.eventname] = () => EditorDOM.removeEventListener(eventData.eventname!, eventData.event!);
				}
			}
		});
	}

	registerCommand(commandType: commandTypes, commandPriority: commandPriority, action: (...args: any) => void, reassign: boolean = false): void {
		let actionDecorator = DecoratorStorage[commandType];
		let commandAction;
		if (this.commandStorage[commandType] === undefined || reassign === true) {
			if (actionDecorator !== undefined) {
				commandAction = function <C extends typeof commandType>(event: GetCommandEventType<C>, ...args: any): void {
					if ((actionDecorator as Function)(event) === true) {
						action(event, ...args);
					}
				};
			} else {
				commandAction = function <C extends typeof commandType>(event: GetCommandEventType<C>, ...args: any): void {
					action(event, ...args);
				};
			}

			this.commandStorage[commandType] = {
				commandPriority: commandPriority,
				action: commandAction as ActionType,
			};
		} else editorWarning(true, `tried to reassign ${commandType} command. If you are sure to apply changes to command, then pass 'reassign' as true.`);
	}

	dispatchCommand(commandType: commandTypes, event: EventCommands, ...rest: any) {
		const Command = this.commandStorage[commandType];
		if (!Command) return;

		let EventPriority = EDITOR_PRIORITY[Command.commandPriority];

		if (Command !== undefined) {
			let editorState = getEditorState();
			if (
				(this.currentEventPriority === null || EventPriority <= this.currentEventPriority) &&
				editorState !== undefined &&
				editorState.editorEventsActive === true
			) {
				let passCaretSet = Command.commandPriority === 'HIGH_IGNORECARET_COMMAND' || Command.commandPriority === 'LOW_IGNORECARET_COMMAND';
				this.currentEventPriority = EventPriority;

				if (passCaretSet === false) {
					editorState?.setPreviousSelection();
				}

				Command.action(event as GetCommandEventType<typeof commandType>, ...rest);

				if (passCaretSet === false) {
					if (editorState !== undefined) {
						editorState.selectionState.setCaretPosition();
					}
				}
				this.currentEventPriority = null;
			} else event.preventDefault();
		}
	}
}

export {EditorCommands};

export type {commandPriority};
