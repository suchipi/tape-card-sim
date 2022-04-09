import {
  useType,
  useNewComponent,
  Geometry,
  Mouse,
  Vector,
  LowLevelMouse,
} from "@hex-engine/2d";

export default function Draggable(geometry: ReturnType<typeof Geometry>) {
  useType(Draggable);

  const mouse = useNewComponent(Mouse);
  const { onCanvasLeave } = useNewComponent(LowLevelMouse);

  let isDragging = false;
  const startedDraggingAt = new Vector(0, 0);

  mouse.onDown((event) => {
    isDragging = true;
    startedDraggingAt.mutateInto(event.pos);
  });

  const diffVec = new Vector(0, 0);

  mouse.onMove((event) => {
    if (isDragging) {
      diffVec.mutateInto(event.pos);
      diffVec.subtractMutate(startedDraggingAt);

      geometry.position.addMutate(diffVec);
    }
  });

  const onUpHandler = () => {
    isDragging = false;
  };
  mouse.onUp(onUpHandler);
  onCanvasLeave(onUpHandler);
}
