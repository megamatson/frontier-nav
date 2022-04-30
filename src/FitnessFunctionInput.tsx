import _ from "lodash";
import React from "react";
import { FitnessFunction } from "./FitnessFunction";
import Mira from "./Mira";
import NaturalNumberInput from "./NaturalNumberInput";
import Output from "./Output";

export interface FitnessFunctionParameters {
	targetStorage: number,
	storageToMiranium: number,
	targetCredits: number,
}

export type Props = {
	disabled?: boolean;

	setData?(
		data: Partial<FitnessFunctionParameters> & {
			fitnessFunction: FitnessFunction
		}): void;
} & FitnessFunctionParameters;

export function getFitnessFunction(
	params: FitnessFunctionParameters
): FitnessFunction {
	const {storageToMiranium, targetCredits, targetStorage} = params;


	const ret: FitnessFunction = function(output: Output): number {
		let targetMiranium = _.clamp(
			output.storage / storageToMiranium,
			0,
			targetStorage
		);

		if (_.isNaN(targetMiranium))
			targetMiranium = 0;

		const fulfilledStorage = _.clamp(output.storage, targetStorage);
		return Math.round(
			_.clamp(output.miranium - targetMiranium, 0, output.storage)
			+ 500 * fulfilledStorage
			+ 100 * (
				fulfilledStorage * (
					_.clamp(output.miranium, targetMiranium) / targetMiranium
				)
			) + _.clamp(output.credits, targetCredits) * 200
			+ Math.max(0, output.credits - targetCredits)
		);
	};

	return ret;
}


export default class FitnessFunctionInput extends React.Component<Props> {
	constructor(props: Props) {
		super(props);

		this.state = {
			targetStorage: Mira.baseStorage,
			storageToMiranium: 2,
			targetCredits: Infinity,
		};
	}

	render(): React.ReactNode {
		return <form>
			<div>
				<label>Target Storage: </label>
				<NaturalNumberInput
					number={this.props.targetStorage}
					set={this.setTargetStorage}
					blankValue={Infinity}
					disabled={this.props.disabled}
				></NaturalNumberInput>
			</div>

			<div>
				<label>Cycles to Fill Storage: </label>
				<input
					type={'number'}
					value={this.props.storageToMiranium}
					onChange={e => this.setStorageToMiranium(parseFloat(e.target.value))}
					disabled={this.props.disabled}
				/>
			</div>
			<div>
				<label>Target Credits: </label>
				<NaturalNumberInput
					number={this.props.targetCredits}
					set={this.setTargetCredits}
					blankValue={Infinity}
					disabled={this.props.disabled}
				/>
			</div>
		</form>;
	}

	// componentDidMount() {
	// 	this.props.setData?.({ fitnessFunction: getFitnessFunction(this.props) });
	// }

	setTargetStorage = (targetStorage: number) => {
		if (!this.props.setData)
			return;

		const newProps = {...this.props, targetStorage};
		this.props.setData({
			targetStorage,
			fitnessFunction: getFitnessFunction(newProps),
		});
	};

	setStorageToMiranium = (storageToMiranium: number) => {
		if (storageToMiranium <= 0 || !this.props.setData)
			return;

		const newProps = {...this.props, storageToMiranium};
		this.props.setData({
			storageToMiranium,
			fitnessFunction: getFitnessFunction(newProps)
		});
	};

	setTargetCredits = (targetCredits: number) => {
		if (!this.props.setData)
			return;

		const newProps = {...this.props, targetCredits};
		this.props.setData({
			targetCredits,
			fitnessFunction: getFitnessFunction(newProps)
		});
	};
}