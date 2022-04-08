import {
  useType,
  useNewComponent,
  useChild,
  Canvas,
  Vector,
} from "@hex-engine/2d";
import Card from "./Card";
import FPS from "./FPS";

export default function Root() {
  useType(Root);

  const canvas = useNewComponent(() =>
    Canvas({ backgroundColor: "darkslateblue" })
  );
  canvas.fullscreen({ pixelZoom: 1 });

  useChild(FPS);

  const canvasCenter = new Vector(
    canvas.element.width / 2,
    canvas.element.height / 2
  );

  useChild(() => Card(canvasCenter));
}
