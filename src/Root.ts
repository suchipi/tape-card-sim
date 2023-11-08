import {
  useType,
  useNewComponent,
  useChild,
  Canvas,
  Vector,
  AudioContext,
  useDraw,
  useCallbackAsCurrent,
} from "@hex-engine/2d";
import FPS from "./FPS";
import Card from "./Card";
import { CardReaderBack, CardReaderFront } from "./CardReader";
import Instructions from "./Instructions";
import { makeSettings } from "./settings";
import drawOrder from "./drawOrder";
import useZIndex from "./useZIndex";
import Playhead from "./Playhead";

export default function Root() {
  useType(Root);

  const canvas = useNewComponent(() =>
    Canvas({ backgroundColor: "darkslateblue" })
  );
  canvas.fullscreen({ pixelZoom: 1 });

  useNewComponent(() => Canvas.DrawOrder(drawOrder));

  useNewComponent(AudioContext);

  useChild(FPS);

  const canvasCenter = new Vector(
    canvas.element.width / 2,
    canvas.element.height / 2
  );

  const settings = makeSettings();

  const readerPos = canvasCenter.addY(canvasCenter.y / 2);

  const readerBack = useChild(() => CardReaderBack(readerPos));

  const playheadX = canvasCenter.x + 300;
  const cardChannelY = readerBack.rootComponent.geometry.worldPosition().y;
  const playHeadY = cardChannelY - 35;

  const playHeadVec = new Vector(playheadX, playHeadY);

  const makeCard = useCallbackAsCurrent(() => {
    return useChild(() =>
      Card(
        canvasCenter.addX(600).subtractY(300),
        cardChannelY,
        playHeadVec,
        settings
      )
    );
  });

  const card = makeCard();

  const readerFront = useChild(() =>
    CardReaderFront(readerPos, settings, makeCard)
  );

  const playheadLine = useChild(() =>
    Playhead(
      new Vector(playheadX, readerPos.y - 300),
      new Vector(playheadX, readerPos.y - 100)
    )
  );

  const instructions = useChild(() => {
    const textBoxSize = 400;

    return Instructions(
      readerPos.subtractY(canvasCenter.y).subtractX(textBoxSize / 2),
      new Vector(textBoxSize, textBoxSize)
    );
  });
}
