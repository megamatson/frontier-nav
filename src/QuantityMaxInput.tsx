import React from "react";
import NaturalNumberInput from "./NaturalNumberInput";

export interface Props {
	max?: number;
	number?: number;

	setMax?(n: number): void;
	//setNumber?(n: number): void;
}

export default class QuantityMaxInput extends React.PureComponent<Props> {
	render(): React.ReactNode {
		const {max} = this.props;
		const number = this.props.number ?? 0;

		const numberElement = (max !== undefined && number > max) ?
			<span style={{color: "red"}}>{number}</span> :
			number
		;

		if (this.props.setMax) {
			return <span>
				{numberElement}/{<NaturalNumberInput
					number={max}
					set={this.props.setMax}
				/>}
			</span>;
		} else if (max === Infinity || max === undefined)
			return <span>{number}</span>;
		else
			return <span>{numberElement}/{max}</span>;
	}
}