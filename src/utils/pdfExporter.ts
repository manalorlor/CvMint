import html2pdf from "html2pdf.js";
import React from "react";
import { createRoot } from "react-dom/client";
import { ResumeData } from "../types";
import { ResumeRenderer } from "../components/templates/ResumeRenderer";

const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
const ctx = canvas ? canvas.getContext("2d") : null;

function colorToRgbString(matchStr: string): string {
  if (ctx) {
    try {
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillStyle = matchStr;
      const res = ctx.fillStyle;
      if (
        res &&
        res !== "rgba(0,0,0,0)" &&
        !res.includes("oklch") &&
        !res.includes("oklab") &&
        !res.includes("color") &&
        !res.includes("lab")
      ) {
        if (res.startsWith("#")) {
          const hex = res.slice(1);
          if (hex.length === 6) {
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgb(${r}, ${g}, ${b})`;
          } else if (hex.length === 8) {
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            const a = (parseInt(hex.substring(6, 8), 16) / 255).toFixed(2);
            return `rgba(${r}, ${g}, ${b}, ${a})`;
          }
        }
        if (res.startsWith("rgb")) return res;
      }
    } catch {
      // Fall through to math formulas below
    }
  }

  // Fallback math for oklab
  if (matchStr.startsWith("oklab")) {
    try {
      const inner = matchStr.replace(/^oklab\(/i, "").replace(/\)$/, "").trim();
      const parts = inner.split("/");
      const colorParts = parts[0].trim().split(/\s+/);
      let alpha = 1;
      if (parts[1]) {
        const aStr = parts[1].trim();
        alpha = aStr.endsWith("%") ? parseFloat(aStr) / 100 : parseFloat(aStr);
      }

      let L = parseFloat(colorParts[0]);
      if (colorParts[0].endsWith("%")) L /= 100;
      const a_lab = parseFloat(colorParts[1]) || 0;
      const b_lab = parseFloat(colorParts[2]) || 0;

      const l_lms = Math.pow(Math.max(0, L + 0.3963377774 * a_lab + 0.2158037573 * b_lab), 3);
      const m_lms = Math.pow(Math.max(0, L - 0.1055613458 * a_lab - 0.0638541728 * b_lab), 3);
      const s_lms = Math.pow(Math.max(0, L - 0.0894841775 * a_lab - 1.2914855480 * b_lab), 3);

      const r_lin = +4.0767416621 * l_lms - 3.3077115913 * m_lms + 0.2309699292 * s_lms;
      const g_lin = -1.2684380046 * l_lms + 2.6097574011 * m_lms - 0.3413193965 * s_lms;
      const b_lin = -0.0041960863 * l_lms - 0.7034186147 * m_lms + 1.7076147010 * s_lms;

      const toSRGB = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(Math.max(0, x), 1 / 2.4) - 0.055);
      const r = Math.min(255, Math.max(0, Math.round(toSRGB(r_lin) * 255)));
      const g = Math.min(255, Math.max(0, Math.round(toSRGB(g_lin) * 255)));
      const b = Math.min(255, Math.max(0, Math.round(toSRGB(b_lin) * 255)));

      return alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
    } catch {
      return "rgb(50, 50, 50)";
    }
  }

  // Fallback math for oklch
  if (matchStr.startsWith("oklch")) {
    try {
      const inner = matchStr.replace(/^oklch\(/i, "").replace(/\)$/, "").trim();
      const parts = inner.split("/");
      const colorParts = parts[0].trim().split(/\s+/);
      let alpha = 1;
      if (parts[1]) {
        const aStr = parts[1].trim();
        alpha = aStr.endsWith("%") ? parseFloat(aStr) / 100 : parseFloat(aStr);
      }

      let L = parseFloat(colorParts[0]);
      if (colorParts[0].endsWith("%")) L /= 100;
      const C = parseFloat(colorParts[1]) || 0;
      const H = parseFloat(colorParts[2]) || 0;

      const hRad = (H * Math.PI) / 180;
      const a_lab = C * Math.cos(hRad);
      const b_lab = C * Math.sin(hRad);

      const l_lms = Math.pow(Math.max(0, L + 0.3963377774 * a_lab + 0.2158037573 * b_lab), 3);
      const m_lms = Math.pow(Math.max(0, L - 0.1055613458 * a_lab - 0.0638541728 * b_lab), 3);
      const s_lms = Math.pow(Math.max(0, L - 0.0894841775 * a_lab - 1.2914855480 * b_lab), 3);

      const r_lin = +4.0767416621 * l_lms - 3.3077115913 * m_lms + 0.2309699292 * s_lms;
      const g_lin = -1.2684380046 * l_lms + 2.6097574011 * m_lms - 0.3413193965 * s_lms;
      const b_lin = -0.0041960863 * l_lms - 0.7034186147 * m_lms + 1.7076147010 * s_lms;

      const toSRGB = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(Math.max(0, x), 1 / 2.4) - 0.055);
      const r = Math.min(255, Math.max(0, Math.round(toSRGB(r_lin) * 255)));
      const g = Math.min(255, Math.max(0, Math.round(toSRGB(g_lin) * 255)));
      const b = Math.min(255, Math.max(0, Math.round(toSRGB(b_lin) * 255)));

      return alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
    } catch {
      return "rgb(50, 50, 50)";
    }
  }

  return "rgb(50, 50, 50)";
}

function replaceAllUnrecognizedColors(cssText: string): string {
  if (!cssText || typeof cssText !== "string") return cssText;
  let result = cssText;
  let maxPasses = 5;
  while (maxPasses-- > 0) {
    const hasUnsupported =
      result.includes("oklch") ||
      result.includes("oklab") ||
      result.includes("color(") ||
      result.includes("color-mix(") ||
      result.includes("light-dark(") ||
      result.includes("lab(") ||
      result.includes("lch(");

    if (!hasUnsupported) break;

    result = result.replace(/light-dark\(([^,]+),[^)]+\)/gi, "$1");
    result = result.replace(/(oklab|oklch|lab|lch|color|color-mix)\([^)]+\)/gi, (m) => colorToRgbString(m));
  }
  return result;
}

function convertElementStylesToRgb(originalEl: HTMLElement, cloneEl: HTMLElement) {
  const origEls = [originalEl, ...Array.from(originalEl.querySelectorAll<HTMLElement>("*"))];
  const cloneEls = [cloneEl, ...Array.from(cloneEl.querySelectorAll<HTMLElement>("*"))];

  const propsToFix = [
    "color",
    "backgroundColor",
    "borderColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
    "fill",
    "stroke",
    "outlineColor",
    "boxShadow",
  ];

  for (let i = 0; i < origEls.length; i++) {
    const orig = origEls[i];
    const cloned = cloneEls[i];
    if (!orig || !cloned) continue;

    const computed = window.getComputedStyle(orig);
    propsToFix.forEach((prop) => {
      const val = computed.getPropertyValue(prop);
      if (
        val &&
        (val.includes("oklch") ||
          val.includes("oklab") ||
          val.includes("color(") ||
          val.includes("light-dark(") ||
          val.includes("lab("))
      ) {
        const rgbVal = replaceAllUnrecognizedColors(val);
        cloned.style.setProperty(prop, rgbVal, "important");
      }
    });
  }
}

export const exportToPdf = async (resume: ResumeData): Promise<void> => {
  const filename = `${resume.personalInfo?.firstName || "Resume"}_${resume.personalInfo?.lastName || "CV"}.pdf`;

  // Always create a clean offscreen container rendered at 800px width without any parent transforms
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = "800px";
  container.style.backgroundColor = "#ffffff";
  document.body.appendChild(container);

  const reactRoot = createRoot(container);
  reactRoot.render(React.createElement(ResumeRenderer, { resume, scale: 1 }));

  // Wait for React rendering and font styling to settle
  await new Promise((resolve) => setTimeout(resolve, 300));

  const element = (container.querySelector("#resume-printable-area") ||
    container.firstElementChild) as HTMLElement;

  if (!element) {
    console.error("Could not locate printable resume element");
    reactRoot.unmount();
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    window.print();
    return;
  }

  // Ensure element has standard unscaled dimensions
  element.style.transform = "none";
  element.style.boxShadow = "none";
  element.style.width = "800px";
  element.style.maxWidth = "100%";
  element.style.margin = "0";

  // Process computed styles to replace any oklch/oklab colors with explicit RGB values
  convertElementStylesToRgb(element, element);

  const opt = {
    margin: [0, 0, 0, 0],
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      width: 800,
      windowWidth: 800,
      onclone: (clonedDoc: Document) => {
        // Sanitize unsupported colors in all <style> tags in the cloned document
        const styleEls = clonedDoc.querySelectorAll("style");
        styleEls.forEach((style) => {
          if (style.textContent) {
            style.textContent = replaceAllUnrecognizedColors(style.textContent);
          }
        });

        // Sanitize inline styles on all elements in clonedDoc
        const allEls = clonedDoc.querySelectorAll<HTMLElement>("*");
        allEls.forEach((el) => {
          if (el.style && el.style.cssText) {
            el.style.cssText = replaceAllUnrecognizedColors(el.style.cssText);
          }
        });
      },
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  try {
    await (html2pdf as any)().set(opt).from(element).save();
  } catch (err) {
    console.error("PDF generation error, falling back to print:", err);
    window.print();
  } finally {
    reactRoot.unmount();
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
};
