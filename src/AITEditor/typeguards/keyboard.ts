function KeyCodeValidator(event: KeyboardEvent): event is KeyboardEvent {
	const SYMBOLS = [
		"Comma",
		"Period",
		"Minus",
		"Equal",
		"IntlBackslash",
		"Slash",
		"Quote",
		"Semicolon",
		"Backslash",
		"BracketRight",
		"BracketLeft",
		"Backquote",
	];

	return event.code.startsWith("Key") || event.code === "Space" || event.code.startsWith("Digit") || SYMBOLS.includes(event.code);
}

function isArrow(event: KeyboardEvent): event is KeyboardEvent {
	return event.code === "ArrowLeft" || event.code === "ArrowRight" || event.code === "ArrowUp" || event.code === "ArrowDown";
}

function isArrowLeft(event: KeyboardEvent): event is KeyboardEvent {
	return event.code === "ArrowLeft";
}

function isArrowRight(event: KeyboardEvent): event is KeyboardEvent {
	return event.code === "ArrowRight";
}

function isArrowUp(event: KeyboardEvent): event is KeyboardEvent {
	return event.code === "ArrowUp";
}

function isArrowDown(event: KeyboardEvent): event is KeyboardEvent {
	return event.code === "ArrowDown";
}

function EditorWarning(shoudThrow: boolean, message: string): void {
	if (shoudThrow) {
		console.warn(`AITE internal warning: ${message}`);
	}
}

function isDefined(obj: any): boolean {
	return obj !== undefined && obj !== null;
}

function isApple(): boolean {
	return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
}

function isMeta(event: KeyboardEvent): event is KeyboardEvent {
	if (isApple()) {
		return event.metaKey;
	}
	return false;
}

function isAlt(event: KeyboardEvent): event is KeyboardEvent {
	return event.altKey;
}

function isCtrl(event: KeyboardEvent): event is KeyboardEvent {
	return event.ctrlKey;
}

function isForwardBackspace(event: KeyboardEvent): event is KeyboardEvent {
	return (event.code === "Delete" || event.code === "Backspace") && event.which === 46;
}

function isBackwardRemoveLine(event: KeyboardEvent): event is KeyboardEvent {
	if (isApple()) {
		return (event.code === "Delete" || event.code === "Backspace") && isMeta(event);
	} else return false;
}

function isForwardRemoveLine(event: KeyboardEvent): event is KeyboardEvent {
	if (isApple()) {
		return (event.code === "Delete" || event.code === "Backspace") && event.which === 46 && isMeta(event);
	} else return false;
}

function isBackwardRemoveWord(event: KeyboardEvent): event is KeyboardEvent {
	if (isApple()) {
		return event.code === "Backspace" && isAlt(event);
	} else return event.code === "Backspace" && isCtrl(event);
}

function isForwardRemoveWord(event: KeyboardEvent): event is KeyboardEvent {
	if (isApple()) {
		return (event.code === "Delete" || event.code === "Backspace") && isAlt(event) && event.which === 46;
	} else return (event.code === "Delete" || event.code === "Backspace") && isCtrl(event) && event.which === 46;
}

export {
	KeyCodeValidator,
	EditorWarning,
	isApple,
	isBackwardRemoveLine,
	isBackwardRemoveWord,
	isForwardBackspace,
	isForwardRemoveWord,
	isForwardRemoveLine,
	isArrow,
	isArrowLeft,
	isArrowRight,
	isArrowUp,
	isArrowDown,
	isDefined,
};
