import {
  useType,
  useNewComponent,
  Geometry,
  Polygon,
  Vector,
  useDraw,
  Mouse,
  SystemFont,
  Label,
} from "@hex-engine/2d";
import useZIndex from "./useZIndex";

export default function Button({
  position,
  size,
  color,
  zIndex,
  label,
  onClick,
}: {
  position: Vector;
  color: string;
  size: Vector;
  zIndex: number;
  label?: string;
  onClick?: () => void;
}) {
  useType(Button);

  useZIndex(zIndex);

  const geometry = useNewComponent(() =>
    Geometry({
      shape: Polygon.rectangle(size),
      position: position.clone(),
    })
  );

  const mouse = useNewComponent(Mouse);

  if (onClick) {
    mouse.onClick(onClick);
  }

  useDraw((context) => {
    context.fillStyle = color;
    geometry.shape.draw(context, "fill");

    if (mouse.isPressingLeft) {
      context.strokeStyle = "1px solid black";
      geometry.shape.draw(context, "stroke");
    }
  });

  if (label) {
    const font = useNewComponent(() =>
      SystemFont({ name: "sans-serif", size: 10, color: "black" })
    );
    const labelComp = useNewComponent(() => Label({ text: label, font }));

    useDraw((context) => {
      labelComp.draw(context);
    });
  }

  return {
    geometry,
  };
}
