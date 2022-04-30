import FlyweightHelper from "./Flyweight";
import Probe, { getCommonAliases } from "./Probe";
import { ScaledProbeRange } from "./ScaledProbe";

export default class BoosterProbe extends ScaledProbeRange(1, 2) {
	private static helper = new FlyweightHelper<BoosterProbe>();

	constructor(level: number) {
		super(level);

		BoosterProbe.helper.add(this, ...getCommonAliases('Booster', 'G', level));
	}

	canChain(): boolean {
		return true;
	}

	getCreditsOutputModifier(): number {
		return 0.1;
	}

	getMiraniumOutputModifier(): number {
		return 0.1;
	}

	getStorageOutput(): number {
		return 0;
	}

	getBoostModifier(chainBonus: number): number {
		return (1 + this.level * 0.5) * chainBonus;
	}

	getName(): string {
		return `Booster Probe ${this.getShortName()}`;
	}

	getShortName(): string {
		return `G${this.level}`;
	}

	protected sightseeingFormula(): number {
		return 0;
	}

	static get(alias: any): BoosterProbe {
		return this.helper.get(alias);
	}

	static getAll(): Probe[] {
		return this.helper.getAll();
	}

	static readonly G1 = new BoosterProbe(1);
	static readonly G2 = new BoosterProbe(2);
}

Probe.register(BoosterProbe);