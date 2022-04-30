import BasicProbe, { BasicProbeClass } from "./BasicProbe";
import Probe from "./Probe";

test('matches wiki', () => {
	expect(BasicProbe.getCreditsOutputModifier()).toBe(.5);
	expect(BasicProbe.getMiraniumOutputModifier()).toBe(.5);

	for (const i of [0, 1, 2])
		expect(BasicProbe.getSightseeingRevenue(i)).toBe(0);

	expect(BasicProbe.getStorageOutput()).toBe(0);
});

test('Probe has BasicProbe registered', () => {
	expect(Probe.probeClasses.has(BasicProbeClass)).toBeTruthy();
});

test('get', () => {
	const tests = ['basic', 'basic probe'];

	for (const test of tests)
		expect(BasicProbeClass.get(test)).toBe(BasicProbe);
});

test('get all', () => {
	const manualSet = new Set([BasicProbe]);

	expect(new Set(BasicProbeClass.getAll())).toEqual(manualSet);
});