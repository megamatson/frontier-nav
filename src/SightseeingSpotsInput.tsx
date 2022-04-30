import React from "react";
import { SightseeingNumber } from "./Probe";

export interface Props {
	sightseeingSpots?: SightseeingNumber,
	maxSightseeingSpots?: SightseeingNumber,

	setSightseeingSpots?(sightseeingSpots: SightseeingNumber): void;
}

export default class SightseeingSpotsInput extends React.PureComponent<Props> {
	render(): React.ReactNode {
		if (this.props.maxSightseeingSpots === undefined)
			return "0";

		if (this.props.maxSightseeingSpots <= 0)
			return "0";

		const children: React.ReactNode[] = [];
		const value = this.props.sightseeingSpots ?? 0;

		if (!this.props.setSightseeingSpots)
			return value;

		for (let i = 0; i <= (this.props.maxSightseeingSpots ?? 0); i++) {
			const id = `${i}-selector`;
			children.push(<span
				key={i}
				style={{whiteSpace: 'nowrap'}}
			>
				<input
					key={`input-${i}`}
					type="radio"
					id={id}
					value={i}
					name="sightseeing"
					checked={i === value}
					onChange={this.onChange}
				/>
				<label htmlFor={id}>{i}</label>
			</span>);
		}

		return <form style={{
			display: "flex",
			justifyContent: 'space-between'
		}}>
			{
				children
			}
		</form>;
	}

	onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.setSightseeingSpots?.(
			parseInt(e.target.value) as SightseeingNumber
		);
	};
}