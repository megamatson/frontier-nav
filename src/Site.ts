import { CombatGrade, MiningGrade, RevenueGrade } from "./Grade";
import { SiteId } from "./Mira";
import NoProbe from "./NoProbe";
import Output from "./Output";
import Probe, { Neighbors, SightseeingNumber } from "./Probe";

type SiteParameters = Readonly<
	Pick<Site, "production"|"revenue"|"combat"|"id">
	&	Partial<Pick<Site, "probe"|"maxSightSeeingSpots">>
	& {
		"neighbors"?: Site['neighbors'],
		"sightseeingSpots"?: ReturnType<Site["getSightseeingSpots"]>,
	}
>;

export default class Site {
	readonly production: MiningGrade;
	readonly revenue: RevenueGrade;
	readonly combat: CombatGrade;
	readonly maxSightSeeingSpots: SightseeingNumber;
	private sightseeingSpots: SightseeingNumber;
	probe: Probe;
	readonly neighbors: Site[];
	readonly id: SiteId;

	constructor(params: SiteParameters) {
		this.id = params.id;
		this.production = params.production;
		this.revenue = params.revenue;
		this.combat = params.combat;
		this.maxSightSeeingSpots = params.maxSightSeeingSpots ?? 0;

		this.sightseeingSpots = params.sightseeingSpots ?? 0;

		if (this.sightseeingSpots > this.maxSightSeeingSpots)
			throw new Error(
				'Sightseeing spots '
				+ this.sightseeingSpots
				+ ' > Max Sightseeing spots '
				+ this.maxSightSeeingSpots
			);

		this.probe = params.probe ?? NoProbe;
		this.neighbors = params.neighbors ?? [];
	}

	setSightseeingSpots(sightseeingSpots: SightseeingNumber) {
		if (this.sightseeingSpots > this.maxSightSeeingSpots)
			throw Error(
				`${sightseeingSpots} exceeds max sightseeing number `
				+`for this site (${this.maxSightSeeingSpots})`
			);
		this.sightseeingSpots = sightseeingSpots;
	}

	getSightseeingSpots(this: this): SightseeingNumber {
		return this.sightseeingSpots;
	}

	getSightseeingRevenue(): number {
		return this.probe.getSightseeingRevenue(this.sightseeingSpots);
	}

	getOutput(
		this: this,
		chainBonusMap: Map<Site, number>,
		boostBonusMap: Map<Site, number>
	): Output {
		const chainBonus = chainBonusMap.get(this) ?? 0;
		const boost = boostBonusMap.get(this) ?? 0;
		const neighbors: Neighbors = [];

		for (const neighbor of this.neighbors)
			neighbors.push([neighbor.probe, {
				boost: boostBonusMap.get(neighbor) ?? 0,
				chain: chainBonusMap.get(neighbor) ?? 0,
			}]);

		return new Output({
			credits: this.probe.getCreditsOutput(
				this.revenue,
				this.sightseeingSpots,
				chainBonus,
				boost,
				neighbors
			),
			miranium: this.probe.getMiraniumOutput(
				this.production,
				chainBonus,
				boost,
				neighbors
			),
			storage: this.probe.getStorageOutput(chainBonus, boost, neighbors),
		});
	}
}