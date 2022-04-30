import FlyweightHelper, { casefold } from "./Flyweight";
import * as Sets from './Set';

test('casefold equivalences', () => {
	const equivalenceClasses = [
		['a', 'A', ' A ', '-a-', '  A  ', ' - a- -'],
		['a b', 'a  b', ' a  b ', '- a-b- ', '-A--B- ', ' - A - B - '],
	];

	for (const test of equivalenceClasses) {
		for (let start = 0; start < test.length - 1; start++) {
			const first = test[start];
			for (let i = start + 1; i < test.length; i++) {
				const second = test[i];
				expect(casefold(first)).toBe(casefold(second));
			}
		}
	}
});

test('add & getAll', () => {
	let helper = new FlyweightHelper<number>();

	expect(helper.getAll().length).toBe(0);

	function all() {
		return new Set(helper.getAll());
	}

	helper.add(1, '1', 'one', 'I', 1);
	expect(helper.getAll().length).toBe(1);
	expect(Sets.equals(all(), new Set([1]))).toBeTruthy();

	helper.add(2, 'two');
	expect(helper.getAll().length).toBe(2);
	expect(Sets.equals(all(), new Set([1, 2]))).toBeTruthy();

	helper.add(2, 'II');
	expect(helper.getAll().length).toBe(2);
	expect(Sets.equals(all(), new Set([1, 2]))).toBeTruthy();

	helper.add(3, 'three');
	expect(helper.getAll().length).toBe(3);
	expect(Sets.equals(all(), new Set([1, 2, 3]))).toBeTruthy();
});

test('add & get', () => {
	const helper = new FlyweightHelper<number>();

	const flyweights: [number, ...string[]][] = [
		[1, '1', 'one', 'I'],
		[2, '2', 'two', 'II'],
		[3, '3', 'three', 'III'],
		[4, '4', 'four', 'IIII', 'IV'],
	];

	for (const [flyweight, ...aliases] of flyweights) {
		helper.add(flyweight, ...aliases);
		expect(helper.get(flyweight)).toBe(flyweight);
		
		for (const alias of aliases) {
			expect(helper.get(alias)).toBe(flyweight);
		}

		expect(() => helper.get(0)).toThrow();
	}

	for (let [singleton, ...partialAliases] of flyweights) {
		const aliases = [singleton, ...partialAliases];
		for (const alias of aliases) {
			expect(helper.get(alias)).toBe(singleton);
		}
	}

	expect(() => helper.add(4, '1')).toThrow();
	expect(() => helper.add(1, '1')).not.toThrow();
});

test('add with redundant', () => {

});