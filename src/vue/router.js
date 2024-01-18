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
import DevWorldBadges from "../components/DevWorldBadges.vue";
import DevWorldCircuit from "../components/DevWorldCircuit.vue";
import DevWorldNeon from "../components/DevWorldNeon.vue";
import DevWorldTicket from "../components/DevWorldTicket.vue";
import DevWorldStandaloneBadge from "../components/DevWorldStandaloneBadge.vue";
import ReglTextRenderer from "../components/ReglTextRenderer.vue";
import ReglSpriteRenderer from "../components/ReglSpriteRenderer.vue";
import DevWorldCardBuilder from "../pages/DevWorldCardBuilder.vue";

function nameof(component) {
  return component.__name ?? component.__file.match(/([^/\\]+)\.\w+$/)[1];
}

function quickRoute(component) {
  return {path: `/${nameof(component)}`, component, meta: {showNav: true}};
}

const components = [
  AvatarPicker,
  CanvasTextRenderer,
  DevWorldBadges,
  DevWorldCardBuilder,
  DevWorldCircuit,
  DevWorldNeon,
  DevWorldStandaloneBadge,
  DevWorldTicket,
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
  ReglSpriteRenderer,
  ReglTextRenderer,
  ReglTiltedCard,
  ReglTiltedPanel,
  SpringGraph,
];

export const routes = [
  ...components.map(quickRoute),
  { path: '/:pathMatch(.*)*', component: RouteNotFound, },
];
export const router = createRouter({history: createWebHistory(), routes});
