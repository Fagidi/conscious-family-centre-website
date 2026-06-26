import { definePlugin } from "sanity";
import { BarChartIcon } from "@sanity/icons";
import { CampDashboard } from "./CampDashboard";

export const campDashboardPlugin = definePlugin({
  name: "camp-dashboard",
  tools: [
    {
      name: "camp-dashboard",
      title: "Camp Dashboard",
      icon: BarChartIcon,
      component: CampDashboard,
    },
  ],
});
