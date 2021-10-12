export interface AbstractKeyValueStorage<T> {
    set(key: string, value: T): void;

    get(key: string): T | undefined;

    delete(key: string): void;
}

export interface AbstractStorage<T> {
    set(value: T): void;

    get(): T | undefined;

    delete(): void;
}