import Grade from "./Grade";

test('getAll is ordered correctly', () => {
	expect(Grade.getAll()).toEqual([
		Grade.S,
		Grade.A,
		Grade.B,
		Grade.C,
		Grade.D,
		Grade.E,
		Grade.F
	]);
});

test('get', () => {
	const tests: [Grade, string][] = [
		[Grade.S, 'S'],
		[Grade.A, 'A'],
		[Grade.B, 'B'],
		[Grade.C, 'C'],
		[Grade.D, 'D'],
		[Grade.E, 'E'],
		[Grade.F, 'F'],
	];

	for (const [grade, letter] of tests) {
		const actualGrade = Grade.get(letter);

		expect(actualGrade).toBe(grade);
		expect(actualGrade.letter).toEqual(letter.toUpperCase());
	}
});

test('get with lowercase letters', () => {
	for (const grade of Grade.getAll())
		expect(Grade.get(grade.letter.toLowerCase())).toBe(grade);
});

test('get mining', () => {
	expect(new Set(Grade.getAllMining())).toEqual(
		new Set(Grade.getAll().filter(g => g.isMining()))
	);
});

test('get revenue', () => {
	expect(new Set(Grade.getAllRevenue())).toEqual(
		new Set(Grade.getAll().filter(g => g.isRevenue()))
	);
});

test('get combat', () => {
	expect(new Set(Grade.getAllCombat())).toEqual(
		new Set(Grade.getAll().filter(g => g.isCombat()))
	);
});