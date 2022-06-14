import type {commandPriority} from './EditorCommands'

type SelectionEventCommand = React.SyntheticEvent;
type KeyboardEventCommand = React.KeyboardEvent | KeyboardEvent;
type MouseEventCommand = React.MouseEvent | MouseEvent;
type DragEventCommand = DragEvent

type EventCommands = SelectionEventCommand | KeyboardEventCommand | MouseEventCommand;

interface BaseCommand<EventType>{
	commandPriority: commandPriority;
	action: (event: EventType, ...args: any) => void;
}	

// DEPRECATED
type KEYBOARD_COMMAND = BaseCommand<KeyboardEventCommand>

type KEYDOWN_COMMAND = BaseCommand<KeyboardEventCommand>
type KEYUP_COMMAND = BaseCommand<KeyboardEventCommand>

type SELECTION_COMMAND = BaseCommand<SelectionEventCommand>
type MOUSE_COMMAND = BaseCommand<MouseEventCommand>
type LETTER_INSERT_COMMAND = BaseCommand<KeyboardEventCommand>
type ENTER_COMMAND = BaseCommand<KeyboardEventCommand>

type LETTER_REMOVE_COMMAND = BaseCommand<KeyboardEventCommand>
type WORD_REMOVE_COMMAND = BaseCommand<KeyboardEventCommand>
type LINE_REMOVE_COMMAND = BaseCommand<KeyboardEventCommand>

type FORWARD_LETTER_REMOVE_COMMAND = BaseCommand<KeyboardEventCommand>
type FORWARD_WORD_REMOVE_COMMAND = BaseCommand<KeyboardEventCommand>
type FORWARD_LINE_REMOVE_COMMAND = BaseCommand<KeyboardEventCommand>

type FOCUS_COMMAND = BaseCommand<MouseEventCommand>
type BLUR_COMMAND = BaseCommand<MouseEventCommand>

type DRAGSTART_COMMAND = BaseCommand<DragEventCommand>
type DRAG_COMMAND = BaseCommand<DragEventCommand>
type DRAGEND_COMMAND = BaseCommand<DragEventCommand>


export type{
    SelectionEventCommand,
    KeyboardEventCommand,
    MouseEventCommand,
    EventCommands,

    BaseCommand,

    FOCUS_COMMAND,
    BLUR_COMMAND,

    DRAGSTART_COMMAND,
    DRAG_COMMAND,
    DRAGEND_COMMAND,

    LETTER_REMOVE_COMMAND,
    WORD_REMOVE_COMMAND,
    LINE_REMOVE_COMMAND,
    FORWARD_LETTER_REMOVE_COMMAND,
    FORWARD_WORD_REMOVE_COMMAND,
    FORWARD_LINE_REMOVE_COMMAND,

    KEYDOWN_COMMAND,
    KEYUP_COMMAND,
    
    KEYBOARD_COMMAND,
    SELECTION_COMMAND,
    MOUSE_COMMAND,
    LETTER_INSERT_COMMAND,
    ENTER_COMMAND,
}