import produce from "immer";
import _ from "lodash";
import React, { ChangeEventHandler } from "react";

export interface Props {
	/**
	 * The value of the number if the field becomes blank. Defaults to 0.
	 */
	blankValue?: number,
	number?: number,
	set(n: number): void
	disabled?: boolean
}

interface State {
	numberText: string
}

export default class NaturalNumberInput extends React.Component<
	Props,
	State
> {
	constructor(props: Props) {
		super(props);

		this.state = {
			numberText: props.number === undefined || !_.isInteger(props.number) ?
				'' :
				props.number.toString()
		};
	}


	stateValue(stateText: string) {
		return stateText === '' ?
			this.props.blankValue ?? 0 :
			(parseFloat(stateText) || 0)
		;
	}

	// static getDerivedStateFromProps(props: Props, state: State) {
	// 	let value = props.number ?? props.blankValue ?? 0;
	// 	let stateValue = state.numberText === '' ?
	// 		props.blankValue ?? 0 :
	// 		(parseFloat(state.numberText) || 0)
	// 	;

	// 	let text: string;

	// 	if (value !== stateValue) {
	// 		text = value.toString();
	// 		if (value === Infinity)
	// 			text = '';

	// 		console.log('new text:', text);
	// 		return null;
	// 		return {numberText: text};
	// 	} else
	// 		return null;
	// }

	render(): React.ReactNode {
		return <input
			type={"number"}
			value={this.state.numberText}
			onInput={this.handleInput}
			disabled={this.props.disabled}
		/>;

	}

	private handleInput: ChangeEventHandler<HTMLInputElement> = e => {
		const text = e.target.value;

		if (text.match(/^\d*$/)) {
			this.setState(produce<State>(draft => {
				draft.numberText = text;
			}));

			if (text === '')
				return this.props.set(this.props.blankValue ?? 0);

			const value = parseInt(text);
			if (_.isInteger(value) && value >= 0)
				this.props.set(value);
		} else {
			e.preventDefault();
		}
	};
}