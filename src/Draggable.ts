import {
  useType,
  useNewComponent,
  Geometry,
  Mouse,
  Vector,
  LowLevelMouse,
  useUpdate,
} from "@hex-engine/2d";

export default function Draggable(
  geometry: ReturnType<typeof Geometry>,
  smoothFactor: number = 5
) {
  useType(Draggable);

  const mouse = useNewComponent(Mouse);
  const { onCanvasLeave } = useNewComponent(LowLevelMouse);

  let isDragging = false;
  const startedDraggingAt = new Vector(0, 0);

  mouse.onDown((event) => {
    isDragging = true;
    startedDraggingAt.mutateInto(event.pos);
  });

  const offset = new Vector(0, 0);
  const smoothedOffset = new Vector(0, 0);
  const speed = Math.min(1, 1 / smoothFactor);

  mouse.onMove((event) => {
    if (isDragging) {
      offset.mutateInto(event.pos);
      offset.subtractMutate(startedDraggingAt);
    }
  });

  useUpdate(() => {
    if (Math.abs(offset.x) > 0.01 || Math.abs(offset.y) > 0.01) {
      smoothedOffset.mutateInto(offset);
      smoothedOffset.multiplyMutate(speed);

      geometry.position.addMutate(smoothedOffset);

      offset.subtractMutate(smoothedOffset);
    }
  });

  const onUpHandler = () => {
    isDragging = false;
  };
  mouse.onUp(onUpHandler);
  onCanvasLeave(onUpHandler);

  return {
    get isDragging() {
      return isDragging;
    },
  };
}
