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
  onDown,
  onUp,
}: {
  position: Vector;
  color: string;
  size: Vector;
  zIndex: number;
  label?: string;
  onClick?: () => void;
  onDown?: () => void;
  onUp?: () => void;
}) {
  useType(Button);

  useZIndex(zIndex);

  const geometry = useNewComponent(() =>
    Geometry({
      shape: Polygon.rectangle(size),
      position: position.clone(),
    })
  );

  const mouse = useNewComponent(() => Mouse({ geometry }));

  if (onClick) {
    mouse.onClick(onClick);
  }

  // TODO: Feels weird that we have to specify isInsideBounds with non-lowlevel-mouse...
  let wasDown = false;
  if (onDown) {
    mouse.onDown(() => {
      if (mouse.isInsideBounds) {
        wasDown = true;
        onDown();
      }
    });
  }
  if (onUp) {
    mouse.onUp(() => {
      if (wasDown) {
        onUp();
        wasDown = false;
      }
    });
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
