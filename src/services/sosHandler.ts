import { MutableRefObject } from "react";

export const sosHandlerRef: MutableRefObject<(() => void) | null> = {
  current: null,
};
// not in use anymore since we moved SOS logic inside Sosbutton, but keeping it here for reference in case we want to trigger SOS from other places in the future