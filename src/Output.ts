export interface OutputInterface {
	miranium: number;
	storage: number;
	credits: number;
}

export default class Output implements OutputInterface {
	credits: number;
	miranium: number;
	storage: number;

	constructor(args?: Partial<OutputInterface>) {
		this.credits = args?.credits ?? 0;
		this.miranium = args?.miranium ?? 0;
		this.storage = args?.storage ?? 0;
	}

	toString() {
		let lines: string[] = [];

		if (this.credits)
			lines.push(`Credits: ${this.credits}`);

		if (this.miranium)
			lines.push(`Miranium: ${this.miranium}`);

		if (this.storage)
			lines.push(`Storage: ${this.storage}`);

		return lines.length === 0 ? 'No output' : lines.join('\n');
	}

	add(o: Output): Output {
		return new Output({
			storage:  this.storage + o.storage,
			miranium: this.miranium + o.miranium,
			credits:  this.credits + o.credits,
		});
	}

	addToSelf(o: Output): this {
		this.credits += o.credits;
		this.storage += o.storage;
		this.miranium += o.miranium;
		return this;
	}
}