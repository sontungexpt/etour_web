import NavigationButton from "./NavigationButton";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
	title: "Button/NavigationButton",
	component: NavigationButton,
	tags: ["autodocs"],
	argTypes: {},
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Normal = {
	args: {},
};

export const Reversed = {
	args: { isHighlighted: true },
};
