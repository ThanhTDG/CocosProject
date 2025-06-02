import { validateEnum } from "../../utils/enumUtils";
import { validateVector } from "../../utils/vectorUtils";
import { EffectType } from "./effectType";

export class EffectItem {
	constructor({ effectType, worldPosition }) {
		this.effectType = validateEnum(EffectType, effectType);
		this.worldPosition = validateVector(worldPosition);
	}
}
