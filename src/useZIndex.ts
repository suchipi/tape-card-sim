import { Entity, useNewComponent, useType } from "@hex-engine/2d";

function StorageForZIndex(index: number) {
  useType(StorageForZIndex);

  return { index };
}

export default function useZIndex(index: number) {
  useNewComponent(() => StorageForZIndex(index));
}

export function getZIndex(ent: Entity) {
  return ent.getComponent(StorageForZIndex)?.index ?? 0;
}
