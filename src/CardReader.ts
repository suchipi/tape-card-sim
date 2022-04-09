import {
  useType,
  useNewComponent,
  Geometry,
  Polygon,
  Vector,
  useDraw,
  useChild,
} from "@hex-engine/2d";

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

  const { geometry } = useNewComponent(() =>
    Rect(position.subtractY(200), vec(1010, 200), "#b8b0a9")
  );

  useChild(() => Rect(vec(0, -60), vec(1024, 100), "#d0c9c3"));

  return { geometry };
}

export function CardReaderFront(position: Vector) {
  useType(CardReaderFront);

  const { geometry } = useNewComponent(() =>
    Rect(position, vec(1024, 400), "#d0c9c3")
  );

  // The three little buttons
  useChild(() => Rect(vec(116, 105), vec(60, 100), "#ea2c3e"));
  useChild(() => Rect(vec(198, 105), vec(60, 100), "#008ee7"));
  useChild(() => Rect(vec(280, 105), vec(60, 100), "#00a1b6"));

  return { geometry };
}
