import noProbe, { NoProbeClass } from "./NoProbe";
import Probe from "./Probe";
import * as Sets from './Set';

test('all zero', () => {
	for (const i of [0, 1, 2])
		expect(noProbe.getSightseeingRevenue(i)).toBe(0);

	expect(noProbe.getCreditsOutputModifier()).toBe(0);
	expect(noProbe.getMiraniumOutputModifier()).toBe(0);
	expect(noProbe.getStorageOutput()).toBe(0);
});

test('Probe has NoProbe registered', () => {
	expect(Probe.probeClasses.has(NoProbeClass)).toBeTruthy();
});

test('get', () => {
	for (const alias of [0, noProbe.getName(), undefined])
		expect(NoProbeClass.get(alias)).toBe(noProbe);
});

test('get all', () => {
	const manualSet = new Set([noProbe]);

	expect(Sets.equals(manualSet, new Set(NoProbeClass.getAll()))).toBeTruthy();
});