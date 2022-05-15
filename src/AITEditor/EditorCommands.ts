import {
	EDITOR_PRIORITY,
} from './ConstVariables';
import {keyCodeValidator} from './TextEditor';

type commandPriority = keyof typeof EDITOR_PRIORITY;
type commandTypes =
	| 'KEYBOARD_COMMAND'
	| 'SELECTION_COMMAND'
	| 'CLICK_COMMAND'
	| 'LETTER_INSERT_COMMAND'
	| 'LETTER_REMOVE_COMMAND'
	| 'ENTER_COMMAND';

export type SelectionCOMMAND = React.SyntheticEvent;
export type keyboardCOMMAND = React.KeyboardEvent | KeyboardEvent;
export type MouseCOMMAND = React.MouseEvent | MouseEvent;

export type EventCommands = SelectionCOMMAND | keyboardCOMMAND | MouseCOMMAND;

interface KEYBOARD_COMMAND {
	commandPriority: commandPriority;
	action: (event: keyboardCOMMAND, ...args: any) => void;
}

interface SELECTION_COMMAND {
	commandPriority: commandPriority;
	action: (event: SelectionCOMMAND, ...args: any) => void;
}

interface MOUSE_COMMAND {
	commandPriority: commandPriority;
	action: (event: MouseCOMMAND, ...args: any) => void;
}

interface KEYBIND_COMMAND { //eslint-disable-line 
	key: string;
	shiftKey?: boolean;
	ctrlKey?: boolean;
	altKey?: boolean;
	commandPriority: commandPriority;
	action: (event: keyboardCOMMAND, ...args: any) => void;
}

interface LETTER_INSERT_COMMAND {
	commandPriority: commandPriority;
	action: (event: keyboardCOMMAND, ...args: any) => void;
}

interface LETTER_REMOVE_COMMAND {
	commandPriority: commandPriority;
	action: (event: keyboardCOMMAND, ...args: any) => void;
}

interface ENTER_COMMAND {
	commandPriority: commandPriority;
	action: (event: keyboardCOMMAND, ...args: any) => void;
}

const KEYBOARD_COMMAND = {}; //eslint-disable-line 

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

const mainDecoratorStorage: decoratorStorage = {
	LETTER_INSERT_COMMAND: keyCodeValidator,
	LETTER_REMOVE_COMMAND: (event: keyboardCOMMAND) => {
		return event.code === 'Backspace';
	},
	ENTER_COMMAND: (event: keyboardCOMMAND) => {
		return event.code === 'Enter';
	},
};

export default class EditorCommands {
	EditorStateFunction: () => void;
	CommandStorage: commandStorage;
	dispatchIsBusy: boolean;
	preventUpdate: boolean;
	commandQueue: Array<string>;

	constructor(EditorStateManager: () => void) {
		this.EditorStateFunction = EditorStateManager;
		this.CommandStorage = {};
		this.dispatchIsBusy = false;
		this.preventUpdate = false;
		this.commandQueue = [];
	}

	registerCommand(
		commandType: commandTypes,
		commandPriority: commandPriority,
		action: (...args: any) => void,
	): void {
		let actionDecorator = mainDecoratorStorage[commandType];
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

		this.commandQueue.unshift(commandType);

		if (Command !== undefined && this.dispatchIsBusy === false) {
			if (Command.commandPriority === 'IMMEDIATELY_EDITOR_COMMAND') {
				Command.action(event as GetCommandEventType<typeof commandType>, ...rest);
				this.EditorStateFunction();
				this.commandQueue = [];
			} else {
				new Promise((res) => {
					this.dispatchIsBusy = true;
					Command.action(event as GetCommandEventType<typeof commandType>, ...rest);
					res('');
				}).then((res) => {
					this.dispatchIsBusy = false;
					if (
						this.commandQueue[this.commandQueue.length - 1] === Command.commandPriority
					) {
						this.commandQueue.pop();
						if (
							Command.commandPriority !== 'IGNOREMANAGER_EDITOR_COMMAND' &&
							this.preventUpdate === false
						)
							this.EditorStateFunction();
					} else {
						this.commandQueue.pop();
					}
				});
			}
		}
	}
}
