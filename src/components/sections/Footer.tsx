"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/lib/ThemeContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const NAV_LINKS = [
  { label: "Home",    href: "/"        },
  { label: "About",   href: "/about"   },
  { label: "Work",    href: "/work"    },
  { label: "Contact", href: "/contact" },
];

const SOCIAL_LINKS = [
  { label: "X",        href: "#" },
  { label: "Linkedin", href: "https://www.linkedin.com/in/quanganhtr" },
  { label: "Dribbble", href: "https://dribbble.com/quanganh29" },
  { label: "Behance",  href: "https://www.behance.net/quanganhtran2908" },
];

function HoverText({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered]   = useState(false);
  const [rotation, setRotation] = useState(0);
  return (
    <motion.span
      className="inline-block"
      onMouseEnter={() => { setRotation(Math.random() * 16 - 8); setHovered(true); }}
      onMouseLeave={() => setHovered(false)}
      animate={hovered ? { scale: 2, rotate: rotation } : { scale: 1, rotate: 0 }}
      transition={{ duration: 0.2, ease: EASE }}
    >
      {children}
    </motion.span>
  );
}

type RGB = [number, number, number];

// Uses `color` property — browsers always serialize it to rgb(), even for oklch inputs.
const cssVarToRgb = (cssValue: string): RGB => {
  const el = document.createElement("span");
  el.style.display = "none";
  el.style.color = cssValue;
  document.body.appendChild(el);
  const raw = getComputedStyle(el).color; // always "rgb(r, g, b)"
  document.body.removeChild(el);
  const m = raw.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  return m ? [+m[1], +m[2], +m[3]] : [0, 0, 0];
};

export default function Footer() {
  const footerRef  = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stopsRef   = useRef<{ bg: RGB[]; fg: RGB[] }>({ bg: [], fg: [] });
  const { theme } = useTheme();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const router = useRouter();

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  const computeStops = () => {
    stopsRef.current = {
      bg: [
        cssVarToRgb("var(--background)"),
        [212,212,212], [116,212,255], [253,165,213], [255,184,106],
        [230, 254, 127], // --primary: #e6fe7f (hardcoded — cssVarToRgb can't resolve chained vars)
      ],
      fg: [
        cssVarToRgb("var(--foreground)"),
        [64,64,64], [0,105,168], [163,0,76], [159,45,0], [20,20,20],
      ],
    };
  };

  const lerp = (a: RGB, b: RGB, t: number) =>
    `rgb(${Math.round(a[0]+(b[0]-a[0])*t)},${Math.round(a[1]+(b[1]-a[1])*t)},${Math.round(a[2]+(b[2]-a[2])*t)})`;
  const smootherstep = (x: number) => x*x*x*(x*(x*6-15)+10);

  const applyBg = useRef((p: number) => {
    const { bg: bgStops, fg: fgStops } = stopsRef.current;
    if (!bgStops.length) return;
    const content = contentRef.current;
    const t    = Math.max(0, Math.min(1, p));
    const segs = bgStops.length - 1;
    const i    = Math.min(Math.floor(t * segs), segs - 1);
    const lt   = smootherstep(t * segs - i);
    document.body.style.backgroundColor = lerp(bgStops[i], bgStops[i + 1], lt);
    const fgColor = lerp(fgStops[i], fgStops[i + 1], lt);
    if (content) content.style.color = fgColor;
    document.dispatchEvent(new CustomEvent("footer-fg-color", { detail: fgColor }));
  });

  useEffect(() => {
    if (!isHome) return;
    computeStops();
    const unsubscribe = scrollYProgress.on("change", applyBg.current);
    const observer = new MutationObserver(() => { computeStops(); applyBg.current(scrollYProgress.get()); });
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => {
      unsubscribe();
      observer.disconnect();
      document.body.style.backgroundColor = "";
      if (contentRef.current) contentRef.current.style.color = "";
    };
  }, [scrollYProgress, isHome]);

  useEffect(() => {
    if (!isHome) return;
    computeStops();
    applyBg.current(scrollYProgress.get());
  }, [theme, scrollYProgress, isHome]);

  return (
    <footer ref={footerRef} className="relative flex flex-col w-full overflow-hidden" style={{ height: "100dvh" }}>
      <div ref={contentRef} className="relative z-10 pt-18 px-2 pb-2 md:p-8 lg:p-14 flex flex-col flex-1">

        {/* ── Container 1: text + links ─────────────────────────────── */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="type-h2 text-left">
              YOU REACHED THE FOOTER.<br />
              <button
                onClick={() => router.push("/contact")}
                className="type-h2 cursor-pointer bg-transparent border-none p-0 underline-offset-4 hover:underline text-left"
              >
                WHEN WILL YOU REACH ME?
              </button>
            </h2>
          </motion.div>

          <div className="mt-14 flex flex-row items-start justify-between md:items-center gap-4 md:gap-0">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {NAV_LINKS.map(({ label, href }, i) => (
                <React.Fragment key={label}>
                  <Link href={href} className="text-base-bold">
                    <HoverText>{label}</HoverText>
                  </Link>
                  {i < NAV_LINKS.length - 1 && (
                    <span className="text-base-bold hidden md:inline">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex flex-col items-end md:flex-row md:flex-wrap md:items-center gap-4">
              <a href="mailto:quanganhtran2908@gmail.com" className="text-base-bold uppercase">
                quanganhtran2908@gmail.com
              </a>
              {SOCIAL_LINKS.map(({ label, href }) => (
                <React.Fragment key={label}>
                  <span className="text-base-bold hidden md:inline">·</span>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-base-bold">
                    <HoverText>{label}</HoverText>
                  </a>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* ── Container 2: logo ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
          className="mt-auto"
        >
          <svg viewBox="0 0 1808 527" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto", display: "block" }}>
            <path d="M1808 210.132V265.351C1808 285.117 1804.46 304.141 1797.38 322.424C1790.29 340.46 1780.4 357.137 1767.7 372.455C1755 387.774 1740.11 401.115 1723.01 412.48C1705.91 423.846 1687.23 432.616 1666.96 438.793C1646.2 445.217 1624.71 448.429 1602.48 448.429C1578.79 448.429 1556.45 444.846 1535.44 437.681C1514.44 430.269 1495.39 419.892 1478.29 406.551C1464.13 395.433 1450.33 380.856 1436.9 362.82C1423.46 344.784 1413.08 322.795 1405.76 296.852C1398.92 273.628 1395.5 249.415 1395.5 224.214C1395.5 198.272 1398.67 174.307 1405.02 152.318C1411.62 130.081 1420.9 109.698 1432.87 91.1682C1446.3 70.1674 1462.05 53.1197 1480.12 40.0251C1498.44 26.9304 1516.51 17.2948 1534.34 11.1181C1545.09 7.65912 1556.32 4.94137 1568.05 2.96482C1580.01 0.988274 1592.35 0 1605.05 0C1625.56 0 1644.73 2.47068 1662.56 7.41204C1680.64 12.3534 1697.61 19.6419 1713.48 29.2776C1727.89 38.172 1741.2 49.4136 1753.42 63.0024C1765.87 76.5912 1776.13 92.28 1784.19 110.069C1788.1 118.716 1791.39 127.734 1794.08 137.123C1797.01 146.511 1799.21 156.394 1800.67 166.771H1712.75C1711.29 158.865 1708.36 150.588 1703.96 141.941C1699.81 133.046 1693.95 124.646 1686.38 116.74C1672.7 103.151 1656.09 93.8859 1636.55 88.9446C1626.54 86.4739 1616.04 85.2385 1605.05 85.2385C1591.13 85.2385 1577.69 87.4622 1564.75 91.9094C1551.81 96.1095 1540.33 102.286 1530.31 110.439C1509.55 127.487 1495.27 150.217 1487.45 178.63C1483.54 192.96 1481.59 208.402 1481.59 224.956C1481.59 242.25 1483.67 258.063 1487.82 272.393C1492.21 286.723 1497.59 298.705 1503.94 308.341C1510.53 318.965 1518.71 328.477 1528.48 336.878C1538.5 345.278 1550.34 351.825 1564.02 356.519C1576.72 360.967 1590.52 363.19 1605.41 363.19C1616.16 363.19 1626.54 361.955 1636.55 359.484C1646.57 357.014 1655.85 353.555 1664.39 349.107C1672.45 344.907 1680.03 339.595 1687.11 333.172C1694.43 326.501 1700.54 318.965 1705.42 310.565C1710.31 302.659 1714.22 293.888 1717.15 284.252H1605.41V210.132L1808 210.132Z" fill="currentColor"/>
            <path d="M1168.48 336.875V444.72H1082.39V3.70312L1183.13 3.70312L1215.73 122.296C1218.67 132.426 1221.72 143.791 1224.89 156.391C1228.07 168.745 1231.12 181.222 1234.05 193.822C1236.98 206.176 1239.43 217.17 1241.38 226.806C1245.78 247.312 1249.68 266.337 1253.1 283.878C1256.52 301.42 1259.94 319.456 1263.36 337.986C1264.82 346.881 1266.17 355.528 1267.39 363.929C1268.61 372.576 1269.83 380.976 1271.05 389.13H1278.38C1276.43 376.035 1274.59 364.299 1272.88 353.922C1271.17 343.298 1269.47 332.427 1267.76 321.309C1266.05 310.191 1264.21 296.973 1262.26 281.655C1260.55 270.784 1258.84 258.554 1257.13 244.965C1255.42 231.129 1253.83 217.541 1252.37 204.199C1250.9 190.61 1249.93 178.627 1249.44 168.251C1248.71 159.109 1248.1 150.215 1247.61 141.567C1247.36 132.673 1247.24 124.149 1247.24 115.996V3.70312L1333.33 3.70312V444.72H1238.08L1204.38 330.204C1201.94 322.298 1199.13 312.415 1195.95 300.556C1192.78 288.696 1189.36 276.096 1185.69 262.754C1182.28 249.165 1179.1 235.824 1176.17 222.729C1172.02 204.693 1167.87 186.163 1163.71 167.139C1159.56 147.867 1155.9 128.967 1152.72 110.437C1151.01 101.542 1149.43 92.7712 1147.96 84.1238C1146.5 75.4764 1145.15 67.1997 1143.93 59.2935H1136.61C1139.05 75.3529 1141.73 92.4006 1144.66 110.437C1147.6 128.225 1150.53 147.126 1153.46 167.139C1155.9 186.41 1158.34 205.928 1160.78 225.694C1163.23 245.212 1165.18 264.36 1166.65 283.137C1167.13 292.526 1167.5 301.791 1167.74 310.932C1168.23 319.827 1168.48 328.474 1168.48 336.875Z" fill="currentColor"/>
            <path d="M768.242 444.712L836.382 3.69531L959.472 3.69531L1027.61 444.712H941.522L928.7 343.538H867.154L854.332 444.712H768.242ZM877.412 262.005H918.442L903.789 123.77C903.3 118.088 902.934 113.023 902.69 108.576C902.445 103.881 902.201 98.9401 901.957 93.7517C901.713 88.3162 901.59 81.7689 901.59 74.1098L894.264 74.1098V84.8572C894.264 86.5867 894.264 88.3162 894.264 90.0457C894.019 92.0222 893.897 93.8752 893.897 95.6047C893.897 98.0754 893.775 100.67 893.531 103.387C893.287 105.858 893.165 108.329 893.165 110.799C893.165 115.741 892.798 120.064 892.066 123.77L877.412 262.005Z" fill="currentColor"/>
            <path d="M499.219 335.755V3.69531L585.309 3.69531V335.755C585.309 342.179 587.263 347.738 591.17 352.432C592.636 354.656 594.467 356.632 596.666 358.362C599.108 359.844 601.916 360.956 605.091 361.697C608.022 362.685 610.953 363.18 613.884 363.18C621.699 363.18 628.293 360.832 633.666 356.138C639.283 351.197 642.092 344.402 642.092 335.755V3.69531L728.182 3.69531V335.755C728.182 363.427 721.588 386.404 708.4 404.687C701.561 414.076 693.624 421.982 684.588 428.406C675.551 434.582 664.927 439.524 652.716 443.23C640.993 446.689 628.049 448.418 613.884 448.418C598.986 448.418 585.675 446.689 573.952 443.23C562.474 439.524 552.216 434.582 543.18 428.406C524.13 415.311 511.186 397.028 504.348 373.556C500.928 361.944 499.219 349.344 499.219 335.755Z" fill="currentColor"/>
            <path d="M0 221.62C0 197.16 3.78553 174.06 11.3566 152.318C18.9276 130.328 29.5515 109.945 43.2283 91.1682C56.6608 72.638 72.6577 56.5786 91.219 42.9898C110.025 29.4011 130.173 18.9007 151.665 11.4887C162.411 7.78266 173.524 4.94137 185.002 2.96482C196.725 0.988274 208.57 0 220.537 0C245.204 0 268.406 3.95309 290.142 11.8593C311.879 19.5184 331.783 29.8952 349.856 42.9898C370.615 58.5552 387.467 75.9735 400.411 95.2448C413.355 114.269 423.002 133.17 429.352 151.947C433.015 163.065 435.824 174.43 437.778 186.042C439.732 197.655 440.709 209.514 440.709 221.62C440.709 246.08 437.412 268.44 430.817 288.699C424.223 308.959 416.408 326.377 407.372 340.954C396.626 358.249 383.926 373.938 369.272 388.021C354.863 402.104 338.744 413.839 320.915 423.228C303.086 432.616 284.037 439.534 263.766 443.982L267.063 526.255H182.804V445.093C162.289 441.14 142.751 434.593 124.19 425.451C105.873 416.31 89.1431 404.574 74.001 390.244C58.8588 376.161 45.7927 360.473 34.8024 343.178C23.8122 325.883 15.2642 306.735 9.15854 285.734C6.2278 275.605 3.90764 265.228 2.19805 254.604C0.732683 243.733 0 232.738 0 221.62ZM86.0902 223.103C86.0902 235.209 87.5556 247.562 90.4863 260.163C93.6613 272.516 98.1795 284.005 104.041 294.629C109.902 305.006 116.741 314.518 124.556 323.165C132.616 331.566 141.53 338.854 151.299 345.031C160.58 351.207 171.081 356.025 182.804 359.484V292.776H257.904L260.469 358.743C270.726 355.531 280.862 350.713 290.875 344.29C301.133 337.619 309.925 330.207 317.252 322.053C325.555 312.665 332.272 303.276 337.4 293.888C342.529 284.252 346.803 273.134 350.222 260.533C351.688 254.604 352.787 248.551 353.519 242.374C354.252 235.95 354.618 229.526 354.618 223.103C354.618 208.278 352.298 193.949 347.658 180.113C343.018 166.03 336.668 153.429 328.608 142.311C320.06 130.699 310.291 120.693 299.301 112.293C288.555 103.892 276.344 97.2213 262.667 92.28C249.234 87.5857 235.313 85.2385 220.904 85.2385C206.739 85.2385 192.818 87.5857 179.141 92.28C165.464 96.9743 153.009 103.522 141.774 111.922C130.784 120.569 121.015 130.452 112.467 141.57C104.163 152.688 97.691 165.412 93.0507 179.742C90.8527 186.66 89.1431 193.825 87.9219 201.237C86.7008 208.402 86.0902 215.691 86.0902 223.103Z" fill="currentColor"/>
          </svg>
        </motion.div>

      </div>
    </footer>
  );
}
