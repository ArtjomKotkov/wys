export class InputControl<T> {

    private currentValue!: T;

    isValid!: boolean;
    isDirty!: boolean;

    constructor(
        private initialValue: T,
        private readonly validators: CallableFunction[] = [],
    ) {
        this.currentValue = initialValue;
        this.calculateValidity();
    }

    get value(): T {
        return this.currentValue;
    }

    set value(value: T) {
        this.currentValue = value;
        this.onValueChanged();
    }

    reset(value?: T): void {
        this.initialValue = value ? value : this.initialValue;
        this.currentValue = this.initialValue;

        this.onValueChanged();

        this.isDirty = false;
    }

    private onValueChanged(): void {
        this.calculateValidity();

        this.isDirty = true;
    }

    private calculateValidity(): void {
        if (!this.validators.length) {
            this.isValid = true;
            return;
        }

        this.isValid = this.validators
            .map(validator => validator(this.currentValue))
            .reduce((value1, value2) => !!value1 && !!value2);
    }

}