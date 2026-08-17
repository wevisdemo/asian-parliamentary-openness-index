export type SelectColor = 'purple' | 'gray' | 'light';

export type SelectVariant = 'compact' | 'loose';

export interface SelectOption {
	label: string;
	value: string;
}

export const selectTriggerClass =
	'inline-flex items-center gap-2 border leading-none transition-colors';

export const selectContentClass = 'z-50 overflow-y-auto border bg-white';

export const selectItemClass =
	'cursor-pointer text-left data-highlighted:bg-gray-1 data-highlighted:text-black';

export const controlHeightClasses: Record<SelectVariant, string> = {
	compact: 'h-7',
	loose: 'h-11'
};

export const triggerVariantClasses: Record<SelectVariant, string> = {
	compact: `${controlHeightClasses.compact} px-2 b4`,
	loose: `${controlHeightClasses.loose} px-5`
};

export const itemVariantClasses: Record<SelectVariant, string> = {
	compact: 'px-2 py-1 b4',
	loose: 'px-5 py-2.5'
};

export const selectColorClasses: Record<
	SelectColor,
	{ trigger: string; triggerOpen: string; panel: string; option: string }
> = {
	purple: {
		trigger: 'border-purple-5 text-purple-5 hover:bg-purple-5 hover:text-white',
		triggerOpen: 'border-purple-5 bg-purple-5 text-white',
		panel: 'border-purple-5',
		option: 'text-purple-5'
	},
	gray: {
		trigger: 'border-gray-8 text-gray-8 hover:bg-gray-8 hover:text-white',
		triggerOpen: 'border-gray-8 bg-gray-8 text-white',
		panel: 'border-gray-8',
		option: 'text-gray-8'
	},
	light: {
		trigger: 'border-gray-2 text-gray-2 hover:bg-gray-2 hover:text-black',
		triggerOpen: 'border-gray-2 bg-gray-2 text-black',
		panel: 'border-gray-2',
		option: 'text-black'
	}
};
