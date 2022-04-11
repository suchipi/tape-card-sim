import {
  useType,
  useNewComponent,
  useChild,
  Canvas,
  Vector,
  AudioContext,
  useDraw,
} from "@hex-engine/2d";
import FPS from "./FPS";
import Card from "./Card";
import { CardReaderBack, CardReaderFront } from "./CardReader";
import { makeSettings } from "./settings";

export default function Root() {
  useType(Root);

  const canvas = useNewComponent(() =>
    Canvas({ backgroundColor: "darkslateblue" })
  );
  canvas.fullscreen({ pixelZoom: 1 });

  useNewComponent(AudioContext);

  useChild(FPS);

  const canvasCenter = new Vector(
    canvas.element.width / 2,
    canvas.element.height / 2
  );

  const settings = makeSettings();

  const readerBack = useChild(() => CardReaderBack(canvasCenter));

  const playheadX = canvasCenter.x + 300;
  const cardChannelY = readerBack.rootComponent.geometry.worldPosition().y;
  const playHeadY = cardChannelY - 35;

  const playHeadVec = new Vector(playheadX, playHeadY);

  const card = useChild(() =>
    Card(
      canvasCenter.addX(600).subtractY(300),
      cardChannelY,
      playHeadVec,
      settings
    )
  );

  const readerFront = useChild(() => CardReaderFront(canvasCenter, settings));

  useChild(() => {
    useDraw((context) => {
      context.beginPath();
      context.moveTo(playheadX, 0);
      context.lineTo(playheadX, canvas.element.height);
      context.closePath();

      context.strokeStyle = "black";
      context.stroke();
    });
  });
}
