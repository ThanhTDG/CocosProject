import { validateEnum } from "../../utils/enumUtils";
import { validateVector } from "../../utils/vectorUtils";
import { BulletType } from "./bulletType";

export class InitBullet {
    constructor({ direction, worldPosition, bulletType }) {
        this.direction = validateVector(direction);
        this.worldPosition = validateVector(worldPosition);
        this.bulletType = validateEnum(BulletType, bulletType);
    }
}