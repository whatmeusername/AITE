import type {commandPriority} from './EditorCommands'

type SelectionEventCommand = React.SyntheticEvent;
type KeyboardEventCommand = React.KeyboardEvent | KeyboardEvent;
type MouseEventCommand = React.MouseEvent | MouseEvent;

type EventCommands = SelectionEventCommand | KeyboardEventCommand | MouseEventCommand;

interface BaseCommand<EventType>{
	commandPriority: commandPriority;
	action: (event: EventType, ...args: any) => void;
}	

type KEYBOARD_COMMAND = BaseCommand<KeyboardEventCommand>
type SELECTION_COMMAND = BaseCommand<SelectionEventCommand>
type MOUSE_COMMAND = BaseCommand<MouseEventCommand>
type LETTER_INSERT_COMMAND = BaseCommand<KeyboardEventCommand>
type LETTER_REMOVE_COMMAND = BaseCommand<KeyboardEventCommand>
type ENTER_COMMAND = BaseCommand<KeyboardEventCommand>


export type{
    SelectionEventCommand,
    KeyboardEventCommand,
    MouseEventCommand,
    EventCommands,

    BaseCommand,
    KEYBOARD_COMMAND,
    SELECTION_COMMAND,
    MOUSE_COMMAND,
    LETTER_INSERT_COMMAND,
    LETTER_REMOVE_COMMAND,
    ENTER_COMMAND,
}