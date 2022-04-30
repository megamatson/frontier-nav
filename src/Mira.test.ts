import _ from "lodash";
import BasicProbe from "./BasicProbe";
import BoosterProbe from "./BoosterProbe";
import DuplicatorProbe from "./DuplicatorProbe";
import MiningProbe from "./MiningProbe";
import Mira, { SiteId } from "./Mira";
import Output from "./Output";
import { SightseeingNumber } from "./Probe";
import ResearchProbe from "./ResearchProbe";
import StorageProbe from "./StorageProbe";

function setAllBasic(mira: Mira = new Mira()) {
	for (const site of mira.getSites())
		site.probe = BasicProbe;

	return mira;
}

function areAboutEqual(a: number, b: number, percentDifference = 0.0001) {
	if (a === b)
		return true;

	a = Math.abs(a);
	b = Math.abs(b);
	return Math.abs(a - b) / Math.max(a, b) <= percentDifference;
}

const newMatchers = {
	toBeSiteWithNneighbors(site: SiteId, mira: Mira, n: number) {
		if (!_.isInteger(site))
			return {
				pass: false,
				message: () => `expected ${site} to be an integer`,
			};

		try {
			const actualNeighbors = mira.get(site).neighbors.length;
			if (actualNeighbors !== n)
				return {
					pass: false,
					message: () =>
						'expected'
						+ site
						+ ' to have '
						+ n
						+ 'neighbor(s), but it had '
						+ actualNeighbors
				};

			return {
				pass: true,
				message: () => `expected ${site} to not have ${n} neighbor(s)`,
			};
		} catch (e) {
			return {
				pass: false,
				message: () => `expected ${site} to be a site`,
			};
		}
	},
	toBeCloseToOutput(actual: Output, expected: Output) {
		const keys: readonly (keyof typeof expected)[] = [
			'miranium',
			'credits',
			'storage'
		] as const;

		let errorMessages: string[] = [];

		for (let key of keys) {
			if (!areAboutEqual(actual[key] as number, expected[key] as number))
				errorMessages.push(
					`expected ${key} (${actual[key]})`
					+ ` to be about the same as ${expected[key]}`
				);
		}

		if (errorMessages.length)
			return {
				pass: false,
				message: () => errorMessages.join('\n'),
			};

		return {
			pass: true,
			message: () => `expected outputs to not be about equal`,
		};
	}
};

expect.extend(newMatchers);

test('get', () => {
	const mira = new Mira();

	expect(() => mira.get(0)).toThrow();
	expect(mira.get(101)).toBe(mira.Primordia[101]);
});

test('sites have correct number of neighbors', () => {
	const mira = new Mira();

	const siteToNumberOfNeighbors: Record<SiteId, number> = {
		101: 1,
		102: 1,
		103: 3,
		104: 2,
		105: 3,
		106: 3,
		107: 2,
		108: 1,
		109: 2,
		110: 3,
		111: 2,
		112: 3,
		113: 2,
		114: 2,
		115: 1,
		116: 2,
		117: 3,
		118: 2,
		119: 1,
		120: 2,
		121: 2,

		201: 1,
		202: 3,
		203: 2,
		204: 4,
		205: 2,
		206: 3,
		207: 2,
		208: 1,
		209: 1,
		210: 1,
		211: 2,
		212: 2,
		213: 1,
		214: 1,
		215: 2,
		216: 3,
		217: 1,
		218: 3,
		219: 1,
		220: 3,
		221: 2,
		222: 3,
		223: 1,
		224: 2,
		225: 2,

		301: 3,
		302: 1,
		303: 2,
		304: 3,
		305: 2,
		306: 3,
		307: 2,
		308: 1,
		309: 2,
		310: 1,
		311: 2,
		312: 2,
		313: 3,
		314: 1,
		315: 4,
		316: 1,
		317: 2,
		318: 2,
		319: 1,
		320: 1,
		321: 3,
		322: 1,

		401: 2,
		402: 2,
		403: 1,
		404: 2,
		405: 3,
		406: 1,
		407: 2,
		408: 4,
		409: 3,
		410: 1,
		411: 2,
		412: 3,
		413: 2,
		414: 1,
		415: 2,
		416: 3,
		417: 1,
		418: 1,
		419: 3,
		420: 1,

		501: 1,
		502: 3,
		503: 2,
		504: 2,
		505: 2,
		506: 1,
		507: 1,
		508: 4,
		509: 4,
		510: 1,
		511: 3,
		512: 1,
		513: 2,
		514: 2,
		515: 1,
		516: 1,
	} as const;

	for (const siteIdStr in siteToNumberOfNeighbors) {
		const siteId = parseInt(siteIdStr) as SiteId;
		const numberOfNeighbors = siteToNumberOfNeighbors[siteId];

		expect(siteId).toBeSiteWithNneighbors(mira, numberOfNeighbors);
	}
});

test('Mira with no probes has correct output', () => {
	const expected = new Output({
		storage: Mira.baseStorage
	});

	expect(expected).toBeCloseToOutput(new Mira().getOutput());
});

test('all basic has correct output', () => {
	const expected = new Output({
		miranium: 16550,
		credits: 27675,
		storage: 6000
	});

	expect(setAllBasic().getOutput()).toBeCloseToOutput(expected);
});

test('all basic probes, except all mining levels at FN Site 116', () => {
	let mira = setAllBasic();

	const revenue = 27585;
	const storage = Mira.baseStorage;
	const tests = [
		[MiningProbe.G1,  16800],
		[MiningProbe.G2,  16900],
		[MiningProbe.G3,  17000],
		[MiningProbe.G4,  17100],
		[MiningProbe.G5,  17200],
		[MiningProbe.G6,  17300],
		[MiningProbe.G7,  17400],
		[MiningProbe.G8,  17500],
		[MiningProbe.G9,  17650],
		[MiningProbe.G10, 17800],
	] as const;

	for (const [probe, mining] of tests) {
		const expectedOutput = new Output({
			credits: revenue,
			storage,
			miranium: mining,
		});

		mira.get(116).probe = probe;
		expect(mira.getOutput()).toBeCloseToOutput(expectedOutput);
	}
});

test('all basic probes, except all research levels at FN Site 116', () => {
	let mira = setAllBasic();

	const mining = 16450;
	const storage = Mira.baseStorage;
	const tests = [
		[ResearchProbe.G1, 28350],
		[ResearchProbe.G2, 28575],
		[ResearchProbe.G3, 28800],
		[ResearchProbe.G4, 29025],
		[ResearchProbe.G5, 29250],
		[ResearchProbe.G6, 29475],
	] as const;

	for (const [probe, revenue] of tests) {
		const expectedOutput = new Output({
			credits: revenue,
			storage,
			miranium: mining,
		});

		mira.get(116).probe = probe;
		expect(mira.getOutput()).toBeCloseToOutput(expectedOutput);
	}
});

test('all basic probes, except a storage probe at FN Site 116', () => {
	let mira = setAllBasic();
	mira.get(116).probe = StorageProbe;

	const expected = new Output({
		miranium: 16350,
		credits: 27495,
		storage: 9000,
	});

	expect(mira.getOutput()).toBeCloseToOutput(expected);
});

test('all basic probes, except research probes at FN Site 117 with 1 SSS',
	() => {
		const tests = [
			[ResearchProbe.G1, 30350],
			[ResearchProbe.G2, 31075],
			[ResearchProbe.G3, 31800],
			[ResearchProbe.G4, 32525],
			[ResearchProbe.G5, 33250],
			[ResearchProbe.G6, 33975],
		] as const;

		const mining = 16450;
		const storage = Mira.baseStorage;

		const mira = setAllBasic();
		const site117 = mira.get(117);
		site117.setSightseeingSpots(1);

		for (const [probe, revenue] of tests) {
			site117.probe = probe;

			const expected = new Output({
				credits: revenue,
				miranium: mining,
				storage,
			});

			expect(mira.getOutput()).toBeCloseToOutput(expected);
		}
	}
);

test('all basic, except probes at 101 (hidden S revenue)', () => {
	const mira = setAllBasic();
	const site101 = mira.get(101);
	site101.setSightseeingSpots(1);

	const tests = [
		[MiningProbe.G1, 16675, 27505],
		[MiningProbe.G10, 17175, 27505],
		[ResearchProbe.G1, 16500, 30950],
		[ResearchProbe.G6, 16500, 35575],
	] as const;

	for (const [probe, mining, revenue] of tests) {
		const expected = new Output({
			credits: revenue,
			miranium: mining,
			storage: Mira.baseStorage
		});

		site101.probe = probe;
		expect(mira.getOutput()).toBeCloseToOutput(expected);
	}
});

test('all basic, except various mining chains', () => {
	const mira = setAllBasic();

	const chains = new Map<SiteId, [number,number]>([
		[112, [16800, 27635]],
		[114, [16925, 27575]],
		[116, [17550, 27485]],
		[117, [17950, 27395]],
		[118, [18550, 27335]],
		[121, [19050, 27275]],
		[120, [19400, 27145]],
		[119, [20580, 27085]],
		[115, [20905, 26995]],
	]);

	chains.forEach(([mining, revenue], site) => {
		mira.get(site).probe = MiningProbe.G1;
		expect(mira.getOutput()).toEqual(new Output({
			storage: Mira.baseStorage,
			miranium: mining,
			credits: revenue,
		}));
	});
});

test('all basic, except various research chains', () => {
	const mira = setAllBasic();

	const tests = new Map<SiteId, [SightseeingNumber, number, number]>([
		[112, [0, 16450, 28275]],
		[114, [0, 16400, 29175]],
		[116, [0, 16300, 31521]],
		[120, [0, 16230, 33471]],
		[119, [0, 16180, 34371]],
		[117, [1, 16080, 44087]],
	]);

	tests.forEach(([sightseeingSpots, mining, revenue], siteId) => {
		const site = mira.get(siteId);
		site.probe = ResearchProbe.G4;
		site.setSightseeingSpots(sightseeingSpots);

		expect(mira.getOutput()).toBeCloseToOutput({
			storage: Mira.baseStorage,
			credits: revenue,
			miranium: mining
		});
	});
});

test('all basic, except various storage chains', () => {
	const mira = setAllBasic();

	const data = [
		[218, 16450, 27555, 9000],
		[224, 16350, 27255, 12000],
		[223, 16250, 27175, 17700],
		[215, 16150, 26995, 21600],
		[214, 16050, 26815, 28500],
		[216, 15950, 26515, 33000],
		[225, 15850, 26215, 37500],
		[212, 15710, 26095, 49200],
		[220, 15610, 25875, 54600],
		[219, 15510, 25755, 60000],
	] as const;

	for (let [siteId, miranium, credits, storage] of data) {
		const expectedOutput = new Output({
			miranium,
			credits,
			storage,
		});

		mira.get(siteId).probe = StorageProbe;

		expect(mira.getOutput()).toEqual(expectedOutput);
	}
});

test('all basic, expect various chains', () => {
	const mira = setAllBasic();

	const data = [
		[315, 2, ResearchProbe.G4, 16450, 37225, 6000],
		[312, 0, MiningProbe.G2, 16625, 37135, 6000],
		[318, 1, ResearchProbe.G4, 16575, 42585, 6000],
		[321, 0, StorageProbe, 16375, 42405, 9000],
		[313, 2, MiningProbe.G2, 16550, 42345, 9000],
		[322, 0, StorageProbe, 16350, 42045, 12000],
		[317, 1, ResearchProbe.G4, 16300, 54354, 12000],
		[320, 0, StorageProbe, 16200, 54094, 17700],
		[314, 0, MiningProbe.G2, 16645, 53964, 17700],
		[316, 0, ResearchProbe.G4, 16595, 55786, 17700],
		[307, 0, MiningProbe.G2, 16860, 55656, 17700],
		[306, 1, MiningProbe.G2, 17425, 55566, 17700],
		[303, 0, StorageProbe, 17325, 55446, 20700],
		[304, 0, MiningProbe.G2, 17780, 55296, 20700],
		[301, 0, StorageProbe, 17640, 55116, 23700],
		[302, 0, StorageProbe, 17540, 54996, 29400],
		[305, 0, MiningProbe.G2, 17865, 54936, 29400],
		[308, 0, MiningProbe.G2, 19112, 54826, 29400],
		[309, 0, MiningProbe.G10, 19737, 54716, 29400],
		[311, 0, MiningProbe.G10, 20362, 54586, 29400],
		[310, 0, MiningProbe.G10, 21662, 54436, 29400],
	] as const;

	for (let [
		siteId,
		sightseeingSpots,
		probe,
		miranium,
		credits,
		storage
	] of data) {
		const expectedOutput = new Output({
			credits,
			miranium,
			storage
		});

		const site = mira.get(siteId);
		site.setSightseeingSpots(sightseeingSpots);
		site.probe = probe;

		expect(mira.getOutput()).toBeCloseToOutput(expectedOutput);
	}
});

test('all basic, except interactions with duplicator', () => {
	const mira = setAllBasic();

	const data = [
		[408, 1, DuplicatorProbe, 17075, 28350, 6000],
		[402, 0, StorageProbe, 16735, 27910, 12000],
		[401, 0, StorageProbe, 16635, 27650, 15000],
		[404, 1, StorageProbe, 16495, 27310, 20700],
		[406, 0, StorageProbe, 16255, 26870, 26700],
		[406, 0, BasicProbe, 16495, 27310, 20700],
		[405, 0, MiningProbe.G9, 18365, 27160, 20700],
		[403, 0, MiningProbe.G9, 19465, 27050, 20700],
		[409, 0, MiningProbe.G9, 21328, 26880, 20700],
		[406, 0, DuplicatorProbe, 21028, 26330, 20700],
		[413, 1, DuplicatorProbe, 21136, 26105, 21600],
		[406, 0, BasicProbe, 21153, 26655, 20700],
		[413, 1, ResearchProbe.G4, 21208, 37480, 20700],
		[416, 0, ResearchProbe.G4, 21158, 39430, 20700],
		[419, 1, ResearchProbe.G4, 21108, 49940, 20700],
		[406, 0, MiningProbe.G9, 22428, 49720, 20700],
		[406, 0, ResearchProbe.G4, 20988, 56740, 20700],
		[416, 0, DuplicatorProbe, 21188, 54880, 20700],
	] as const;

	for (const [
		siteId,
		sightseeingSpots,
		probe,
		miranium,
		credits,
		storage
	] of data) {
		const expectedOutput = new Output({credits, miranium, storage});

		const site = mira.get(siteId);
		site.setSightseeingSpots(sightseeingSpots);
		site.probe = probe;

		expect(mira.getOutput()).toBeCloseToOutput(expectedOutput);
	}
});

test('all basic, except interactions with booster probes', () => {
	const mira = setAllBasic();

	const data = [
		[508, 1, BoosterProbe.G1, 16350, 27415, 6000],
		[504, 0, MiningProbe.G9, 17237, 27305, 6000],
		[503, 1, MiningProbe.G9, 17787, 27215, 6000],
		[502, 1, MiningProbe.G9, 19798, 27105, 6000],
		[509, 0, ResearchProbe.G5, 19698, 31230, 6000],
		[505, 2, ResearchProbe.G5, 19648, 41505, 6000],
		[506, 1, BoosterProbe.G1, 19548, 46545, 6000],
		[506, 1, ResearchProbe.G5, 19598, 54290, 6000],
		[511, 0, StorageProbe, 19398, 54070, 10500],
		[512, 0, StorageProbe, 19298, 53770, 13500],
		[514, 1, StorageProbe, 19198, 53470, 19650],
		[508, 1, BoosterProbe.G2, 19637, 55420, 21600],
		[504, 0, DuplicatorProbe, 19325, 55475, 21600],
		[501, 0, MiningProbe.G9, 21188, 55435, 21600],
		[507, 1, BoosterProbe.G2, 21088, 55135, 21600],
		[507, 1, BoosterProbe.G1, 21088, 55135, 21600],
		[508, 1, BoosterProbe.G1, 20311, 53185, 19650],
		[511, 0, BoosterProbe.G1, 20615, 54939, 17700],
		[503, 1, DuplicatorProbe, 18307, 54774, 17700],
		[502, 1, DuplicatorProbe, 17950, 54914, 17700],
		[415, 0, MiningProbe.G9, 20005, 54634, 17700],
		[412, 0, MiningProbe.G9, 21105, 54504, 17700],
		[410, 0, MiningProbe.G9, 22464, 54334, 17700],
	] as const;

	for (const [
		siteId,
		sightseeingSpots,
		probe,
		miranium,
		credits,
		storage
	] of data) {
		const expectedOutput = new Output({ miranium, credits, storage });

		const site = mira.get(siteId);

		site.probe = probe;
		site.setSightseeingSpots(sightseeingSpots);

		expect(mira.getOutput()).toBeCloseToOutput(expectedOutput);
	}
});

test('storage regression 1', () => {
	const mira = setAllBasic();

	const data = [
		[501, StorageProbe, 16410, 27595, 9000],
		[502, DuplicatorProbe, 16710, 27925, 12000],
		[503, StorageProbe, 16410, 27525, 18000],
		[504, StorageProbe, 16310, 27305, 21000],
		[508, StorageProbe, 16110, 27045, 26700],
		[511, BoosterProbe.G1, 15910, 26825, 28650],
		[512, StorageProbe, 15810, 26525, 33150],
		[509, DuplicatorProbe, 16360, 27350, 36150],
		[510, BoosterProbe.G2, 16060, 26790, 45000],
		[415, StorageProbe, 15760, 26230, 51000],
		[303, StorageProbe, 15660, 26110, 54000],
		[306, BoosterProbe.G1, 15560, 25930, 55500],
		[304, DuplicatorProbe, 15770, 26380, 55500],
		[305, StorageProbe, 15530, 25960, 64500],
		[309, StorageProbe, 15290, 25440, 73500],
		[312, BoosterProbe.G2, 15190, 25260, 73500],
		[216, StorageProbe, 15090, 24960, 76500],
		[225, DuplicatorProbe, 15115, 25035, 79500],
	] as const;

	for (const [siteId, probe, miranium, credits, storage] of data) {
		mira.get(siteId).probe = probe;

		expect(mira.getOutput()).toEqual(new Output({miranium, credits, storage}));
	}
});