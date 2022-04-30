import MiningProbe from "./MiningProbe";
import Probe from "./Probe";
import * as Sets from './Set';

test('mining probes matches game', () => {
	const tests: [MiningProbe, number][] = [
		[MiningProbe.G1, 1],
		[MiningProbe.G2, 1.20],
		[MiningProbe.G3, 1.40],
		[MiningProbe.G4, 1.60],
		[MiningProbe.G5, 1.80],
		[MiningProbe.G6, 2.00],
		[MiningProbe.G7, 2.20],
		[MiningProbe.G8, 2.40],
		[MiningProbe.G9, 2.70],
		[MiningProbe.G10, 3.00],
	];

	for (const [probe, miningPercent] of tests) {
		expect(probe.getCreditsOutputModifier()).toBe(0.3);
		expect(probe.getMiraniumOutputModifier()).toBeCloseTo(miningPercent);
		expect(probe.getStorageOutput()).toBe(0);
		for (const i of [0, 1, 2])
			expect(probe.getSightseeingRevenue(i)).toBe(0);

		for (const i of [-1, 3])
			expect(() => probe.getSightseeingRevenue(i)).toThrow();
	}
});

test('MiningProbe is registered', () => {
	expect(Probe.probeClasses.has(MiningProbe)).toBeTruthy();
});

test('get', () => {
	for (const probe of MiningProbe.getAll())
		expect(MiningProbe.get(probe.getName())).toBe(probe);
});

test('get all', () => {
	const manualSet = new Set([
		MiningProbe.G1,
		MiningProbe.G2,
		MiningProbe.G3,
		MiningProbe.G4,
		MiningProbe.G5,
		MiningProbe.G6,
		MiningProbe.G7,
		MiningProbe.G8,
		MiningProbe.G9,
		MiningProbe.G10
	]);

	expect(Sets.equals(manualSet, new Set(MiningProbe.getAll()))).toBeTruthy();
});