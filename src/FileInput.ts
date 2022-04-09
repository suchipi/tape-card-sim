import { useType, useDestroy } from "@hex-engine/2d";
import Defer from "@suchipi/defer";

export default function FileInput(accept?: string) {
  useType(FileInput);

  let selection: File | null = null;

  const input = document.createElement("input");
  input.type = "file";
  Object.assign(input.style, {
    position: "absolute",
    top: "0",
    left: "0",
    display: "none",
  });

  if (accept) {
    input.accept = accept;
  }

  document.body.appendChild(input);

  let pendingWait: Defer<File | null> | null = null;

  const handleChange = () => {
    selection = input.files![0] || null;
    if (pendingWait) {
      pendingWait.resolve(selection);
      pendingWait = null;
    }
  };

  input.addEventListener("change", handleChange);

  const { onDestroy } = useDestroy();

  onDestroy(() => {
    if (input.parentNode) {
      input.parentNode.removeChild(input);
    }
  });

  return {
    openDialog() {
      if (!pendingWait) {
        pendingWait = new Defer();
      }
      input.click();
      return pendingWait.promise;
    },
    get currentSelection() {
      return selection;
    },
  };
}
