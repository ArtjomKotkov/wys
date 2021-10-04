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
        console.log(this.controls_)
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
}