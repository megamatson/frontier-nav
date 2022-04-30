import ResearchProbe from "./ResearchProbe";

test('sightseeing matches game', () => {
	for (const probe of ResearchProbe.getAll())
		expect(probe.getSightseeingRevenue(0)).toBe(0);

	const tests:[ResearchProbe, number][] = [
		[ResearchProbe.G1, 2000],
		[ResearchProbe.G2, 2500],
		[ResearchProbe.G3, 3000],
		[ResearchProbe.G4, 3500],
		[ResearchProbe.G5, 4000],
		[ResearchProbe.G6, 4500],
	];

	for (const [probe, baseSightseeingRevenue] of tests) {
		expect(probe.getSightseeingRevenue(1)).toBe(baseSightseeingRevenue);
		expect(probe.getSightseeingRevenue(2)).toBe(2 * baseSightseeingRevenue);
	}
});

test('revenue matches game', () => {
	const tests = [2.00, 2.50, 3.00, 3.50, 4.00, 4.50];

	for (let i = 0; i < tests.length; i++) {
		const test  = tests[i];
		const level = i + 1;

		expect(ResearchProbe.get(level).getCreditsOutputModifier()).toBe(test);
	}
});