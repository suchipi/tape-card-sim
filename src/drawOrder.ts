import { Canvas, Entity, Component } from "@hex-engine/2d";
import { getZIndex } from "./useZIndex";

export default function drawOrder(entities: Array<Entity>): Array<Component> {
  const components = Canvas.DrawOrder.defaultSort(entities);

  return components.sort((compA, compB) => {
    return getZIndex(compA.entity) - getZIndex(compB.entity);
  });
}
