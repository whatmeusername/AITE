import type {ObserverProperties, ObserverPropertiesParameters, ObserverReturnType} from "./interface";

type CatchFunctionCallback<T extends object, U extends keyof ObserverProperties<T>> = (...args: ObserverPropertiesParameters<T, U>) => ObserverReturnType<T, U>;

interface CatchFunctionReturn<T extends object, U extends keyof ObserverProperties<T>> {
	method: U;
	cb: (...args: ObserverPropertiesParameters<T, U>) => ObserverReturnType<T, U>;
}

function CreateCatchFunction<U extends keyof ObserverProperties<unknown>>(method: U) {
	return function <T extends object>(cb: CatchFunctionCallback<T, U>): CatchFunctionReturn<T, U> {
		return {
			method: method,
			cb: function (...args: ObserverPropertiesParameters<T, U>): ObserverReturnType<T, U> {
				return cb.apply(cb, args);
			},
		};
	};
}

function isCatchFunction(value: any): value is CatchFunctionReturn<any, keyof ObserverProperties<any>> {
	return typeof value?.method === "string" && typeof value?.cb === "function";
}

const get = CreateCatchFunction("get");
const has = CreateCatchFunction("has");
const set = CreateCatchFunction("set");
const apply = CreateCatchFunction("apply");
const defineProperty = CreateCatchFunction("defineProperty");
const deleteProperty = CreateCatchFunction("deleteProperty");

export type {CatchFunctionReturn};
export {get, has, set, apply, defineProperty, deleteProperty, isCatchFunction};
