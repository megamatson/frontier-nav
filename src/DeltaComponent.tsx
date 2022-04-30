import React from "react";

export interface Props {
	delta?: number
}

export default class DeltaComponent extends React.PureComponent<Props> {
	render(): React.ReactNode {
		return this.props.delta ?
			[
				"(",
				<span
					style={{color: this.props.delta > 0 ? 'greenyellow': 'red'}}
					key={this.props.delta}
				>
					{this.props.delta}
				</span>,
				")"
			] :
			undefined
		;
	}
}