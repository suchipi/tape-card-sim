import {
  useNewComponent,
  useDraw,
  useUpdate,
  Label,
  useType,
  SystemFont,
} from "@hex-engine/2d";

export default function FPS() {
  useType(FPS);

  const font = useNewComponent(() =>
    SystemFont({ name: "sans-serif", size: 10, color: "black" })
  );
  const label = useNewComponent(() => Label({ text: "0fps", font }));

  let last10: Array<number> = [];

  const documentTitle = document.title;

  useUpdate((delta) => {
    const fps = 1 / (delta / 1000);

    last10.unshift(fps);
    if (last10.length > 10) {
      last10 = last10.slice(0, 9);
    }

    const average =
      last10.reduce((prev, curr) => prev + curr, 0) / last10.length;

    label.text = `${Math.round(average)}fps`;

    document.title = `${documentTitle} (${label.text})`;
  });

  useDraw((context) => {
    label.draw(context, { x: 1, baseline: "top" });
  });
}
