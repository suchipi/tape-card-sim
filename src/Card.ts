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
import { Settings } from "./settings";

export default function Card(
  position: Vector,
  verticalLimit: number,
  playHead: Vector,
  settings: Settings
) {
  useType(Card);

  const CLIP_LENGTH = 5;
  const dimensions = new Vector(CLIP_LENGTH * 200, 300);

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

  const getAudioContext = useCallbackAsCurrent(() => {
    return useAudioContext();
  });

  let forwardAudioBuffer: AudioBuffer | null = null;
  let reverseAudioBuffer: AudioBuffer | null = null;

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

        return getAudioData(selection, audioContext).then(
          ({ forward, reverse }) => {
            forwardAudioBuffer = forward;
            reverseAudioBuffer = reverse;
            console.log(forwardAudioBuffer);
            cardMessage = "loaded: " + selection.name;
          }
        );
      })
      .catch((error: Error) => {
        console.error(error);
        cardMessage = "an unexpected error occurred: " + error.message;
      });
  });

  function writePlayheadOffset(inVec: Vector, outVec: Vector) {
    outVec.x = (inVec.x - playHead.x) / (dimensions.x / 2);
    outVec.y = (inVec.y - playHead.y) / (dimensions.y / 2);
  }

  const posRelativeToPlayhead = new Vector(999, 999);

  let audioContext: AudioContext | null = null;

  let source: AudioBufferSourceNode | null = null;
  function killSource() {
    if (source != null) {
      try {
        source.disconnect();
        source.stop(0);
      } catch (err) {
        console.error(err);
      }
      source = null;
    }
  }

  const lastPos = geometry.position.clone();

  let lastDirection = 0;

  useUpdate((delta) => {
    writePlayheadOffset(geometry.position, posRelativeToPlayhead);

    let nominalDeltaX = (delta / (1000 * CLIP_LENGTH)) * dimensions.x;

    if (
      geometry.position.y === verticalLimit &&
      Math.abs(posRelativeToPlayhead.x) <= 1.5 &&
      !draggable.isDragging
    ) {
      geometry.position.x -=
        settings.feedDirection * settings.playbackRate * nominalDeltaX;
    }

    let deltaX = 0;

    deltaX = geometry.position.x - lastPos.x;
    lastPos.mutateInto(geometry.position);

    if (!forwardAudioBuffer) return;
    if (!reverseAudioBuffer) return;

    if (!audioContext) {
      audioContext = useAudioContext();
    }
    if (!audioContext) return;

    const isNearPlayhead =
      Math.abs(posRelativeToPlayhead.x) <= 1 && posRelativeToPlayhead.y >= 0;

    if (!isNearPlayhead) {
      killSource();
      return;
    }

    const positionAlongTape = (-posRelativeToPlayhead.x + 1) / 2;

    const direction = -Math.sign(deltaX);

    if (direction === 0) {
      killSource();
      lastDirection = direction;
      return;
    }

    if (direction !== lastDirection) {
      killSource();

      const forwardOffset = Math.min(
        CLIP_LENGTH * positionAlongTape,
        forwardAudioBuffer.duration
      );

      if (direction === 1) {
        source = new AudioBufferSourceNode(audioContext);
        source.buffer = forwardAudioBuffer;

        source.connect(audioContext.destination);
        source.start(audioContext.currentTime, forwardOffset);
      } else {
        const reverseOffset = forwardAudioBuffer.duration - forwardOffset;

        source = new AudioBufferSourceNode(audioContext);
        source.buffer = reverseAudioBuffer;

        source.connect(audioContext.destination);
        source.start(audioContext.currentTime, reverseOffset);
      }
    }

    lastDirection = direction;

    const playbackRate = Math.abs(deltaX / nominalDeltaX);

    if (!source) return;

    source.playbackRate.cancelScheduledValues(audioContext.currentTime);
    source.playbackRate.setTargetAtTime(
      playbackRate,
      audioContext.currentTime,
      0.1
    );
  });
}
