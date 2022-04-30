export function* randomIterator(): Generator<number, never, never> {
	while (true) {
		const radius = Math.sqrt(-2 * Math.log(Math.random()));
		const angle = Math.random() * 2 * Math.PI;

		const x = radius * Math.cos(angle);
		const y = radius * Math.sin(angle);

		yield x;
		yield y;
	}
}

const gaussianGenerator = randomIterator();
export default function random(): number {
	return gaussianGenerator.next().value;
}