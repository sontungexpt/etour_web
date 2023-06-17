import { withRouter } from "storybook-addon-react-router-v6";
import EditTouristRouteModal from "./EditTouristRouteModal";
import React from "react";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
	title: "Modal/EditTouristRouteModal",
	component: EditTouristRouteModal,
	tags: ["autodocs"],
	argTypes: {},
	decorators: [withRouter],
	parameters: {
		reactRouter: {
			routePath: "/tourist-route/:routeId",
			routeParams: { routeId: "6411858debefbbdc107fd3f6" },
		},
	},
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Normal = () => <EditTouristRouteModal isOpen={true} />;
Normal.story = {
	parameters: {
		reactRouter: {
			routePath: "/tourist-route/:routeId",
			routeParams: { routeId: "6411858debefbbdc107fd3f6" },
		},
	},
};
