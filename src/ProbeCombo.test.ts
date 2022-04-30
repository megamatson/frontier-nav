import getProbeComboModifier from "./ProbeCombo";

test('probe combo matches game', () => {
	const tests: Map<number, number> = new Map([
		[0, 1],
		[1, 1],
		[2, 1],
		[3, 1.30],
		[4, 1.30],
		[5, 1.50],
		[6, 1.50],
		[7, 1.50],
		[8, 1.80],
		[9, 1.80],
		[10, 1.80],
	]);

	tests.forEach((multiplier, chainSize) =>
		expect(getProbeComboModifier(chainSize)).toEqual(multiplier)
	);
});

test('invalid probe combo throws', () => {
	expect(() => getProbeComboModifier(-1)).toThrow();
	expect(() => getProbeComboModifier(1.1)).toThrow();
	expect(() => getProbeComboModifier(NaN)).toThrow();
	expect(() => getProbeComboModifier(Infinity)).toThrow();
});