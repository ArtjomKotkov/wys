export type Entity = WeekEntity | DayEntity;

export type WeekEntity = {
    id: string;
    type: 'week';
    index: number;
    from: Date;
    to: Date;
}

export type DayEntity = {
    id: string;
    type: 'date';
}