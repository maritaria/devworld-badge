import AvatarPicker from "../components/AvatarPicker.vue";
import {createRouter, createWebHistory} from "vue-router";
import SpringGraph from "../components/SpringGraph.vue";
import ReglTiltedPanel from "../components/ReglTiltedPanel.vue";
import ReglTiltedCard from "../components/ReglTiltedCard.vue";
import ReglRecorder from "../components/ReglRecorder.vue";
import ReglPlusLighter from "../components/ReglPlusLighter.vue";
import ReglPersonalCard from "../components/ReglPersonalCard.vue";
import ReglNeonText from "../components/ReglNeonText.vue";
import ReglMatrixRain from "../components/ReglMatrixRain.vue";
import ReglLayeringTest from "../components/ReglLayeringTest.vue";
import ReglFoil from "../components/ReglFoil.vue";
import ReglCube from "../components/ReglCube.vue";
import ReglBoxShadow from "../components/ReglBoxShadow.vue";
import ReglBadge from "../components/ReglBadge.vue";
import ReglAvatar from "../components/ReglAvatar.vue";
import LinearGradientLineExperiment from "../components/LinearGradientLineExperiment.vue";
import CanvasTextRenderer from "../components/CanvasTextRenderer.vue";
import RouteNotFound from "../components/RouteNotFound.vue";

function quickRoute(component) {
  return {path: `/${component.__name}`, component, meta: {showNav: true}};
}

const components = [
  AvatarPicker,
  CanvasTextRenderer,
  LinearGradientLineExperiment,
  ReglAvatar,
  ReglBadge,
  ReglBoxShadow,
  ReglCube,
  ReglFoil,
  ReglLayeringTest,
  ReglMatrixRain,
  ReglNeonText,
  ReglPersonalCard,
  ReglPlusLighter,
  ReglRecorder,
  ReglTiltedCard,
  ReglTiltedPanel,
  SpringGraph,
];

export const routes = [
  ...components.map(quickRoute),
  { path: '/:pathMatch(.*)*', component: RouteNotFound, },
];
console.log('routes', routes);
export const router = createRouter({history: createWebHistory(), routes});
