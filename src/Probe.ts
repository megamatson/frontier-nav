import _ from "lodash";
import { MiningGrade, RevenueGrade } from "./Grade";

export interface ProbeClass<T extends Probe = Probe> extends Function {
	get(name: any): T;
	getAll(): T[];
}

export type SightseeingNumber = 0|1|2;

export function assertSightSeeingNumber(sightseeingSpots: any):
	asserts sightseeingSpots is SightseeingNumber
{
	if (!_.isInteger(sightseeingSpots))
		throw new Error(
			`sightseeing spots (${sightseeingSpots}) was not an integer`
		);

	if (sightseeingSpots < 0)
		throw new Error(`sightseeing spots (${sightseeingSpots}) < 0`);

	if (sightseeingSpots > 2)
		throw new Error(`sightseeing spots > 2`);
}

export interface Bonuses {
	chain: number,
	boost: number,
}
export type Neighbors = [Probe, Bonuses][];

export default abstract class Probe {
	static readonly probeClasses: Set<ProbeClass<Probe>> = new Set();

	abstract getName(): string;

	abstract getMiraniumOutputModifier(): number;

	abstract getCreditsOutputModifier(): number;

	abstract getBoostModifier(chainBonus: number, neighbors: Neighbors): number;

	abstract getStorageOutput(
		chainBonus: number,
		boost: number,
		neighbors: Neighbors
	): number;

	getMiraniumOutput(
		grade: MiningGrade,
		chainBonus: number,
		boostBonus: number,
		neighbors: Neighbors
	): number {
		return grade.mining * this.getMiraniumOutputModifier();
	}

	static getClassOf(probe: Probe) {
		for (const class_ of this.probeClasses) {
			if (probe instanceof class_)
				return class_;
		}

		return undefined;
	}

	getCreditsOutput(
		grade: RevenueGrade,
		sightseeingSpots: number,
		chainBonus: number,
		boostBonus: number,
		neighbors: Neighbors
	): number {
		return (
			grade.revenue
			* this.getCreditsOutputModifier()
			+ this.getSightseeingRevenue(sightseeingSpots)
		);
	}

	abstract canChain(): boolean;

	protected abstract sightseeingFormula(
		sightseeingSpots: SightseeingNumber
	): number;

	getSightseeingRevenue(sightseeingSpots: number): number {
		assertSightSeeingNumber(sightseeingSpots);
		return this.sightseeingFormula(sightseeingSpots);
	}

	static get(alias: any): Probe {
		let ret: Probe[] = [];
		for (let probeClass of this.probeClasses) {
			try {
				ret.push(probeClass.get(alias));
			} catch (e) {}
		}

		if (ret.length === 1)
			return ret[0];

		if (ret.length === 0)
			throw new Error(`No probe with the alias "${alias}"`);

		throw new Error(
			`${ret.length} probes with the alias of ${alias}: ${
				ret.map(p => p.getName()).join(', ')
			}`
		);
	}

	static getAll(): Probe[] {
		let ret: Probe[] = [];
		this.probeClasses.forEach(probeClass =>
			ret = ret.concat(probeClass.getAll())
		);
		return ret;
	}

	private static assertRedefined(
		probeClass: ProbeClass, key: string & keyof ProbeClass
	) {
		if (probeClass[key] === Probe[key])
			throw new Error(`${probeClass.name} did not redefine ${key}`);
	}

	static register(probeClass: ProbeClass) {
		this.assertRedefined(probeClass, 'get');
		this.assertRedefined(probeClass, 'getAll');
		this.assertRedefined(probeClass, 'name');

		this.probeClasses.add(probeClass);
	}
}

export function probeNameFromClass<T extends Probe>(
	o: string | ProbeClass<T>
): string {
	if (_.isString(o)) {
		const ret = o.split(/(?=[A-Z])/).join(' ');
		return ret.length ? ret[0].toUpperCase() + ret.slice(1) : ret;
	}

	return probeNameFromClass(o.name);
}

export function testProbeClass<T extends Probe>(_: ProbeClass<T>) {
	// do nothing
}

export function getCommonAliases(
	probeType: string,
	levelPrefix: string,
	level: number
) {
	return [
		`${probeType} probe ${levelPrefix}${level}`,
		`${probeType} probe ${level}`,
		`${probeType} ${levelPrefix}${level}`,
		`${probeType} ${level}`,
		`${probeType} probe ${levelPrefix}${level}`,
		level
	] as [string, string, string, string, string, number];
}

testProbeClass(Probe);