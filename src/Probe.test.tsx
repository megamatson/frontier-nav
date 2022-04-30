import BasicProbe from './BasicProbe';
import MiningProbe from './MiningProbe';
import NoProbe, { NoProbeClass } from './NoProbe';
import Probe, {ProbeClass, probeNameFromClass} from './Probe';
import ResearchProbe from './ResearchProbe';

test('probe name from class name', () => {
	const tests: [string | ProbeClass, string][] = [
		['Hi', 'Hi'],
		['test', 'Test'],
		['hiThere', 'Hi There'],
		['HiThere', 'Hi There'],
		['', ''],
		['a', 'A'],
		['A', 'A'],
		['MiningProbe', 'Mining Probe'],
	];

	for (const [input, expected] of tests)
		expect(probeNameFromClass(input)).toBe(expected);
});

test('get', () => {
	const throws = [-1, 'error'];
	const tests = new Map<Probe, any[]>([
		[MiningProbe.G1, [
			'Mining Probe G1',
			'mining probe g1',
			'mining probe 1',
			'mInInG 1',
			'mining g1'
		]],
		[NoProbe, [0, undefined, 'no probe', '', null]],
		[BasicProbe, ['basic', 'basic probe']],
		[ResearchProbe.G1, [
			'research probe g1',
			'research g1',
			'research 1',
			'research probe 1'
		]],
	]);

	for (const [expectedProbe, aliases] of tests)
		for (const alias of aliases)
			expect(Probe.get(alias)).toBe(expectedProbe);

	for (const throwingAlias of throws)
		expect(() => Probe.get(throwingAlias)).toThrow();
});


test('getProbeClassOf', () => {
	expect(Probe.getClassOf(NoProbe)).toBe(NoProbeClass);
	expect(Probe.getClassOf(ResearchProbe.G1)).toBe(ResearchProbe);
});