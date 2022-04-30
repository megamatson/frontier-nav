import Probe, { getCommonAliases } from './Probe';
import {ScaledProbeRange} from './ScaledProbe';
import FlyweightHelper from './Flyweight';
import { MiningGrade } from './Grade';

export default class MiningProbe extends ScaledProbeRange(1, 10) {
	private static helper = new FlyweightHelper<MiningProbe>();

	protected constructor(level: number) {
		super(level);
		MiningProbe.helper.add(
			this,
			...getCommonAliases('Mining', 'G', level)
		);
	}

	getName(this: this): string {
		return `Mining Probe ${this.getShortName()}`;
	}

	getShortName(this: this): string {
		return `G${this.level}`;
	}

	getCreditsOutputModifier(this: this): number {
		return 0.30;
	}

	getMiraniumOutputModifier(this: this): number {
		return (this.level < 8 ?
			0.8 + this.level * 0.20 :
			2.70 + (this.level - 9) * 0.30
		);
	}

	getMiraniumOutput(
		grade: MiningGrade,
		chainBonus: number,
		boost: number
	): number {
		return Math.floor(
			grade.mining
			* this.getMiraniumOutputModifier()
			* chainBonus
			* boost
		);
	}

	getStorageOutput(): number {
		return 0;
	}

	sightseeingFormula(): number {
		return 0;
	}

	getBoostModifier(): number {
		return 1;
	}

	canChain(): boolean {
		return true;
	}

	static get(alias: any) {
		return MiningProbe.helper.get(alias);
	}

	static getAll() {
		return MiningProbe.helper.getAll();
	}

	static readonly G1 = new MiningProbe(1);
	static readonly G2 = new MiningProbe(2);
	static readonly G3 = new MiningProbe(3);
	static readonly G4 = new MiningProbe(4);
	static readonly G5 = new MiningProbe(5);
	static readonly G6 = new MiningProbe(6);
	static readonly G7 = new MiningProbe(7);
	static readonly G8 = new MiningProbe(8);
	static readonly G9 = new MiningProbe(9);
	static readonly G10 = new MiningProbe(10);
}

Probe.register(MiningProbe);
