export function isSuperSet<T>(set: Set<T>, subset: Set<T>) {
	for (let elem of subset)
		if (!set.has(elem))
			return false;

	return true;
}

export function union<T>(...sets: Set<T>[]): Set<T> {
	if (sets.length === 0)
		return new Set();

	let _union = new Set(sets[0]);

	for (let i = 1; i < sets.length; i++) {
		const set = sets[i];

		for (let elem of set)
			_union.add(elem);
	}

	return _union;
}

export function intersection<T>(...sets: Set<T>[]): Set<T> {
	if (sets.length === 0)
		return new Set();

	sets = sets.sort((a, b) => a.size - b.size);

	let _intersection = new Set(sets[0]);

	for (let i = 1; i < sets.length; i++) {
		if (_intersection.size === 0)
			break;

		let set = sets[i];
		
		for (let elem of _intersection)
			if (!set.has(elem))
				_intersection.delete(elem);
	}
	
	return _intersection;
}

/** @borrows intersection as intersect */
export const intersect = intersection;

/**
 * inclusiveSymmetricDifference(a, b, c) =
 * { x : x in union(a, b, c) and x not in intersect(a, b, c)}
 **/
export function inclusiveSymmetricDifference<T>(
	...sets: Set<T>[]
): Set<T> {
	return difference(union(...sets), intersect(...sets));
}

/**
 * exclusiveSymmetricDifference(a, b, c) = 
 * {x : x in a xor x in b xor x in c}
 * 
 * where xor(bools[]) = whether only 1 in bools is true
 */
export function exclusiveSymmetricDifference<T>(
	...sets: Set<T>[]
): Set<T> {
	if (sets.length === 0)
		return new Set();

	let difference = new Set(sets[0]);
	let excluded = new Set();

	for (let i = 1; i < sets.length; i++) {
		const set = sets[i];

		for (const elem of set) {
			if (difference.delete(elem))
				excluded.add(elem);
			else if (!excluded.has(elem))
				difference.add(elem);
		}
	}

	return difference;
}

/**
 * difference(a, b, c) =
 * { x : x in a and (x not in b or x not in c) }
 */
export function difference<T, U>(
	sourceSet: Set<T>,
	...excludeSets: Set<T|U>[]
): Set<T> {
	let _difference = new Set(sourceSet);

	for (const excludeSet of excludeSets) {
		if (_difference.size === 0)
			return _difference;

		for (let elem of _difference)
			if (excludeSet.has(elem))
				_difference.delete(elem);
	}

	return _difference;
}

export function equals<T>(setA: Set<T>, setB: Set<T>): boolean {
	if (setA.size !== setB.size)
		return false;

	for (let elem of setA) {
		if (!setB.has(elem))
			return false;
	}

	return true;
}