import _ from "lodash";
import Grade from "./Grade";
import Output from "./Output";
import Probe from "./Probe";
import getProbeComboModifier from "./ProbeCombo";
import Site from "./Site";

export abstract class Region {
	*getSites(): Generator<Site> {
		for (let site in this) {
			const value = this[site];
			if (this[site] instanceof Site)
				yield value as unknown as Site;
		}
	}

	get(siteId: SiteId): Site;
	get(siteId: number): Site|never;
	get(siteId: number|SiteId): Site|never {
		if (_.isString(siteId))
			siteId = parseInt(siteId);

		const ret = this[siteId as keyof this];

		if (ret && ret instanceof Site)
			return ret;

		throw new Error(`${siteId} is not a valid site ID`);
	}

	abstract getName(): string;
}

export class Primordia extends Region {
	getName() {
		return "Primordia";
	}

	101: Site = new Site({
		id: 101,
		production: Grade.C,
		revenue:    Grade.S,
		combat:     Grade.S,
		maxSightSeeingSpots: 1
	});

	102: Site = new Site({
		id: 102,
		production: Grade.C,
		revenue:    Grade.F,
		combat:     Grade.B,
	});

	103: Site = new Site({
		id: 103,
		production: Grade.C,
		revenue:    Grade.E,
		combat:     Grade.A,
		maxSightSeeingSpots: 1
	});

	104: Site = new Site({
		id: 104,
		production: Grade.C,
		revenue:    Grade.S,
		combat:     Grade.B,
		maxSightSeeingSpots: 1
	});

	105: Site = new Site({
		id: 105,
		production: Grade.A,
		revenue:    Grade.F,
		combat:     Grade.B,
	});

	106: Site = new Site({
		id: 106,
		production: Grade.B,
		revenue:    Grade.E,
		combat:     Grade.B,
		maxSightSeeingSpots: 1
	});

	107: Site = new Site({
		id: 107,
		production: Grade.A,
		revenue:    Grade.F,
		combat:     Grade.B,
	});

	108: Site = new Site({
		id: 108,
		production: Grade.C,
		revenue:    Grade.F,
		combat:     Grade.B,
	});

	109: Site = new Site({
		id: 109,
		production: Grade.C,
		revenue:    Grade.D,
		combat:     Grade.B,
	});

	110: Site = new Site({
		id: 110,
		production: Grade.C,
		revenue:    Grade.E,
		combat:     Grade.B,
		maxSightSeeingSpots: 1
	});

	111: Site = new Site({
		id: 111,
		production: Grade.C,
		revenue:    Grade.F,
		combat:     Grade.B,
	});

	112: Site = new Site({
		id: 112,
		production: Grade.A,
		revenue:    Grade.F,
		combat:     Grade.A,
	});

	113: Site = new Site({
		id: 113,
		production: Grade.C,
		revenue:    Grade.C,
		combat:     Grade.B,
	});

	114: Site = new Site({
		id: 114,
		production: Grade.C,
		revenue:    Grade.E,
		combat:     Grade.B,
	});

	115: Site = new Site({
		id: 115,
		production: Grade.C,
		revenue:    Grade.D,
		combat:     Grade.B,
	});

	116: Site = new Site({
		id: 116,
		production: Grade.A,
		revenue:    Grade.D,
		combat:     Grade.B,
	});

	117: Site = new Site({
		id: 117,
		production: Grade.A,
		revenue:    Grade.D,
		combat:     Grade.A,
		maxSightSeeingSpots: 1
	});

	118: Site = new Site({
		id: 118,
		production: Grade.C,
		revenue:    Grade.E,
		combat:     Grade.B,
	});

	119: Site = new Site({
		id: 119,
		production: Grade.C,
		revenue:    Grade.E,
		combat:     Grade.B,
	});

	120: Site = new Site({
		id: 120,
		production: Grade.B,
		revenue:    Grade.B,
		combat:     Grade.B,
	});

	121: Site = new Site({
		id: 121,
		production: Grade.A,
		revenue:    Grade.E,
		combat:     Grade.B,
	});
}

export class Noctilum extends Region {
	getName() {
		return "Noctilum";
	}

	201: Site = new Site({
		id: 201,
		production: Grade.C,
		revenue:    Grade.B,
		combat:     Grade.S,
	});

	202: Site = new Site({
		id: 202,
		production: Grade.C,
		revenue:    Grade.C,
		combat:     Grade.B,
	});

	203: Site = new Site({
		id: 203,
		production: Grade.C,
		revenue:    Grade.A,
		combat:     Grade.B,
	});

	204: Site = new Site({
		id: 204,
		production: Grade.A,
		revenue:    Grade.C,
		combat:     Grade.B,
	});

	205: Site = new Site({
		id: 205,
		production: Grade.A,
		revenue:    Grade.F,
		combat:     Grade.B,
	});

	206: Site = new Site({
		id: 206,
		production: Grade.B,
		revenue:    Grade.A,
		combat:     Grade.S,
	});

	207: Site = new Site({
		id: 207,
		production: Grade.C,
		revenue:    Grade.C,
		combat:     Grade.B,
	});

	208: Site = new Site({
		id: 208,
		production: Grade.B,
		revenue:    Grade.D,
		combat:     Grade.B,
	});

	209: Site = new Site({
		id: 209,
		production: Grade.C,
		revenue:    Grade.F,
		combat:     Grade.B,
	});

	210: Site = new Site({
		id: 210,
		production: Grade.B,
		revenue:    Grade.D,
		combat:     Grade.B,
	});

	211: Site = new Site({
		id: 211,
		production: Grade.A,
		revenue:    Grade.D,
		combat:     Grade.B,
	});

	212: Site = new Site({
		id: 212,
		production: Grade.B,
		revenue:    Grade.E,
		combat:     Grade.B,
	});

	213: Site = new Site({
		id: 213,
		production: Grade.C,
		revenue:    Grade.S,
		combat:     Grade.B,
		maxSightSeeingSpots: 1
	});

	214: Site = new Site({
		id: 214,
		production: Grade.C,
		revenue:    Grade.D,
		combat:     Grade.B,
		maxSightSeeingSpots: 2
	});

	215: Site = new Site({
		id: 215,
		production: Grade.C,
		revenue:    Grade.D,
		combat:     Grade.B,
	});

	216: Site = new Site({
		id: 216,
		production: Grade.C,
		revenue:    Grade.A,
		combat:     Grade.A,
		maxSightSeeingSpots: 1
	});

	217: Site = new Site({
		id: 217,
		production: Grade.C,
		revenue:    Grade.C,
		combat:     Grade.B,
	});

	218: Site = new Site({
		id: 218,
		production: Grade.C,
		revenue:    Grade.E,
		combat:     Grade.B,
	});

	219: Site = new Site({
		id: 219,
		production: Grade.C,
		revenue:    Grade.E,
		combat:     Grade.B,
	});

	220: Site = new Site({
		id: 220,
		production: Grade.C,
		revenue:    Grade.C,
		combat:     Grade.A,
		maxSightSeeingSpots: 1
	});

	221: Site = new Site({
		id: 221,
		production: Grade.C,
		revenue:    Grade.E,
		combat:     Grade.B,
		maxSightSeeingSpots: 2
	});

	222: Site = new Site({
		id: 222,
		production: Grade.C,
		revenue:    Grade.D,
		combat:     Grade.B,
		maxSightSeeingSpots: 1
	});

	223: Site = new Site({
		id: 223,
		production: Grade.C,
		revenue:    Grade.F,
		combat:     Grade.B,
		maxSightSeeingSpots: 1
	});

	224: Site = new Site({
		id: 224,
		production: Grade.C,
		revenue:    Grade.A,
		combat:     Grade.B,
	});

	225: Site = new Site({
		id: 225,
		production: Grade.C,
		revenue:    Grade.A,
		combat:     Grade.B,
		maxSightSeeingSpots: 1
	});
}

export class Oblivia extends Region {
	getName() {
		return "Oblivia";
	}

	301: Site = new Site({
		id: 301,
		production: Grade.B,
		revenue:    Grade.D,
		combat:     Grade.B,
	});

	302: Site = new Site({
		id: 302,
		production: Grade.C,
		revenue:    Grade.E,
		combat:     Grade.B,
	});

	303: Site = new Site({
		id: 303,
		production: Grade.C,
		revenue:    Grade.E,
		combat:     Grade.B,
	});

	304: Site = new Site({
		id: 304,
		production: Grade.B,
		revenue:    Grade.A,
		combat:     Grade.S,
	});

	305: Site = new Site({
		id: 305,
		production: Grade.C,
		revenue:    Grade.E,
		combat:     Grade.B,
	});

	306: Site = new Site({
		id: 306,
		production: Grade.C,
		revenue:    Grade.D,
		combat:     Grade.B,
		maxSightSeeingSpots: 1
	});

	307: Site = new Site({
		id: 307,
		production: Grade.C,
		revenue:    Grade.B,
		combat:     Grade.B,
	});

	308: Site = new Site({
		id: 308,
		production: Grade.B,
		revenue:    Grade.C,
		combat:     Grade.A,
	});

	309: Site = new Site({
		id: 309,
		production: Grade.C,
		revenue:    Grade.C,
		combat:     Grade.B,
	});

	310: Site = new Site({
		id: 310,
		production: Grade.C,
		revenue:    Grade.A,
		combat:     Grade.B,
	});

	311: Site = new Site({
		id: 311,
		production: Grade.C,
		revenue:    Grade.B,
		combat:     Grade.B,
	});

	312: Site = new Site({
		id: 312,
		production: Grade.C,
		revenue:    Grade.D,
		combat:     Grade.B,
	});

	313: Site = new Site({
		id: 313,
		production: Grade.C,
		revenue:    Grade.E,
		combat:     Grade.A,
		maxSightSeeingSpots: 2
	});

	314: Site = new Site({
		id: 314,
		production: Grade.C,
		revenue:    Grade.B,
		combat:     Grade.S,
	});

	315: Site = new Site({
		id: 315,
		production: Grade.A,
		revenue:    Grade.S,
		combat:     Grade.B,
		maxSightSeeingSpots: 2
	});

	316: Site = new Site({
		id: 316,
		production: Grade.C,
		revenue:    Grade.D,
		combat:     Grade.B,
	});

	317: Site = new Site({
		id: 317,
		production: Grade.C,
		revenue:    Grade.A,
		combat:     Grade.B,
		maxSightSeeingSpots: 1
	});

	318: Site = new Site({
		id: 318,
		production: Grade.C,
		revenue:    Grade.B,
		combat:     Grade.B,
		maxSightSeeingSpots: 2
	});

	319: Site = new Site({
		id: 319,
		production: Grade.C,
		revenue:    Grade.D,
		combat:     Grade.B,
		maxSightSeeingSpots: 1
	});

	320: Site = new Site({
		id: 320,
		production: Grade.C,
		revenue:    Grade.B,
		combat:     Grade.B,
	});

	321: Site = new Site({
		id: 321,
		production: Grade.A,
		revenue:    Grade.D,
		combat:     Grade.A,
	});

	322: Site = new Site({
		id: 322,
		production: Grade.A,
		revenue:    Grade.A,
		combat:     Grade.B,
	});
}

export class Sylvalum extends Region {
	getName() {
		return "Sylvalum";
	}

	401: Site = new Site({
		id: 401,
		production: Grade.C,
		revenue:    Grade.B,
		combat:     Grade.B,
	});

	402: Site = new Site({
		id: 402,
		production: Grade.A,
		revenue:    Grade.B,
		combat:     Grade.B,
	});

	403: Site = new Site({
		id: 403,
		production: Grade.A,
		revenue:    Grade.C,
		combat:     Grade.S,
	});

	404: Site = new Site({
		id: 404,
		production: Grade.B,
		revenue:    Grade.S,
		combat:     Grade.S,
		maxSightSeeingSpots: 1
	});

	405: Site = new Site({
		id: 405,
		production: Grade.A,
		revenue:    Grade.E,
		combat:     Grade.A,
	});

	406: Site = new Site({
		id: 406,
		production: Grade.C,
		revenue:    Grade.B,
		combat:     Grade.B,
	});

	407: Site = new Site({
		id: 407,
		production: Grade.A,
		revenue:    Grade.B,
		combat:     Grade.B,
		maxSightSeeingSpots: 0
	});

	408: Site = new Site({
		id: 408,
		production: Grade.B,
		revenue:    Grade.D,
		combat:     Grade.B,
		maxSightSeeingSpots: 1
	});

	409: Site = new Site({
		id: 409,
		production: Grade.B,
		revenue:    Grade.S,
		combat:     Grade.B,
	});

	410: Site = new Site({
		id: 410,
		production: Grade.C,
		revenue:    Grade.S,
		combat:     Grade.B,
		maxSightSeeingSpots: 1
	});

	411: Site = new Site({
		id: 411,
		production: Grade.A,
		revenue:    Grade.A,
		combat:     Grade.S,
	});

	412: Site = new Site({
		id: 412,
		production: Grade.A,
		revenue:    Grade.B,
		combat:     Grade.A,
	});

	413: Site = new Site({
		id: 413,
		production: Grade.C,
		revenue:    Grade.A,
		combat:     Grade.B,
		maxSightSeeingSpots: 1
	});

	414: Site = new Site({
		id: 414,
		production: Grade.C,
		revenue:    Grade.B,
		combat:     Grade.B,
		maxSightSeeingSpots: 2
	});

	415: Site = new Site({
		id: 415,
		production: Grade.C,
		revenue:    Grade.S,
		combat:     Grade.B,
	});

	416: Site = new Site({
		id: 416,
		production: Grade.C,
		revenue:    Grade.B,
		combat:     Grade.B,
	});

	417: Site = new Site({
		id: 417,
		production: Grade.B,
		revenue:    Grade.D,
		combat:     Grade.B,
	});

	418: Site = new Site({
		id: 418,
		production: Grade.C,
		revenue:    Grade.C,
		combat:     Grade.B,
	});

	419: Site = new Site({
		id: 419,
		production: Grade.C,
		revenue:    Grade.S,
		combat:     Grade.S,
		maxSightSeeingSpots: 1
	});

	420: Site = new Site({
		id: 420,
		production: Grade.B,
		revenue:    Grade.C,
		combat:     Grade.B,
	});
}

export class Cauldros extends Region {
	getName() {
		return "Cauldros";
	}

	501: Site = new Site({
		id: 501,
		production: Grade.B,
		revenue:    Grade.F,
		combat:     Grade.B,
	});

	502: Site = new Site({
		id: 502,
		production: Grade.A,
		revenue:    Grade.C,
		combat:     Grade.B,
		maxSightSeeingSpots: 1
	});

	503: Site = new Site({
		id: 503,
		production: Grade.C,
		revenue:    Grade.D,
		combat:     Grade.B,
		maxSightSeeingSpots: 1
	});

	504: Site = new Site({
		id: 504,
		production: Grade.C,
		revenue:    Grade.C,
		combat:     Grade.B,
	});

	505: Site = new Site({
		id: 505,
		production: Grade.C,
		revenue:    Grade.B,
		combat:     Grade.B,
		maxSightSeeingSpots: 2
	});

	506: Site = new Site({
		id: 506,
		production: Grade.C,
		revenue:    Grade.B,
		combat:     Grade.B,
		maxSightSeeingSpots: 1
	});

	507: Site = new Site({
		id: 507,
		production: Grade.C,
		revenue:    Grade.A,
		combat:     Grade.B,
		maxSightSeeingSpots: 1
	});

	508: Site = new Site({
		id: 508,
		production: Grade.A,
		revenue:    Grade.B,
		combat:     Grade.S,
		maxSightSeeingSpots: 1
	});

	509: Site = new Site({
		id: 509,
		production: Grade.A,
		revenue:    Grade.A,
		combat:     Grade.A,
	});

	510: Site = new Site({
		id: 510,
		production: Grade.C,
		revenue:    Grade.B,
		combat:     Grade.B,
	});

	511: Site = new Site({
		id: 511,
		production: Grade.A,
		revenue:    Grade.C,
		combat:     Grade.A,
	});

	512: Site = new Site({
		id: 512,
		production: Grade.C,
		revenue:    Grade.A,
		combat:     Grade.S,
	});

	513: Site = new Site({
		id: 513,
		production: Grade.C,
		revenue:    Grade.A,
		combat:     Grade.B,
		maxSightSeeingSpots: 2
	});

	514: Site = new Site({
		id: 514,
		production: Grade.C,
		revenue:    Grade.A,
		combat:     Grade.B,
		maxSightSeeingSpots: 1
	});

	515: Site = new Site({
		id: 515,
		production: Grade.C,
		revenue:    Grade.B,
		combat:     Grade.S,
	});

	516: Site = new Site({
		id: 516,
		production: Grade.B,
		revenue:    Grade.E,
		combat:     Grade.B,
	});
}

export const Regions = [
	Primordia,
	Noctilum,
	Oblivia,
	Sylvalum,
	Cauldros
];


export type SiteIdsOf<T extends Region> = keyof T & number;
export type SiteId = {
		[K in keyof Mira]: Mira[K] extends Region ? SiteIdsOf<Mira[K]> : never
}[keyof Mira];

type RegionName = {
	[K in keyof Mira]: Mira[K] extends Region ? K : never
}[keyof Mira]


export function getProbeCount(mira: Mira): Map<Probe, number> {
	let counts = new Map(Probe.getAll().map(probe => [probe, 0]));

	for (const site of mira.getSites())
		counts.set(site.probe, counts.get(site.probe)! + 1);

	return counts;
}

export function getAvailableProbes(
	mira: Mira,
	probeLimits: Map<Probe, number>
): Map<Probe, number> {
	let counts = getProbeCount(mira);

	return new Map(Probe.getAll().map(probe =>
		[probe, (probeLimits.get(probe) ?? Infinity) - (counts.get(probe) ?? 0)]
	));
}


export default class Mira {
	Primordia = new Primordia();
	Noctilum = new Noctilum();
	Oblivia = new Oblivia();
	Sylvalum = new Sylvalum();
	Cauldros = new Cauldros();

	static readonly baseStorage = 6000;

	constructor() {
		for (let [a, b] of Mira.neighborPairs) {
			let siteA = this.get(a);
			let siteB = this.get(b);

			siteA.neighbors.push(siteB);
			siteB.neighbors.push(siteA);
		}
	}

	*getSites() {
		for (let region of this.getRegions())
			yield *region.getSites();
	}

	*getRegions(): Generator<Region> {
		for (let propertyKey in this) {
			if (!this.hasOwnProperty(propertyKey))
				continue;

			const property = this[propertyKey];

			if (property instanceof Region)
				yield property;
		}
	}

	get(site: number|string): Site|never;
	get(site: SiteId): Site {
		for (const region of this.getRegions()) {
			try {
				return region.get(site);
			} catch (e) {}
		}

		throw new Error(`site "${site}" not in Mira`);
	}

	getChainMap(): Map<Site, Set<Site>> {
		const siteToChain: ReturnType<typeof this.getChainMap> = new Map();

		for (let site of this.getSites()) {
			if (!site.probe.canChain())
				continue;

			for (let neighbor of site.neighbors) {
				if (neighbor.probe !== site.probe)
					continue;

				const neighborChain = siteToChain.get(neighbor);

				if (neighborChain === undefined)
					continue;

				const siteChain = siteToChain.get(site);

				if (siteChain) {
					if (siteChain.size < neighborChain.size) {
						siteChain.forEach(chainSite => {
							neighborChain.add(chainSite);
							siteToChain.set(chainSite, neighborChain);
						});
					} else {
						neighborChain.forEach(chainSite => {
							siteChain.add(chainSite);
							siteToChain.set(chainSite, siteChain);
						});
					}
				} else {
					neighborChain.add(site);
					siteToChain.set(site, neighborChain);
				}
			}

			if (!siteToChain.has(site))
				siteToChain.set(site, new Set([site]));
		}

		return siteToChain;
	}

	getChainSizeMap(): Map<Site, number> {
		let ret: ReturnType<typeof this.getChainSizeMap> = new Map();
		const chains = this.getChainMap();

		for (let site of this.getSites())
			ret.set(site, chains.get(site)?.size ?? 0);

		return ret;
	}

	getChainBonusMap(): Map<Site, number> {
		let ret: ReturnType<typeof this.getChainBonusMap> = new Map();
		this.getChainSizeMap().forEach((size, site) => {
			ret.set(site, getProbeComboModifier(size));
		});

		return ret;
	}

	getBoostBonusMap(chainBonusMap: Map<Site, number>): Map<Site, number> {
		let ret: ReturnType<typeof this.getBoostBonusMap> = new Map();

		for (const site of this.getSites()) {
			const boost = site.probe.getBoostModifier(
				chainBonusMap.get(site) ?? 0,
				site.neighbors.map(s => [
					s.probe, {chain: chainBonusMap.get(s) ?? 0, boost: 0}
				])
			);

			site.neighbors.forEach(neighbor =>
				ret.set(neighbor, (ret.get(neighbor) ?? 1) * boost)
			);
		}

		return ret;
	}

	getOutput(): Output {
		let output = new Output({
			storage: Mira.baseStorage,
		});

		const chainBonusMap = this.getChainBonusMap();
		const boostBonusMap = this.getBoostBonusMap(chainBonusMap);

		for (let site of this.getSites()) {
			const siteOutput = site.getOutput(chainBonusMap, boostBonusMap);
			output.addToSelf(siteOutput);
		}

		return output;
	}

	static readonly neighborPairs: readonly (readonly[SiteId, SiteId])[] = [
		[101, 105],
		[102, 104],
		[103, 105],
		[103, 106],
		[103, 222],
		[104, 106],
		[105, 109],
		[106, 107],
		[107, 110],
		[108, 109],
		[110, 111],
		[110, 112],
		[111, 113],
		[112, 114],
		[112, 115],
		[113, 409],
		[114, 116],
		[116, 117],
		[117, 118],
		[117, 120],
		[118, 121],
		[119, 120],
		[121, 301],

		[201, 206],
		[202, 203],
		[202, 207],
		[202, 208],
		[203, 204],
		[204, 205],
		[204, 211],
		[204, 212],
		[205, 209],
		[206, 207],
		[206, 213],
		[210, 211],
		[212, 216],
		[214, 215],
		[215, 218],
		[216, 218],
		[216, 225],
		[217, 222],
		[218, 224],
		[219, 220],
		[220, 221],
		[220, 225],
		[221, 222],
		[223, 224],

		[301, 302],
		[301, 303],
		[303, 306],
		[304, 305],
		[304, 306],
		[304, 309],
		[305, 308],
		[306, 307],
		[307, 313],
		[309, 311],
		[310, 311],
		[312, 313],
		[312, 315],
		[313, 314],
		[315, 316],
		[315, 318],
		[315, 321],
		[317, 318],
		[317, 319],
		[320, 321],
		[321, 322],

		[401, 402],
		[401, 404],
		[402, 408],
		[403, 405],
		[404, 407],
		[405, 408],
		[405, 409],
		[406, 408],
		[407, 412],
		[408, 413],
		[409, 411],
		[410, 412],
		[411, 414],
		[412, 415],
		[413, 416],
		[415, 502],
		[416, 418],
		[416, 419],
		[417, 419],
		[419, 420],

		[501, 502],
		[502, 503],
		[503, 504],
		[504, 508],
		[505, 506],
		[505, 509],
		[507, 508],
		[508, 509],
		[508, 511],
		[509, 510],
		[509, 513],
		[511, 512],
		[511, 514],
		[513, 516],
		[514, 515],
	] as const;

	static assertNeighborsAreValid() {
		for (const [neighbor1, neighbor2] of this.neighborPairs)
			if (neighbor1 >= neighbor2)
				throw new Error(`${neighbor1} >= ${neighbor2}`);

		for (let i = 0; i < this.neighborPairs.length - 1; i++) {
			const firstPair = this.neighborPairs[i];
			const secondPair = this.neighborPairs[i + 1];

			if (firstPair > secondPair)
				throw new Error(
					`neighbor pair ${firstPair} should go after ${secondPair}`
				);

			if (firstPair[0] === secondPair[0] && firstPair[1] === secondPair[1])
				throw new Error(`duplicate neighbor pair: ${firstPair}`);
		}
	}

	static getRegionNames() {
		const ret = [
			'Primordia',
			'Noctilum',
			'Oblivia',
			'Sylvalum',
			'Cauldros'
		] as const;

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const _: readonly RegionName[] = ret;

		return ret;
	}

	clone(this: this): Mira {
		let ret = new Mira();

		for (const site of this.getSites()) {
			const newSite = ret.get(site.id);
			newSite.probe = site.probe;
			newSite.setSightseeingSpots(site.getSightseeingSpots());
		}

		return ret;
	}
}

export const instance = new Mira();

Mira.assertNeighborsAreValid();