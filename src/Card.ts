import {
  useType,
  useNewComponent,
  Geometry,
  Polygon,
  Vector,
  useDraw,
  useUpdate,
} from "@hex-engine/2d";
import Draggable from "./Draggable";

export default function Card(position: Vector, verticalLimit: number) {
  useType(Card);

  const geometry = useNewComponent(() =>
    Geometry({
      shape: Polygon.rectangle(400, 200),
      position: position.clone(),
    })
  );

  useNewComponent(() => Draggable(geometry));

  useUpdate(() => {
    if (geometry.position.y > verticalLimit) {
      geometry.position.y = verticalLimit;
    }
  });

  const tapeSection = Polygon.rectangle(geometry.shape.width, 35);
  const tapeBottomOffset = 25;

  useDraw((context) => {
    context.fillStyle = "white";
    geometry.shape.draw(context, "fill");

    context.fillStyle = "#111";
    context.translate(
      0,
      geometry.shape.height - tapeSection.height - tapeBottomOffset
    );
    tapeSection.draw(context, "fill");
  });
}
