export interface AbstractKeyValueStorage<T> {
    set(key: string, value: T): void;

    get(key: string): T | undefined;

    delete(key: string): void;
}