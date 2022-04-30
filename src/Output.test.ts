import Output from "./Output";

test('output matches parameters passed', () => {
	let params = {
		credits: 100,
		miranium: 200,
		storage: 300,
	};

	const output = new Output(params);

	expect(output.miranium).toEqual(params.miranium);
	expect(output.credits).toEqual(params.credits);
	expect(output.storage).toEqual(params.storage);

	let stringOutput = output.toString();

	expect(stringOutput.match('' + params.credits)).toBeTruthy();
	expect(stringOutput.match('' + params.miranium)).toBeTruthy();
	expect(stringOutput.match('' + params.storage)).toBeTruthy();
});

test('add', () => {
	let zero = new Output();
	const credits = 1;
	const miranium = 2;
	const storage = 3;

	let o1 = new Output({credits});
	let o2 = new Output({miranium});
	let o3 = new Output({storage});

	expect(zero.add(o1)).toEqual(o1);
	expect(o1.add(zero)).toEqual(o1);

	expect(zero.add(o2)).toEqual(o2);
	expect(o2.add(zero)).toEqual(o2);
	
	expect(zero.add(o3)).toEqual(o3);
	expect(o3.add(zero)).toEqual(o3);

	expect(o1.add(o2)).toEqual(o2.add(o1));
	expect(o1.add(o2)).toEqual(new Output({
		credits, miranium
	}));

	expect(o1.add(o2).add(o3)).toEqual(o3.add(o2).add(o1));
	expect(o1.add(o2).add(o3)).toEqual(new Output({miranium, credits, storage}));
});