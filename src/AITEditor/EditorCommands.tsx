
import {IMMEDIATELY_EDITOR_COMMAND, HIGH_EDITOR_COMMAND, STANDART_EDITOR_COMMAND, EDITOR_PRIORITY, IGNOREMANAGER_EDITOR_COMMAND} from './ConstVariables'
import {EditorStateManager} from './Interfaces'




type commandPriority =  keyof typeof EDITOR_PRIORITY
type commandTypes = 'KEYBOARD_COMMAND' | 'SELECTION_COMMAND' | 'CLICK_COMMAND'

type SelectionCOMMAND = React.SyntheticEvent
type keyboardCOMMAND = React.KeyboardEvent | KeyboardEvent | React.SyntheticEvent
type MouseCOMMAND = React.MouseEvent | MouseEvent | React.SyntheticEvent





interface KEYBOARD_COMMAND {
    commandPriority: commandPriority
    action: (event: keyboardCOMMAND, ...args: any) =>  void
}

interface SELECTION_COMMAND {
    commandPriority: commandPriority
    action: (event: SelectionCOMMAND, ...args: any) => void
}

interface MOUSE_COMMAND {
    commandPriority: commandPriority
    action: (event: MouseCOMMAND, ...args: any) => void
}

interface KEYBIND_COMMAND{
    key: string
    commandPriority: commandPriority
    action: (event: keyboardCOMMAND, ...args: any) => void
}

const KEYBOARD_COMMAND = {}

interface commandStorage{
    KEYBOARD_COMMAND?: KEYBOARD_COMMAND
    SELECTION_COMMAND?: SELECTION_COMMAND
    CLICK_COMMAND?: MOUSE_COMMAND
    COPY_COMMAND?: any
    PASTE_COMMAND?: any
}


type FindWithoutUndefined<O, K extends keyof O> = {[I in K]-?: O[K]}

type GetCommandEventType<C extends keyof commandStorage> = (
    FindWithoutUndefined<FindWithoutUndefined<commandStorage, C>[C], 'action'>['action'] extends 
    (...args: infer A) => any ? 
        A : 
        never
    )[0]


export default class EditorCommands{

    EditorStateFunction: () => void
    CommandStorage: commandStorage
    dispatchIsBusy: boolean
    preventUpdate: boolean
    commandQueue: Array<string>
    

    constructor(EditorStateManager: () => void){
        this.EditorStateFunction = EditorStateManager
        this.CommandStorage = {
        }
        this.dispatchIsBusy = false
        this.preventUpdate = false
        this.commandQueue = []
    }

    registerCommand(
        commandType: commandTypes, 
        commandPriority: commandPriority,
        action: (...args: any) => void
        ){

            function commandAction<C extends keyof commandStorage>(event: GetCommandEventType<C>, ...args: any): void{
                action(event, ...args)
            }
 

            this.CommandStorage[commandType] = {
                commandPriority: commandPriority,
                action: commandAction
            }
    }

    dispatchCommand(commandType: commandTypes, event: React.SyntheticEvent, ...rest: any){
        const Command = this.CommandStorage[commandType]
        
        this.commandQueue.unshift(commandType)

        if(Command !== undefined && this.dispatchIsBusy === false){
            if(Command.commandPriority === 'IMMEDIATELY_EDITOR_COMMAND'){
                Command.action(event, ...rest)
                this.EditorStateFunction()
                this.commandQueue = []
            }
            else {
                    new Promise((res) => {
                    this.dispatchIsBusy = true
                    Command.action(event, ...rest)
                    res('')
                }).then(res => {
                    this.dispatchIsBusy = false
                    if(this.commandQueue[this.commandQueue.length - 1] === Command.commandPriority){
                        this.commandQueue.pop()
                        if(Command.commandPriority !== 'IGNOREMANAGER_EDITOR_COMMAND' && this.preventUpdate === false) this.EditorStateFunction()
                    }
                    else{
                        this.commandQueue.pop()
                    }
                })
            }
        }
    }

    
}
