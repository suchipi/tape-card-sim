import {
  useType,
  useNewComponent,
  Geometry,
  Polygon,
  Vector,
  useDraw,
  useUpdate,
  Mouse,
  SystemFont,
  useCallbackAsCurrent,
  useAudioContext,
} from "@hex-engine/2d";
import Draggable from "./Draggable";
import FileInput from "./FileInput";
import getAudioData from "./getAudioData";

export default function Card(
  position: Vector,
  verticalLimit: number,
  playHead: Vector
) {
  useType(Card);

  const dimensions = new Vector(400, 200);

  const geometry = useNewComponent(() =>
    Geometry({
      shape: Polygon.rectangle(dimensions),
      position: position.clone(),
    })
  );

  const draggable = useNewComponent(() => Draggable(geometry));

  useUpdate(() => {
    if (geometry.position.y > verticalLimit) {
      geometry.position.y = verticalLimit;
    }
  });

  const fileInput = useNewComponent(FileInput);

  const mouse = useNewComponent(Mouse);

  let cardMessage = "right-click to load an audio file";

  const tapeSection = Polygon.rectangle(geometry.shape.width, 35);
  const tapeBottomOffset = 25;

  const font = useNewComponent(() =>
    SystemFont({ name: "sans-serif", size: 14, color: "black" })
  );

  useDraw((context) => {
    context.fillStyle = "white";
    geometry.shape.draw(context, "fill");

    font.drawText(context, cardMessage, { x: 10, y: 10 + font.size });

    context.fillStyle = "#111";
    context.translate(
      0,
      geometry.shape.height - tapeSection.height - tapeBottomOffset
    );
    tapeSection.draw(context, "fill");
  });

  let averageDelta = 16;
  // const last100: Array<number> = [];

  // useUpdate((delta) => {
  //   last100.push(delta);
  //   if (last100.length > 100) {
  //     last100.shift();
  //   }

  //   averageDelta =
  //     last100.reduce((prev, curr) => prev + curr, 0) / last100.length;
  // });

  const getAudioContext = useCallbackAsCurrent(() => {
    return useAudioContext();
  });

  let audioBuffer: AudioBuffer | null = null;

  mouse.onRightClick(() => {
    fileInput
      .openDialog()
      .then((selection) => {
        if (selection == null) return;

        cardMessage = "opening: " + selection.name;

        const audioContext = getAudioContext();

        if (!audioContext) {
          cardMessage = "failed to load audio: no AudioContext present";
          return;
        }

        return getAudioData(selection, audioContext).then((buffer) => {
          audioBuffer = buffer;
          console.log(audioBuffer);
          cardMessage = "loaded: " + selection.name;
        });
      })
      .catch((error: Error) => {
        console.error(error);
        cardMessage = "an unexpected error occurred: " + error.message;
      });
  });

  let source: AudioBufferSourceNode | null = null;
  const lastPos = geometry.position.clone();

  function writePlayheadOffset(inVec: Vector, outVec: Vector) {
    outVec.x = (inVec.x - playHead.x) / (dimensions.x / 2);
    outVec.y = (inVec.y - playHead.y) / (dimensions.y / 2);
  }

  const posRelativeToPlayhead = new Vector(999, 999);

  let gainNode: GainNode | null = null;

  const feedRateMultiplier = 1;

  let velocityX = 0;

  useUpdate((delta) => {
    writePlayheadOffset(geometry.position, posRelativeToPlayhead);

    if (
      geometry.position.y === verticalLimit &&
      Math.abs(posRelativeToPlayhead.x) <= 1.5 &&
      !draggable.isDragging
    ) {
      geometry.position.x -=
        feedRateMultiplier * ((delta / (1000 * 5)) * dimensions.x);
    }

    let audioContext: AudioContext | null = null;

    try {
      if (geometry.position.equals(lastPos)) return;
      velocityX = geometry.position.x - lastPos.x;
      lastPos.mutateInto(geometry.position);

      if (!audioBuffer) return;

      audioContext = useAudioContext();
      if (!audioContext) return;

      if (!gainNode) {
        gainNode = audioContext.createGain();
        gainNode.gain.value = 0.95;
        gainNode.connect(audioContext.destination);
      }

      if (Math.abs(posRelativeToPlayhead.x) > 1) return;
      if (posRelativeToPlayhead.y < 0) return;
    } finally {
      if (source) {
        try {
          source.stop(0);
          source.disconnect();
        } catch (err) {}
      }
    }

    const positionAlongTape = (-posRelativeToPlayhead.x + 1) / 2;

    source = audioContext.createBufferSource();
    source.connect(gainNode);
    source.buffer = audioBuffer;

    source.start(
      audioContext.currentTime,
      Math.min(5 * positionAlongTape, audioBuffer.duration),
      0.3 // TODO need to actually calculate a good value for this
    );
  });
}
