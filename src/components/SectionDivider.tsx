export function SectionDivider({ bgTop = "#0A0A0A", bgBottom = "#F4F4F5" }: { bgTop?: string, bgBottom?: string }) {
  const topColor = bgTop === "black-main" ? "#0A0A0A" : bgTop;
  const bottomColor = bgBottom === "black-main" ? "#0A0A0A" : bgBottom;

  const isTopBlack = topColor === "#0A0A0A";
  const isBottomBlack = bottomColor === "#0A0A0A";

  if (isTopBlack && !isBottomBlack) {
    // Black top, Light bottom
    // We want a black curve extending downwards into the light bottom.
    return (
      <div className="relative w-full h-12 md:h-24 z-30 mb-[-3rem] md:mb-[-6rem] pointer-events-none">
        <svg
          className="absolute top-0 w-full h-full block"
          preserveAspectRatio="none"
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,0 L1440,0 L1440,50 C1400,50 1380,100 1340,100 L100,100 C60,100 40,50 0,50 Z" fill={topColor} />
        </svg>
      </div>
    );
  } else if (!isTopBlack && isBottomBlack) {
    // Light top, Black bottom
    // We want a black curve extending upwards into the light top.
    return (
      <div className="relative w-full h-12 md:h-24 z-30 mt-[-3rem] md:mt-[-6rem] pointer-events-none">
        <svg
          className="absolute bottom-0 w-full h-full block"
          preserveAspectRatio="none"
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,100 L1440,100 L1440,50 C1400,0 1380,0 1340,0 L100,0 C60,0 40,0 0,50 Z" fill={bottomColor} />
        </svg>
      </div>
    );
  }

  return null;
}
