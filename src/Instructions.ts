import {
  useNewComponent,
  useDraw,
  useType,
  SystemFont,
  Vector,
  TextBox,
} from "@hex-engine/2d";
import useZIndex from "./useZIndex";

export default function Instructions(pos: Vector, size: Vector) {
  useType(Instructions);

  useZIndex(-1);

  const font = useNewComponent(() =>
    SystemFont({ name: "sans-serif", size: 18, color: "black" })
  );

  const textBox = useNewComponent(() =>
    TextBox({
      font,
      size,
    })
  );

  const text = [
    "This is a simulated magentic tape card reader!",
    "",
    "Load an audio file onto the card, then drag the card down into the player.",
    "",
    "Then, press the buttons to change the sound.",
    "Try dragging the card around while it's playing!",
  ].join("\n");

  useDraw((context) => {
    textBox.drawText(context, text, pos);
  });
}
