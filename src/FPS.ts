import {
  useNewComponent,
  useDraw,
  useUpdate,
  Label,
  useType,
  SystemFont,
} from "@hex-engine/2d";
import RollingAverage from "./RollingAverage";

export default function FPS() {
  useType(FPS);

  const font = useNewComponent(() =>
    SystemFont({ name: "sans-serif", size: 10, color: "black" })
  );
  const label = useNewComponent(() => Label({ text: "0fps", font }));

  const rollingFps = new RollingAverage(500);

  const documentTitle = document.title;

  useUpdate((delta) => {
    const fps = 1 / (delta / 1000);
    rollingFps.addDataPoint(fps);

    const average = rollingFps.calculateAverage();

    label.text = `${Math.round(average)}fps`;

    document.title = `${documentTitle} (${label.text})`;
  });

  useDraw((context) => {
    label.draw(context, { x: 1, baseline: "top" });
  });
}
