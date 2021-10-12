import {InputControl} from "@/shared/form/shared/form/input-control";

export class Form {

    constructor(private controls_: Record<string, InputControl<any>>) {
    }

    get isValid(): boolean {
        return Object.values(this.controls_)
            .map(control => control.isValid)
            .reduce((value1, value2) => value1 && value2);
    }

    get dirty(): boolean {
        return Object.values(this.controls_)
            .map(control => control.isDirty)
            .reduce((value1, value2) => value1 || value2);
    }

    get controls(): Record<string, InputControl<any>> {
        return this.controls_;
    }

    reset(values: Record<string, any>): void {
        for (const [control, value] of Object.entries(values)) {
            this.controls_[control].reset(value);
        }
    }

    get values(): Record<string, any> {
        const output: Record<string, any> = {};
        for (const [name, control] of Object.entries(this.controls_)) {
            output[name] = control.value;
        }
        return output;
    }

    add(name: string, control: InputControl<any>): void {
        if (name in this.controls_) {
            throw new Error('Control with such a name already exist.');
        }
        this.controls_[name] = control;
    }

    remove(name: string): void {
        if (!(name in this.controls_)) {
            throw new Error('Control with such a name doesn\'t exist.');
        }
        delete this.controls_[name];
    }

    forceValidity(): void {
        Object.values(this.controls_).forEach(control => control.forceValidity());
    }

    forceUntouched(): void {
        Object.values(this.controls_).forEach(control => control.forceUntouched());
    }
}