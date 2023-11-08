import { useType, useNewComponent, Keyboard, useUpdate } from "@hex-engine/2d";

type KeyListenerCallback = (state: boolean, previous: boolean) => void;

export default function KeyListener(
  keyName: string,
  callback: KeyListenerCallback
) {
  useType(KeyListener);

  const keyboard = useNewComponent(Keyboard);

  let previousValue = false;
  useUpdate(() => {
    let currentValue = keyboard.pressed.has(keyName);
    if (currentValue !== previousValue) {
      callback(currentValue, previousValue);
    }
    previousValue = currentValue;
  });
}
