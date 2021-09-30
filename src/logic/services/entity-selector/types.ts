export type Entity = WeekEntity | DayEntity;

export type WeekEntity = {
    id: string;
    type: 'week';
    index: number;
}

export type DayEntity = {
    id: string;
    type: 'date';
}