import _ from "lodash";

export function casefold(name: string): string {
	return name
		.replace(/[\s-]+/g, ' ')
		.trim()
		.toLowerCase()
	;
}

export default class FlyweightHelper<T> {
	private instances: Set<T> = new Set();
	private aliasMap: Map<any, T> = new Map();

	getAll(): T[] {
		return Array.from(this.instances);
	}

	get(alias: any): T {
		if (this.instances.has(alias))
			return alias;

		const ret = this.aliasMap.get(_.isString(alias) ? casefold(alias) : alias);

		if (ret === undefined)
			throw new Error(`Instance with name "${alias}" not found`);

		return ret;
	}

	private associateString(instance: T, name: string) {
		const casefoldedName = casefold(name);
		const associatedInstance = this.aliasMap.get(casefoldedName);

		if (associatedInstance !== undefined && associatedInstance !== instance)
			throw new Error(
				`"${name}" already associated with an object:
				${associatedInstance}`
			);

		this.aliasMap.set(casefoldedName, instance);
	}

	private associateObject(instance: T, alias: any) {
		const associatedInstance = this.aliasMap.get(alias);

		if (associatedInstance !== undefined && associatedInstance !== instance)
			throw new Error(
				`"${alias}" already associated with an object:
				${associatedInstance}`
			);

		this.aliasMap.set(alias, instance);
	}

	add(instance: T, ...aliases: any[]) {
		this.instances.add(instance);

		let badAliases: any[] = [];
		for (const alias of aliases) {
			try {
				if (_.isString(alias))
					this.associateString(instance, alias);
				else
					this.associateObject(instance, alias);
			} catch (e) {
				badAliases.push(alias);
			}
		}
		if (badAliases.length > 0)
			throw badAliases;
	}
}