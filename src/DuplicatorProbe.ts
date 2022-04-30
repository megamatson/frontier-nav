import FlyweightHelper from "./Flyweight";
import { MiningGrade, RevenueGrade } from "./Grade";
import NoProbe from "./NoProbe";
import Probe, { Neighbors } from "./Probe";

export class DuplicatorProbeClass extends Probe {
	private static helper = new FlyweightHelper<DuplicatorProbeClass>();

	constructor() {
		super();

		DuplicatorProbeClass.helper.add(this, 'Duplicator Probe', 'Duplicator');
	}

	getName() {
		return "Duplicator Probe";
	}

	getMiraniumOutputModifier(): number {
		return 0;
	}

	getCreditsOutputModifier(): number {
		return 0;
	}

	getStorageOutput(
		chainBonus: number,
		boost: number,
		neighbors: Neighbors
	): number {
		let storage = 0;

		neighbors.forEach(([probe]) => {
			if (DuplicatorProbeClass.isDupableProbe(probe))
				storage += probe.getStorageOutput(chainBonus, boost, []);
		});

		return storage;
	}

	getBoostModifier(chainBonus: number, neighbors: Neighbors): number {
		let boost = 1;

		neighbors.forEach(([probe]) => {
			if (DuplicatorProbeClass.isDupableProbe(probe))
				boost *= probe.getBoostModifier(chainBonus, []);
		});

		return boost;
	}

	static *getDupableNeighbors(neighbors: Iterable<Probe>) {
		for (const neighbor of neighbors)
			if (this.isDupableProbe(neighbor))
				yield neighbor;
	}

	static isDupableProbe(probe: Probe): boolean {
		return (
			probe !== NoProbe
			&& probe !== DuplicatorProbeClass.DuplicatorProbe
		);
	}

	getCreditsOutput(
		grade: RevenueGrade,
		sightseeingSpots: number,
		chainBonus: number,
		boost: number,
		neighbors: Neighbors
	): number {
		let credits = 0;

		neighbors.forEach(([probe]) => {
			if (DuplicatorProbeClass.isDupableProbe(probe))
				credits += probe.getCreditsOutput(
					grade,
					sightseeingSpots,
					chainBonus,
					boost,
					[]
				);
		});

		return credits;
	}

	getMiraniumOutput(
		grade: MiningGrade,
		chainBonus: number,
		boost: number,
		neighbors: Neighbors
	): number {
		let miranium = 0;

		neighbors.forEach(([probe]) => {
			if (DuplicatorProbeClass.isDupableProbe(probe))
				miranium += probe.getMiraniumOutput(
					grade,
					chainBonus,
					boost,
					[]
				);
		});

		return miranium;
	}

	canChain(): boolean {
		return true;
	}

	protected sightseeingFormula(): number {
		return 0;
	}

	static get(alias: any) {
		return this.helper.get(alias);
	}

	static getAll(): DuplicatorProbeClass[] {
		return this.helper.getAll();
	}

	static DuplicatorProbe = new DuplicatorProbeClass();
}

Probe.register(DuplicatorProbeClass);

export default DuplicatorProbeClass.DuplicatorProbe;