interface ObserverProperties<T> {
	apply?: (target: T, thisArg: any, argArray: any[]) => any;
	defineProperty?: (target: T, property: keyof T, attributes: PropertyDescriptor) => boolean;
	deleteProperty?: (target: T, property: keyof T) => boolean;
	get?: (target: T, property: keyof T, receiver: any) => any;
	has?: (target: T, property: keyof T) => boolean;
	set?: (target: T, property: keyof T, newValue: any, receiver: any) => boolean;
}

type ObserverReturnType<T, U extends keyof ObserverProperties<T>> = ReturnType<{[K in keyof ObserverProperties<T>]-?: ObserverProperties<T>[K]}[U]>;
type ObserverPropertiesParameters<T, U extends keyof ObserverProperties<T>> = Parameters<{[K in keyof ObserverProperties<T>]-?: ObserverProperties<T>[K]}[U]>;

export type {ObserverProperties, ObserverReturnType, ObserverPropertiesParameters};
