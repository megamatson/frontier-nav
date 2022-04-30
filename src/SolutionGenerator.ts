import _ from "lodash";
import BasicProbe from "./BasicProbe";
import { FitnessFunction } from "./FitnessFunction";
import random from "./Gaussian";
import { isBasic } from "./IsBasic";
import Mira, { getProbeCount, SiteId } from "./Mira";
import NoProbe from "./NoProbe";
import { mutate } from "./ProbabalisticMiraMutator";
import Probe from "./Probe";
import sleep from "./Sleep";

type Events = 'new solution' | 'better solution';

export interface Options {
	totalIterations?: number

	/**
	 * The number of iterations to go without improvement
	 * before the algorithm gets a random probe configuration
	 * and continues from there
	 */
	iterationsToPurge?: number
}

export function probabilityOfSelection(
	fitnessOld: number,
	fitnessNew: number,
	leniency: number
): number {
	if (fitnessNew > fitnessOld)
		return 1;

	if (fitnessNew < 0)
		return 0;

	if (leniency === 0)
		return 0;

	const decreaseInFitness = fitnessOld - fitnessNew;
	return Math.exp(-decreaseInFitness / 1000 / leniency);
}

export default class SolutionGenerator extends EventTarget {
	private mira: Mira;
	private miraFitness: number = -Infinity;
	private bestMira;
	private bestMiraFitness: number = -Infinity;

	private numberOfNonbasicProbes: number;
	private modifiableSiteIds: SiteId[] = [];

	private totalIterations: number;
	private iterationsToPurge: number;

	constructor(
		mira: Mira,
		private probeLimits: Map<Probe, number>,
		private fitnessFunction: FitnessFunction,
		options?: Options
	) {
		super();

		this.bestMira = mira;
		this.bestMiraFitness = this.fitness(this.bestMira);

		this.mira = this.bestMira;
		this.miraFitness = this.bestMiraFitness;
		this.setMira(mira, this.bestMiraFitness);

		this.totalIterations = Math.max(1, options?.totalIterations ?? 1000);
		this.iterationsToPurge = Math.max(1, options?.iterationsToPurge ?? 200);

		for (const site of mira.getSites())
			if (site.probe !== NoProbe)
				this.modifiableSiteIds.push(site.id);

		this.numberOfNonbasicProbes = this.getNumberOfNonbasicProbes();
	}

	private setBestMira(mira: Mira, fitness?: number){
		fitness = fitness ?? this.fitness(mira);

		if (fitness > this.bestMiraFitness) {
			this.bestMira = mira;
			this.bestMiraFitness = fitness;

			this.dispatchEvent(new CustomEvent<Mira>('better solution', {
				detail: this.bestMira
			}));
		}
	}

	private setMira(mira: Mira, fitness: number) {
		this.mira = mira;
		this.miraFitness = fitness;

		this.dispatchEvent(new CustomEvent<Mira>('new solution', {
			detail: this.mira
		}));
	}


	addEventListener(
		type: Events,
		callback: EventListenerOrEventListenerObject | null,
		options?: boolean | AddEventListenerOptions
	): void {
		return super.addEventListener(type, callback, options);
	}

	removeEventListener(
		type: Events,
		callback: EventListenerOrEventListenerObject | null,
		options?: boolean | EventListenerOptions
	): void {
		return super.removeEventListener(type, callback, options);
	}

	dispatchEvent(event: Event): boolean {
		return super.dispatchEvent(event);
	}


	getNumberOfNonbasicProbes(): number {
		let ret = 0;

		this.probeLimits.forEach((n, probe) => {
			if (!isBasic(probe))
				ret += n;
		});

		return ret;
	}

	getUnusedProbeCount(mira: Mira): Map<Probe, number> {
		let counts = new Map(Probe.getAll().map(probe =>
			[probe, this.probeLimits.get(probe)!]
		));

		for (const site of mira.getSites()) {
			const probe = site.probe;
			const newCount = counts.get(probe)! - 1;

			if (newCount === 0)
				counts.delete(probe);
			else
				counts.set(probe, newCount);
		}

		return counts;
	}

	getUnusedNonbasicProbeCount(mira: Mira) {
		let ret = this.getUnusedProbeCount(mira);
		ret.delete(NoProbe);
		ret.delete(BasicProbe);
	}

	getExcessProbes(mira: Mira) {
		let counts = getProbeCount(mira);

		for (const [probe, count] of counts.entries()) {
			const excess = Math.max(count - (this.probeLimits.get(probe) ?? 0), 0);

			if (excess > 0)
				counts.set(probe, excess);
			else
				counts.delete(probe);
		}

		return counts;
	}

	getExcessProbeCount(mira: Mira): number {
		let ret = 0;
		this.getExcessProbes(mira).forEach(n => ret += n);
		return ret;
	}

	fitness(mira: Mira): number {
		const excessProbes = this.getExcessProbeCount(mira);

		if (excessProbes > 0)
			return -excessProbes * 1000;

		return this.fitnessFunction(mira.getOutput());
	}

	hasNoProbesToWorkWith(): boolean {
		for (const [probe, count] of this.probeLimits.entries()) {
			if (isBasic(probe))
				continue;

			if (count > 0)
				return false;
		}

		return true;
	}

	hasNoSitesToWorkWith(): boolean {
		return this.modifiableSiteIds.length <= 0;
	}

	hasNothingToWorkWith(): boolean {
		return this.hasNoProbesToWorkWith() || this.hasNoSitesToWorkWith();
	}


	getNumberOfOperations(): number {
		let randomPositiveNumber = Math.abs(random());
		randomPositiveNumber = randomPositiveNumber * Math.min(
			this.modifiableSiteIds.length,
			this.numberOfNonbasicProbes
		) / 50;

		return Math.round(randomPositiveNumber + 1);
	}

	getNeighbor(): Mira {
		const ret = this.mira.clone();
		const sites = _.sampleSize(
			this.modifiableSiteIds,
			this.getNumberOfOperations()
		).map(siteId => ret.get(siteId));

		mutate(sites, ret, this.probeLimits);
		return ret;
	}


	private running = false;

	async getOptimizedSolution(): Promise<Mira> {
		if (this.running)
			throw new Error('already running');

		if (this.hasNothingToWorkWith())
			return Promise.resolve(this.mira);

		this.running = true;

		try {
			await sleep();

			for (let iteration = 0; iteration < this.totalIterations; iteration++) {
				const leniency = 1 - (iteration + 1) / this.totalIterations;

				const candidate = this.getNeighbor();
				const candidateFitness = this.fitness(candidate);

				this.setBestMira(candidate, candidateFitness);
				// await sleep(0);

				const candidateProbabilityOfSelection = probabilityOfSelection(
					this.miraFitness,
					candidateFitness,
					leniency
				);

				if (candidateProbabilityOfSelection >= Math.random())
					this.setMira(candidate, candidateFitness);
			}
		} finally {
			this.running = false;
		}

		await sleep();

		return this.bestMira;
	}
}
