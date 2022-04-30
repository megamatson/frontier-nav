import Output from "./Output";

export type FitnessFunction = Function & {
	(output: Output): number
}