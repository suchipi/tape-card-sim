import {
  useType,
  useNewComponent,
  useChild,
  Canvas,
  Vector,
} from "@hex-engine/2d";
import FPS from "./FPS";
import Card from "./Card";
import { CardReaderBack, CardReaderFront } from "./CardReader";

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

  const readerBack = useChild(() => CardReaderBack(canvasCenter));

  const card = useChild(() =>
    Card(
      canvasCenter.addX(600).subtractY(300),
      readerBack.rootComponent.geometry.worldPosition().y
    )
  );

  const readerFront = useChild(() => CardReaderFront(canvasCenter));
}
