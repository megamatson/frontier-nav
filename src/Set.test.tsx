import * as Sets from './Set';
const emptySet = new Set();
const setA = new Set([1, 2, 3]);
const setB = new Set(["wow", "cool"]);
const setC = new Set([1, 'mixed types']);
const allSets = [emptySet, setA, setB, setC];
const nontrivialCollections: any[][] = [
	[[1], [2]],
	[['t'], [1]],
	[[1], [2], [3]],
	[[1], [1], [2]],
	[[1], [1]],
	[[1, 2, 3], [1, 2], [2, 3]],
]

test('set equals', () => {
	const tests: [any[], any[], boolean][] = [
		[[], [], true],
		[[1], [2], false],
		[[1], [1], true],
		[[2], [1], false],
		[[1, 2], [1], false],
		[[1, 2], [2, 1], true],
		[[1], [""], false],
	];

	for (let [a, b, expected] of tests) {
		const setA = new Set(a);
		const setB = new Set(b);
		let aToB = Sets.equals(setA, setB);
		let bToA = Sets.equals(setB, setA);

		expect(aToB === bToA).toBe(true);
		expect(aToB).toBe(expected);
	}
});

describe('set union', () => {
	test('empty union', () => {
		const emptyUnion = Sets.union();
		expect(emptyUnion.size).toBe(0);
		expect(Sets.equals(emptySet, emptyUnion)).toBe(true);
	});

	test('self union', () => {
		const tests = allSets;

		for (const test of tests) {
			let selfUnion = Sets.union(test);
			expect(Sets.equals(selfUnion, test)).toBe(true);

			selfUnion = Sets.union(test, test);
			expect(Sets.equals(selfUnion, test)).toBe(true);
		}
	});

	test('identity union', () => {
		const tests = allSets;

		for (const test of tests) {
			let idUnion = Sets.union(test, emptySet);
			let idUnionReversed = Sets.union(emptySet, test);
			expect(Sets.equals(idUnion, test)).toBe(true);
			expect(Sets.equals(idUnion, idUnionReversed)).toBe(true);
		}
	});

	test('nontrivial unions', () => {
		const tests: any[][] = nontrivialCollections;

		for (let arrays of tests) {
			const sets = arrays.map(v => new Set(v));
			const union = Sets.union(...sets);
			const unionReversed = Sets.union(...sets.reverse());

			expect(Sets.equals(union, unionReversed)).toBe(true);

			// all elements of the unioned sets should be found in the union
			for (const set of sets)
				for (const elem of set)
					expect(union.has(elem)).toBe(true);

			// all elements of the union should be found in the constituent sets
			for (const elem of union)
				expect(sets.some(v => v.has(elem))).toBe(true);
		}
	});
});

describe('set intersection', () => {
	test('empty intersect', () => {
		const emptyIntersect = Sets.intersection();
		expect(emptyIntersect.size).toBe(0);
		expect(Sets.equals(emptyIntersect, emptySet)).toBe(true);
	});

	test('self intersect', () => {
		const tests = allSets;

		for (const test of tests) {
			let selfIntersect = Sets.intersect(test);
			expect(Sets.equals(selfIntersect, test)).toBe(true);
			selfIntersect = Sets.intersect(test, test);
			expect(Sets.equals(selfIntersect, test)).toBe(true);
		}
	});

	test('zero intersect', () => {
		const tests = allSets;

		for (const test of tests) {
			const zeroIntersect = Sets.intersect(test, emptySet);
			expect(Sets.equals(zeroIntersect, emptySet)).toBe(true);
		}
	});

	test('nontrivial intersect', () => {
		const tests = nontrivialCollections;

		for (let test of tests) {
			const sets = test.map(v => new Set(v));
			const intersect = Sets.intersect(...sets);

			for (const elem in intersect)
				expect(sets.every(v => v.has(elem))).toBe(true);

			const union = Sets.union(...sets);
			for (const elem in union)
				expect(intersect.has(elem) ? true : sets.some(v => !v.has(elem))).toBe(true);
		}
	})
});

describe('set difference', () => {
	test('empty difference', () => {
		const tests = allSets;

		for (const test of tests) {
			let emptyDifference = Sets.difference(test);
			expect(Sets.equals(emptyDifference, test)).toBe(true);
			emptyDifference = Sets.difference(test, emptySet);
			expect(Sets.equals(emptyDifference, test)).toBe(true);
			emptyDifference = Sets.difference(emptySet, test);
			expect(Sets.equals(emptySet, emptyDifference)).toBe(true);
		}
	});

	test('self difference', () => {
		const tests = allSets;

		for (const test of tests) {
			let selfDifference = Sets.difference(test, test);
			expect(Sets.equals(selfDifference, emptySet)).toBe(true);
		}
	});
});