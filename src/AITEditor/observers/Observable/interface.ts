import type {Observable} from "./Observable";

interface ObserverProperties<T extends object> {
	apply?: (target: T, thisArg: any, args: any[]) => any;
	defineProperty?: (target: T, property: keyof T, attributes: PropertyDescriptor, observable: Observable<T>) => boolean;
	deleteProperty?: (target: T, property: keyof T, observable: Observable<T>) => boolean;
	get?: (target: T, property: keyof T, receiver: any, observable: Observable<T>) => any;
	has?: (target: T, property: keyof T, observable: Observable<T>) => boolean;
	set?: (target: T, property: keyof T, newValue: any, receiver: any, observable: Observable<T>) => boolean;
}

type ObserverReturnType<T extends object, U extends keyof ObserverProperties<T>> = ReturnType<
	{[K in keyof ObserverProperties<T>]-?: ObserverProperties<T>[K]}[U]
>;
type ObserverPropertiesParameters<T extends object, U extends keyof ObserverProperties<T>> = Parameters<
	{[K in keyof ObserverProperties<T>]-?: ObserverProperties<T>[K]}[U]
>;

export type {ObserverProperties, ObserverReturnType, ObserverPropertiesParameters};
