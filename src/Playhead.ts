import {
  useType,
  useDraw,
  Vector,
  useNewComponent,
  SystemFont,
  Label,
} from "@hex-engine/2d";
import useZIndex from "./useZIndex";

export default function Playhead(start: Vector, end: Vector) {
  useType(Playhead);

  useZIndex(3);

  useDraw((context) => {
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.closePath();

    context.strokeStyle = "black";
    context.stroke();
  });

  const font = useNewComponent(() =>
    SystemFont({ name: "sans-serif", size: 10, color: "black" })
  );
  const labelComp = useNewComponent(() => Label({ text: " playhead", font }));

  useDraw((context) => {
    labelComp.draw(context, { x: end.x, y: end.y, baseline: "bottom" });
  });
}
