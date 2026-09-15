import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The site's own font-size tokens, declared in `globals.css` under the
 * Tailwind v4 `--text-*` namespace.
 *
 * tailwind-merge cannot infer these from a config file — it only knows the
 * stock Tailwind scale — so without this list it files `text-body` under
 * `text-color`, alongside `text-primary-foreground`. Two classes in one group
 * means "keep the last", so `cn("text-primary-foreground text-body")` returned
 * just `text-body` and the colour was silently dropped. On a button that is
 * `bg-primary`, that left the label the same colour as its own background:
 * white on white in dark mode, black on black in light.
 *
 * Registering them as font sizes puts them in a different group from the
 * colour utilities, so the two now survive together.
 */
const FONT_SIZE_TOKENS = [
  "display",
  "body",
  "body-lg",
  "small",
  "micro",
  "mono",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZE_TOKENS }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
