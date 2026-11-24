import { ViewTransition, type ReactNode } from "react";

/**
 * Laat de pagina in- en uitschuiven bij navigaties met een
 * transitionType (nav-forward / nav-back). Andere navigaties: geen animatie.
 * Animaties staan in globals.css.
 */
export default function PageSlide({ children }: { children: ReactNode }) {
  const types = {
    "nav-forward": "nav-forward",
    "nav-back": "nav-back",
    default: "none",
  };
  return (
    <ViewTransition enter={types} exit={types} default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
