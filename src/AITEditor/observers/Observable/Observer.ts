import {ObserverProperties, ObserverPropertiesParameters} from "./interface";

class Observer<T extends object> {
	ObserverHandler: ObserverProperties<T>;
	constructor(ObserverHandler: ObserverProperties<T>) {
		this.ObserverHandler = ObserverHandler;
	}

	has<U extends keyof ObserverProperties<T>>(event: U): boolean {
		return this.ObserverHandler[event] !== undefined;
	}

	dispatch<U extends keyof ObserverProperties<T>>(event: U, args: ObserverPropertiesParameters<T, U>): any {
		if (this.ObserverHandler[event] !== undefined) {
			return (this.ObserverHandler[event] as any)?.apply(this, args);
		}
	}
}

function Handle<T extends object>(ObserverHandler: ObserverProperties<T>) {
	return new Observer(ObserverHandler);
}

export {Observer, Handle};
