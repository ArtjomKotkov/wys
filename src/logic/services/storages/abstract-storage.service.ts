export interface AbstractKeyValueStorage<T> {
    set(key: string, value: T): void;

    get(key: string): T | undefined;

    getAll(): Record<string, T>;

    delete(key: string): void;
}

export interface AbstractStorage<T> {
    set(value: T): void;

    get(): T | undefined;

    delete(): void;
}

export interface AbstractEntityStorage<T> {

    save(value: T): void;

    get(id: any): T | undefined;

    delete(id: any): void;
}