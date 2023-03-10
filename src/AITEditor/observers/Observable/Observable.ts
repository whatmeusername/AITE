import {ObserverProperties} from "./interface";
import {Observer} from "./Observer";
import {CatchFunctionReturn, isCatchFunction} from "./traps";

const NACT_OBSERVABLE = "NACT_OBSERVERABLE";

function Observe<T extends object>(observer: T): Observable<T> {
	if ((observer as any)[NACT_OBSERVABLE] instanceof Observable) {
		return (observer as any)[NACT_OBSERVABLE];
	} else if (observer instanceof Observable) {
		return observer;
	} else return new Observable(observer);
}

function isObservable(value: any): value is Observable<any> {
	return value instanceof Observable;
}

class Observable<T extends object> {
	instance: T;
	private observers: Observer<T>[];
	private eventObject: {[K in keyof ObserverProperties<T>]: Array<NonNullable<ObserverProperties<T>[K]>>};
	private ignoreFalsy: boolean;
	constructor(instance: T) {
		this.observers = [];
		this.eventObject = {};
		const observerable = this;
		this.ignoreFalsy = false;
		this.instance = new Proxy(instance, {
			apply(target: T, thisArg: any, argArray: any[]): any {
				let lastValue;
				const events = observerable.eventObject["apply"] ?? [];
				if (events.length > 0) {
					events.forEach((observer) => {
						lastValue = observer?.apply(observer, [target, thisArg, argArray]);
					});
				}
				return lastValue;
			},
			defineProperty(target: T, property: keyof T, attributes: PropertyDescriptor): boolean {
				let lastValue: any;
				const events = observerable.eventObject["defineProperty"] ?? [];
				if (events.length > 0) {
					events.forEach((observer) => {
						return (lastValue = observer?.apply(observer, [target, property, attributes, observerable]));
					});
				} else {
					Object.defineProperty(target, property, attributes);
					return true;
				}
				return lastValue;
			},
			deleteProperty(target: T, p: keyof T): boolean {
				const events = observerable.eventObject["deleteProperty"] ?? [];
				if (events.length > 0) {
					let lastValue: any;
					events.forEach((observer) => {
						lastValue = observer?.apply(observer, [target, p, observerable]);
					});
					return lastValue;
				} else {
					delete target[p];
					return true;
				}
			},
			get(target: T, p: keyof T, receiver: any): any {
				const events = observerable.eventObject["get"] ?? [];
				if (events.length > 0) {
					let lastValue: any;
					events.forEach((observer) => {
						lastValue = observer.apply(observer, [target, p, receiver, observerable]);
					});
					return lastValue;
				} else {
					return target[p];
				}
			},
			has(target: T, p: keyof T): boolean {
				const events = observerable.eventObject["has"] ?? [];
				if (events.length > 0) {
					let lastValue: any;
					events.forEach((observer) => {
						lastValue = observer.apply(observer, [target, p, observerable]);
					});
					return lastValue;
				} else {
					return Object.hasOwn(target, p);
				}
			},
			set(target: T, p: keyof T, newValue: any, receiver: any): boolean {
				const events = observerable.eventObject["set"] ?? [];
				if (events.length > 0) {
					let lastValue: boolean | undefined;

					events.forEach((observer) => {
						lastValue = observer.apply(observerable, [target, p, newValue, receiver, observerable]);
					});
					return lastValue ?? false;
				} else {
					(target as any)[p] = newValue;
					return true;
				}
			},
		} as ProxyHandler<T>);

		//@ts-ignore
		if (!this.instance[NACT_OBSERVABLE]) {
			Object.defineProperty(this.instance, NACT_OBSERVABLE, {value: this, enumerable: true, configurable: false, writable: false});
		}
	}

	value(): T {
		return this.instance;
	}

	catch(...obserableOperators: (Observer<T> | CatchFunctionReturn<T, keyof ObserverProperties<T>>)[]): Observable<T> {
		(obserableOperators ?? []).forEach((observer) => {
			if (observer instanceof Observer) {
				this.observers.push(observer);
				const keys: Array<keyof ObserverProperties<T>> = Object.keys(observer.ObserverHandler) as Array<keyof ObserverProperties<T>>;
				for (let i = 0; i < keys.length; i++) {
					if (this.eventObject[keys[i]]) {
						this.eventObject[keys[i]]?.push(observer.ObserverHandler[keys[i]] as any);
					} else {
						this.eventObject[keys[i]] = [observer.ObserverHandler[keys[i]] as any];
					}
				}
			} else if (isCatchFunction(observer)) {
				if (this.eventObject[observer.method]) {
					this.eventObject[observer.method]?.push(observer.cb);
				} else {
					(this.eventObject[observer.method] as any) = [observer.cb];
				}
			}
		});
		return this;
	}

	returnFalsy(v: boolean): Observable<T> {
		this.ignoreFalsy = v;
		return this;
	}
}

export type {Observable};
export {Observe, isObservable};
