import {Entity} from "./types";


export class EntitySelectorService {

    private entity?: Entity;

    getCurrent(): Entity | undefined {
        return this.entity;
    }

    select(entity: Entity): void {
        this.entity = entity;
    }

    resetSelection(): void {
        this.entity = undefined;
    }

    isSelected(entity: Entity): boolean {
        return entity.id == this.entity?.id && entity.type == this.entity?.type;
    }

}