
export const required = (value: string): boolean => !!value.length;

export const inRange = (min: number, max: number): CallableFunction => {
    return (value: string) => min <= Number(value) && Number(value) <= max;
}