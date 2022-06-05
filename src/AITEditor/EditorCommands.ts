import {
	EDITOR_PRIORITY,
} from './ConstVariables';
import {keyCodeValidator} from './TextEditor';

import type{
    KeyboardEventCommand,
    EventCommands,

    KEYBOARD_COMMAND,
    SELECTION_COMMAND,
    MOUSE_COMMAND,
    LETTER_INSERT_COMMAND,
    LETTER_REMOVE_COMMAND,
    ENTER_COMMAND,
} from './editorCommandsTypes'

import {getEditorState} from './EditorState'

export type commandPriority = keyof typeof EDITOR_PRIORITY;
type commandTypes =
	| 'KEYBOARD_COMMAND'
	| 'SELECTION_COMMAND'
	| 'CLICK_COMMAND'
	| 'LETTER_INSERT_COMMAND'
	| 'LETTER_REMOVE_COMMAND'
	| 'ENTER_COMMAND';



interface KEYBIND_COMMAND { //eslint-disable-line 
	key: string;
	shiftKey?: boolean;
	ctrlKey?: boolean;
	altKey?: boolean;
	commandPriority: commandPriority;
	action: (event: KeyboardEventCommand, ...args: any) => void;
}


interface commandStorage {
	KEYBOARD_COMMAND?: KEYBOARD_COMMAND;
	SELECTION_COMMAND?: SELECTION_COMMAND;

	CLICK_COMMAND?: MOUSE_COMMAND;

	ENTER_COMMAND?: ENTER_COMMAND;
	// BACKSPACE_COMMAND?: any
	LETTER_INSERT_COMMAND?: LETTER_INSERT_COMMAND;
	LETTER_REMOVE_COMMAND?: LETTER_REMOVE_COMMAND;

	// DRAG_START_COMANND?: any
	// DRAG_OVER_COMMAND?: any
	// DRAG_END_COMMAND?: any
	// DROP_COMMAND?: any

	// COPY_COMMAND?: any
	// PASTE_COMMAND?: any
}

type FindWithoutUndefined<O, K extends keyof O> = {[I in K]-?: O[K]};
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
	? I
	: never;

type GetCommandEventType<C extends keyof commandStorage> =
	('action' extends keyof FindWithoutUndefined<commandStorage, C>[C]
		? FindWithoutUndefined<
				FindWithoutUndefined<commandStorage, C>[C],
				'action'
		  >['action'] extends (...args: infer A) => any
			? A
			: never
		: never)[0];

type GetCommandActionType<S extends keyof commandStorage> =
	'action' extends keyof FindWithoutUndefined<commandStorage, S>[S]
		? FindWithoutUndefined<FindWithoutUndefined<commandStorage, S>[S], 'action'>['action']
		: never;

type ActionType = UnionToIntersection<GetCommandActionType<keyof commandStorage>>;

type decoratorStorage = {[K in keyof commandStorage]+?: Function};

const DecoratorStorage: decoratorStorage = {
	LETTER_INSERT_COMMAND: keyCodeValidator,
	LETTER_REMOVE_COMMAND: (event: KeyboardEventCommand) => {
		return event.code === 'Backspace';
	},
	ENTER_COMMAND: (event: KeyboardEventCommand) => {
		return event.code === 'Enter';
	},
};

export default class EditorCommands {
	EditorStateFunction: () => void;
	CommandStorage: commandStorage;

	constructor(EditorStateManager: () => void) {
		this.EditorStateFunction = EditorStateManager;
		this.CommandStorage = {};
	}

	registerCommand(
		commandType: commandTypes,
		commandPriority: commandPriority,
		action: (...args: any) => void,
	): void {
		let actionDecorator = DecoratorStorage[commandType];
		let commandAction;

		if (actionDecorator !== undefined) {
			commandAction = function <C extends typeof commandType>(
				event: GetCommandEventType<C>,
				...args: any
			): void {
				if ((actionDecorator as Function)(event) === true) {
					action(event, ...args);
				}
			};
		} else {
			commandAction = function <C extends typeof commandType>(
				event: GetCommandEventType<C>,
				...args: any
			): void {
				action(event, ...args);
			};
		}

		this.CommandStorage[commandType] = {
			commandPriority: commandPriority,
			action: commandAction as ActionType,
		};
	}

	dispatchCommand(commandType: commandTypes, event: EventCommands, ...rest: any): void {
		const Command = this.CommandStorage[commandType];

		if (Command !== undefined) {
			if (Command.commandPriority === 'IMMEDIATELY_EDITOR_COMMAND') {
				Command.action(event as GetCommandEventType<typeof commandType>, ...rest);
				let editorState = getEditorState()
				if(editorState !== undefined) {
					//editorState.__editorDOMState.__reconciliation();
					editorState.selectionState.setCaretPosition();
				}
			} else {
				new Promise((res) => {
					Command.action(event as GetCommandEventType<typeof commandType>, ...rest);
					res('');
				}).then((res) => {
					if (Command.commandPriority !== 'IGNOREMANAGER_EDITOR_COMMAND'){
						let editorState = getEditorState()
						if(editorState !== undefined) {
							//editorState.__editorDOMState.__reconciliation();
							editorState.selectionState.setCaretPosition();
						}
					}
				});
			}
		}
	}
}
