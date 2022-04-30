import React from "react";
import DeltaComponent from "./DeltaComponent";

interface IndividualComponents {
	storage?: number,
	credits?: number,
	miranium?: number,
	fitness?: number,
}

export interface Props {
	current: IndividualComponents,
	new?: IndividualComponents,
}

export default class OutputComponent extends React.Component<Props> {
	// not sure if this is the best way to do this,
	// but I couldn't get it to work right with State
	previousProps: Required<Props['current']>;

	constructor(props: Props) {
		super(props);

		this.previousProps = {
			credits: props.current.credits ?? 0,
			miranium: props.current.miranium ?? 0,
			storage: props.current.storage ?? 0,
			fitness: props.current.fitness ?? 0,
		};
	}

	isNew(prop: keyof IndividualComponents): boolean {
		if (!this.props.new)
			return false;

		const newValue = this.props.new[prop];
		return (
			newValue !== undefined
			&& newValue !== this.props.current[prop]
		);
	}

	hasNewProperties() {
		return (
			this.isNew('credits')
			|| this.isNew('fitness')
			|| this.isNew('miranium')
			|| this.isNew('storage')
		);
	}


	render(): React.ReactNode {
		type DataRenderer = {
			header: (
				props: Required<IndividualComponents>,
			) => string,
			data: (
				props: Required<IndividualComponents>,
				previousProps: Required<IndividualComponents>,
				newProps: Props['new'],
				isNewRow: boolean
			) => React.ReactNode,
		};

		const propertyAndDeltaShower = (
			key: keyof Required<IndividualComponents>
		): DataRenderer['data'] => {
			return (current, previous, newInfo, isNewRow) => {
				if (!isNewRow) {
					const currentValue = current[key];
					const oldValue = previous?.[key] ?? current;
					const difference = currentValue - oldValue;

					return <span>
						{currentValue} <DeltaComponent delta={difference}/>
					</span>;
				} else {
					if (!this.isNew(key))
						return undefined;

					const currentInfo = current[key];
					const newValue = newInfo![key]!;
					const difference = newValue - currentInfo;

					return <span>
						{newValue} <DeltaComponent delta={difference}/>
					</span>;
				}
			};
		};

		const rowNameKey = 'rowName';

		const dataRenderers:
			Record<
				keyof Required<IndividualComponents>|typeof rowNameKey,
				DataRenderer
			> =
		{
			rowName: {
				header: () => "",
				data: (_1, _2, _3, isNewRow) => {
					if (isNewRow)
						return "New";
					return "Current";
				}
			},
			credits: {
				header: () => "Credits",
				data: propertyAndDeltaShower('credits'),
			},

			miranium: {
				header: () => "Miranium",
				data: propertyAndDeltaShower('miranium'),
			},

			storage: {
				header: () => "Storage",
				data: propertyAndDeltaShower('storage'),
			},

			fitness: {
				header: () => 'Fitness',
				data: propertyAndDeltaShower('fitness'),
			}
		} as const;


		const presentDataRenderers = [];
		const hasNewProperties = this.hasNewProperties();

		if (hasNewProperties)
			presentDataRenderers.push(dataRenderers.rowName);

		for (const key in dataRenderers) {
			if (!dataRenderers.hasOwnProperty(key))
				continue;

			const datum = this.props.current[key as keyof IndividualComponents];

			if (datum !== undefined)
				presentDataRenderers.push(dataRenderers[
					key as keyof typeof dataRenderers
				]);
		}

		if (presentDataRenderers.length === 0)
			return;

		const ret = <table>
			<thead>
				<tr>{
					presentDataRenderers.map((renderers) => {
						const header = renderers.header(
							this.props.current as Required<IndividualComponents>,
						);
						return <th key={header}>{header}</th>;
					})
				}</tr>
			</thead>
			<tbody>
				<tr>{
					presentDataRenderers.map((renderers) => {
						const header = renderers.header(
							this.props.current as Required<IndividualComponents>,
						);
						return <td key={header}>{
							renderers.data(
								this.props.current as Required<IndividualComponents>,
								this.previousProps,
								this.props.new,
								false,
							)
						}</td>;
					})
				}</tr>
				{
					hasNewProperties ?
						<tr>{
							presentDataRenderers.map(renderers => {
								const header = renderers.header(
									this.props.new as Required<IndividualComponents>
								);

								return <td key={header}>{
									renderers.data(
										this.props.current as Required<IndividualComponents>,
										this.previousProps,
										this.props.new,
										true,
									)
								}</td>;
							})
						}</tr> :
						undefined
				}
			</tbody>
		</table>;

		this.previousProps = {
			credits: this.props.current.credits ?? this.previousProps.credits,
			miranium: this.props.current.miranium ?? this.previousProps.miranium,
			storage: this.props.current.storage ?? this.previousProps.storage,
			fitness: this.props.current.fitness ?? this.previousProps.fitness,
		};

		return ret;
	}
}