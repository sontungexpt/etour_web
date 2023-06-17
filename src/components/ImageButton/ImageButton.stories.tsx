import ImageButton from "./ImageButton";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
	title: "Button/ImageButton",
	component: ImageButton,
	tags: ["autodocs"],
	argTypes: {
		backgroundColor: { control: "color" },
		color: { control: "color" },
		reversed: { control: "boolean" },
	},
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Normal = {
	args: {},
};

export const Reversed = {
	args: { reversed: true },
};
