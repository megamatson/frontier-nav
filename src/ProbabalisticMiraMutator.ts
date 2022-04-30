import _ from "lodash";
import BasicProbe from "./BasicProbe";
import { isBasic } from "./IsBasic";
import Mira, { getAvailableProbes } from "./Mira";
import Probe from "./Probe";
import ScaledProbe from "./ScaledProbe";
import Site from "./Site";

type OperationFunction = (
	s: Site[],
	availableProbes: Map<Probe, number>,
	mira: Mira,
) => Site[];

type Operation = {
	weight: number,
	minimumSites?: number,
	func: OperationFunction,
	fallback?: Operation
}

function changeProbe(
	site: Site,
	newProbe: Probe,
	availableProbes: Map<Probe, number>,
) {
	const oldProbe = site.probe;
	if (oldProbe === newProbe)
		return;
	const oldProbeAvailable = availableProbes.get(oldProbe) ?? 0;
	const newProbeAvailable = availableProbes.get(newProbe) ?? 0;

	if (newProbeAvailable <= 0)
		throw new Error(`Out of ${newProbe.getName()} (had ${newProbeAvailable})`);

	site.probe = newProbe;
	availableProbes.set(oldProbe, oldProbeAvailable + 1);
	availableProbes.set(newProbe, newProbeAvailable - 1);
}


function getRandomProbes(availableProbes: Map<Probe, number>, n = 1): Probe[] {
	n = Math.floor(n);
	if (n < 1)
		return [];

	const allProbes = Array.from(availableProbes.entries())
		.reduce<Probe[]>((prev, [probe, number]) => {
			if (isBasic(probe))
				return prev;

			const times = Math.min(n, number);
			for (let i = 0; i < times; i++)
				prev.push(probe);
			return prev;
		}, [])
	;

	return _.sampleSize(allProbes, n);
}


const rawOperations: Operation[] = [];

const makeBasicOperation: Operation = {
	weight: 1,
	func: function makeBasic(sites, availableProbes) {
		let ret: Site[] = [];
		sites.forEach(site => {
			if (site.probe === BasicProbe)
				return;

			try {
				changeProbe(site, BasicProbe, availableProbes);
			} catch (e) {
				console.error(e);
				ret.push(site);
			}
		});

		return ret;
	}
} as const;

rawOperations.push(makeBasicOperation);


const changeProbeOperation: Operation = {
	func: function changeProbeOperation(sites, availableProbes) {
		const probes = getRandomProbes(availableProbes, sites.length);

		for (let i = 0; i < probes.length; i++) {
			const site = sites[i];
			const probe = probes[i];
			changeProbe(site, probe, availableProbes);
		}

		return sites.splice(0, sites.length - probes.length);
	},
	weight: 4,
	fallback: makeBasicOperation
};

rawOperations.push(changeProbeOperation);


const upgradeOperation: Operation = {
	func: function upgrade(sites: Site[], availableProbes): Site[] {
		let ret = [];

		for (const site of sites) {
			const probe = site.probe;
			if (!(probe instanceof ScaledProbe)) {
				ret.push(site);
				continue;
			}

			const scaledProbe = probe as ScaledProbe;
			const probeClass = Probe.getClassOf(scaledProbe);

			if (probeClass === undefined) {
				console.log(`Could not find class of ${scaledProbe}`);
				ret.push(site);
				continue;
			}

			for (let i = scaledProbe.getMaximumLevel(); i > probe.level; i--) {
				const upgradedProbe = probeClass?.get(i)!;
				if (availableProbes.get(upgradedProbe))
					changeProbe(site, upgradedProbe, availableProbes);
			}
		}

		return ret;
	},
	weight: 10,
	fallback: changeProbeOperation,
} as const;

rawOperations.push(upgradeOperation);


const swapOperation: Operation = {
	func: function swap(sites, availableProbes) {
		const ret: Site[] = [];

		for (const sitePairs of _.chunk(sites, 2)) {
			if (sitePairs.length !== 2) {
				_.forEach(sitePairs, site => { ret.push(site); });
				continue;
			}

			const [firstSite, secondSite] = sitePairs;
			const firstProbe = firstSite.probe;
			const secondProbe = secondSite.probe;

			if (firstProbe === secondProbe) {
				ret.push(firstSite);
				ret.push(secondSite);
				continue;
			}

			changeProbe(firstSite, BasicProbe, availableProbes);
			changeProbe(secondSite, BasicProbe, availableProbes);

			changeProbe(firstSite, secondProbe, availableProbes);
			changeProbe(secondSite, firstProbe, availableProbes);
		}

		return ret;
	},
	weight: 10,
	minimumSites: 2,
	fallback: upgradeOperation,
} as const;

rawOperations.push(swapOperation);


function generateGetOperationFunction(rawOperations: Operation[]) {
	const totalWeight = rawOperations.reduce<number>(
		(prev, current) => prev + current.weight, 0
	);

	const operationTable = rawOperations.reduce<[[number, number], Operation][]>(
		(prev, operation) => {
			const lastEndRange = prev.length === 0 ? 0 : prev[prev.length - 1][0][1];
			prev.push([
				[lastEndRange, lastEndRange + operation.weight / totalWeight], operation
			]);
			return prev;
		}, []
	);

	return function(n: number): Operation {
		for (const [[start, end], op] of operationTable) {
			if (_.inRange(n, start, end))
				return op;
		}

		throw new Error(`${n} not in [0, 1)`);
	};
}


const getOperation = generateGetOperationFunction(rawOperations);


export function mutate(
	sites: Site[],
	mira: Mira,
	probeLimits: Map<Probe, number>
): void {
	const availableProbes = getAvailableProbes(mira, probeLimits);

	while (sites.length) {
		const randomNumber = Math.random();
		let operation = getOperation(randomNumber);
		const minimumSites = operation.minimumSites ?? 1;

		let sitesForConsideration = sites.splice(0, minimumSites);

		while (true) {
			sitesForConsideration =  operation.func(
				sitesForConsideration,
				availableProbes,
				mira
			);

			if (sitesForConsideration.length <= 0)
				break;

			if (operation.fallback) {
				operation = operation.fallback;
			} else {
				console.warn('ERROR could not mutate the following sites:');
				console.warn(sitesForConsideration);
				console.warn('Mira', mira);
				console.warn('Available Probes', availableProbes);
				console.warn();
			}
		}
	}
}