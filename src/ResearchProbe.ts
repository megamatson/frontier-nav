import FlyweightHelper from "./Flyweight";
import { RevenueGrade } from "./Grade";
import Probe, { getCommonAliases, SightseeingNumber } from "./Probe";
import { ScaledProbeRange } from "./ScaledProbe";

export default class ResearchProbe extends ScaledProbeRange(1, 6) {
	private static helper = new FlyweightHelper<ResearchProbe>();

	private constructor(level: number) {
		super(level);
		ResearchProbe.helper.add(this, ...getCommonAliases('Research', 'G', level));
	}



	getCreditsOutputModifier(this: this): number {
		return 1.5 + 0.5 * this.level;
	}

	getCreditsOutput(
		grade: RevenueGrade,
		sightseeingSpots: number,
		chainBonus: number,
		boost: number
	): number {
		return Math.floor(
			(
				grade.revenue
				* this.getCreditsOutputModifier()
				+ this.getSightseeingRevenue(sightseeingSpots)
			)
			* chainBonus
			* boost
		);
	}

	getMiraniumOutputModifier(): number {
		return 0.3;
	}

	getStorageOutput(): number {
		return 0;
	}

	getBoostModifier(): number {
		return 1;
	}

	getName(this: this): string {
		return `Research Probe ${this.getShortName()}`;
	}

	protected sightseeingFormula(
		this: this,
		sightseeingSpots: SightseeingNumber
	) {
		return sightseeingSpots * (1500 + this.level * 500);
	}

	getShortName(this: this): string {
		return `G${this.level}`;
	}

	canChain(): boolean {
		return true;
	}

	static get(alias: any): ResearchProbe {
		return this.helper.get(alias);
	}

	static getAll(): ResearchProbe[] {
		return this.helper.getAll();
	}

	static readonly G1 = new ResearchProbe(1);
	static readonly G2 = new ResearchProbe(2);
	static readonly G3 = new ResearchProbe(3);
	static readonly G4 = new ResearchProbe(4);
	static readonly G5 = new ResearchProbe(5);
	static readonly G6 = new ResearchProbe(6);
}

Probe.register(ResearchProbe);