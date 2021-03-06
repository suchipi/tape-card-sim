import {
  useType,
  useNewComponent,
  Geometry,
  Polygon,
  Vector,
  useDraw,
  useChild,
  Mouse,
} from "@hex-engine/2d";
import { Settings } from "./settings";
import useZIndex from "./useZIndex";

const vec = (x: number, y: number) => new Vector(x, y);

function Rect(position: Vector, size: Vector, color: string) {
  useType(Rect);

  const geometry = useNewComponent(() =>
    Geometry({
      shape: Polygon.rectangle(size),
      position: position.clone(),
    })
  );

  useDraw((context) => {
    context.fillStyle = color;
    geometry.shape.draw(context, "fill");
  });

  return {
    geometry,
  };
}

export function CardReaderBack(position: Vector) {
  useType(CardReaderBack);

  useZIndex(-1);

  const { geometry } = useNewComponent(() =>
    Rect(position.subtractY(200), vec(1010, 200), "#b8b0a9")
  );

  useChild(() => Rect(vec(0, -60), vec(1024, 100), "#d0c9c3"));

  return { geometry };
}

export function CardReaderFront(
  position: Vector,
  settings: Settings,
  addCard: () => void
) {
  useType(CardReaderFront);

  useZIndex(1);

  const { geometry } = useNewComponent(() =>
    Rect(position, vec(1024, 400), "#d0c9c3")
  );

  // The little buttons
  const addButton = useChild(() => {
    useZIndex(2);
    return Rect(vec(34, 105), vec(60, 100), "#bc75ff");
  });
  const reverseButton = useChild(() => {
    useZIndex(2);
    return Rect(vec(116, 105), vec(60, 100), "#ea2c3e");
  });
  const slowButton = useChild(() => {
    useZIndex(2);
    return Rect(vec(198, 85), vec(60, 60), "#008ee7");
  });
  const fastButton = useChild(() => {
    useZIndex(2);
    return Rect(vec(280, 85), vec(60, 60), "#00a1b6");
  });
  const resetSpeedButton = useChild(() => {
    useZIndex(2);
    return Rect(vec(239, 140), vec(60 + 82, 30), "#ff7139");
  });

  function onClick(button: typeof addButton, handler: () => void) {
    useNewComponent(() =>
      Mouse({
        entity: button,
        geometry: button.rootComponent.geometry,
      })
    ).onClick(handler);
  }

  onClick(addButton, addCard);

  onClick(reverseButton, () => {
    settings.feedDirection = -settings.feedDirection;
  });

  onClick(slowButton, () => {
    settings.playbackRate -= 0.05;
  });

  onClick(fastButton, () => {
    settings.playbackRate += 0.05;
  });

  onClick(resetSpeedButton, () => {
    settings.playbackRate = 1.0;
  });

  return { geometry };
}
