import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SELECTORS = [".yourContainer", "#root"];

function scrollTargets() {
  const list = SELECTORS.map((s) => document.querySelector(s)).filter(Boolean);
  const scrollingEl = document.scrollingElement;
  return { list, scrollingEl };
}

function scrollAll(behavior) {
  const { list, scrollingEl } = scrollTargets();

  const topNow =
    (scrollingEl && typeof scrollingEl.scrollTop === "number" ? scrollingEl.scrollTop : 0) ||
    (typeof window !== "undefined" ? window.scrollY || 0 : 0);

  const b = topNow > 40 ? behavior : "auto";

  if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
    window.scrollTo({ top: 0, left: 0, behavior: b });
  }

  if (scrollingEl && typeof scrollingEl.scrollTo === "function") {
    scrollingEl.scrollTo({ top: 0, left: 0, behavior: b });
  } else if (scrollingEl) {
    scrollingEl.scrollTop = 0;
  }

  list.forEach((el) => {
    if (typeof el.scrollTo === "function") {
      el.scrollTo({ top: 0, left: 0, behavior: b });
    } else {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    }
  });
}

export default function ScrollTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const run = () => scrollAll("smooth");

    requestAnimationFrame(run);
    const t = setTimeout(run, 120);

    return () => clearTimeout(t);
  }, [pathname, search]);

  return null;
}
