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
import Button from "./Button";

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
  useChild(() =>
    Button({
      position: vec(34, 105),
      size: vec(60, 100),
      zIndex: 2,
      label: "new card",
      color: "#bc75ff",
      onClick: addCard,
    })
  );

  useChild(() =>
    Button({
      position: vec(116, 77.5),
      size: vec(60, 45),
      zIndex: 2,
      label: "reverse toggle",
      color: "#ea2c3e",
      onClick: () => {
        settings.feedDirection = -settings.feedDirection;
      },
    })
  );

  useChild(() =>
    Button({
      position: vec(116, 132.5),
      size: vec(60, 45),
      zIndex: 2,
      label: "reverse hold",
      color: "#a11522",
      onDown: () => {
        settings.feedDirection = -settings.feedDirection;
      },
      onUp: () => {
        settings.feedDirection = -settings.feedDirection;
      },
    })
  );

  useChild(() =>
    Button({
      position: vec(198, 85),
      size: vec(60, 60),
      zIndex: 2,
      label: "slower",
      color: "#008ee7",
      onClick: () => {
        settings.playbackRate -= 0.05;
      },
    })
  );

  useChild(() =>
    Button({
      position: vec(280, 85),
      size: vec(60, 60),
      zIndex: 2,
      label: "faster",
      color: "#00a1b6",
      onClick: () => {
        settings.playbackRate += 0.05;
      },
    })
  );

  useChild(() =>
    Button({
      position: vec(239, 140),
      size: vec(60 + 82, 30),
      zIndex: 2,
      label: "reset speed",
      color: "#ff7139",
      onClick: () => {
        settings.playbackRate = 1.0;
      },
    })
  );

  return { geometry };
}
