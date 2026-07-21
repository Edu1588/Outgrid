export function SectionDivider({ bgTop = "#0A0A0A", bgBottom = "#F4F4F5" }: { bgTop?: string, bgBottom?: string }) {
  const topColor = bgTop === "black-main" ? "#0A0A0A" : bgTop;
  const bottomColor = bgBottom === "black-main" ? "#0A0A0A" : bgBottom;

  const isTopBlack = topColor === "#0A0A0A";
  const isBottomBlack = bottomColor === "#0A0A0A";

  let containerBg = topColor;
  let pathFill = bottomColor;
  let pathD = "M0,100 L0,50 C40,50 60,0 100,0 L1340,0 C1380,0 1400,50 1440,50 L1440,100 Z";

  if (isTopBlack && !isBottomBlack) {
    // Black top overlaps Light bottom
    containerBg = "transparent";
    pathFill = topColor;
    pathD = "M0,0 L1440,0 L1440,50 C1400,50 1380,100 1340,100 L100,100 C60,100 40,50 0,50 Z";
  } else if (!isTopBlack && isBottomBlack) {
    // Black bottom overlaps Light top
    containerBg = "transparent";
    pathFill = bottomColor;
    pathD = "M0,100 L0,50 C40,50 60,0 100,0 L1340,0 C1380,0 1400,50 1440,50 L1440,100 Z";
  }

  // Use negative margins to make the divider overlap the adjacent section
  const overlapClass = (isTopBlack && !isBottomBlack) ? "mb-[-3rem] md:mb-[-5rem] z-20" : "mt-[-3rem] md:mt-[-5rem] z-20";

  return (
    <div className={`relative w-full h-12 md:h-20 pointer-events-none ${overlapClass}`} style={{ backgroundColor: containerBg }}>
      <svg
        className="absolute bottom-0 w-full h-full block"
        preserveAspectRatio="none"
        viewBox="0 0 1440 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={pathD} fill={pathFill} />
      </svg>
    </div>
  );
}
