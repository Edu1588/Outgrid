import { useState, useEffect } from "react";

export function SpeedometerHover() {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHovered) {
      // Accelerate to 100
      timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(timer);
            return 100;
          }
          return p + 5; // Fast acceleration
        });
      }, 30);
    } else {
      // Decelerate to 0
      timer = setInterval(() => {
        setProgress(p => {
          if (p <= 0) {
            clearInterval(timer);
            return 0;
          }
          return p - 3; // Slower deceleration
        });
      }, 30);
    }
    return () => clearInterval(timer);
  }, [isHovered]);

  const angle = -90 + (progress / 100) * 180;
  const ticks = Array.from({ length: 11 }, (_, i) => i * 10);

  return (
    <div 
      className="relative w-[300px] h-[175px] mx-auto cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Gauge Arc Container */}
      <div className="absolute top-0 left-0 w-[300px] h-[150px] overflow-hidden">
        {/* Gauge Arc */}
        <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full border-[15px] border-[#222] border-b-transparent border-r-transparent rotate-45 box-border shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] before:content-[''] before:absolute before:-top-[15px] before:-left-[15px] before:-right-[15px] before:-bottom-[15px] before:rounded-full before:border-[15px] before:border-transparent before:border-t-[rgba(255,140,0,0.1)] before:border-l-[rgba(255,140,0,0.1)] before:-rotate-45 before:pointer-events-none transition-all duration-300 group-hover:border-t-orange-primary/20 group-hover:border-l-orange-primary/20"></div>
        
        {/* Ticks */}
        <div className="absolute w-full h-full top-0 left-0 pointer-events-none">
          {ticks.map((tickVal) => {
            const tickPercent = tickVal / 100;
            const tickAngle = -90 + (tickPercent * 180);
            const mathAngle = tickAngle - 90;
            const radians = mathAngle * (Math.PI / 180);
            
            // Center is at (150, 150)
            const textRadius = 105;
            const textX = 150 + textRadius * Math.cos(radians);
            const textY = 150 + textRadius * Math.sin(radians);
            
            const isReached = tickVal <= progress;

            return (
              <div key={tickVal}>
                {/* Tick mark (rotated) */}
                <div 
                  className="absolute left-[150px] top-0 h-[150px] origin-bottom"
                  style={{ transform: `rotate(${tickAngle}deg)` }}
                >
                  <div className={`w-[2px] h-[15px] -ml-[1px] mt-[10px] transition-colors duration-100 ${isReached ? 'bg-orange-primary shadow-[0_0_5px_rgba(255,140,0,0.5)]' : 'bg-[#888]'}`}></div>
                </div>
                
                {/* Tick label (absolute position) */}
                <div 
                  className={`absolute text-[0.85rem] font-light flex items-center justify-center transition-colors duration-100 ${isReached ? 'text-white' : 'text-[#aaa]'}`}
                  style={{ 
                     left: `${textX}px`, 
                     top: `${textY}px`,
                    width: '30px',
                    height: '20px',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {tickVal}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Value Display */}
      <div className="absolute top-[95px] left-1/2 -translate-x-1/2 text-2xl font-light text-[#eee] z-10 text-center">
        <div className="font-bold">{Math.round(progress)}</div>
        <span className="text-[0.8rem] text-[#888]">%</span>
      </div>

      {/* Needle */}
      <div className="absolute top-[150px] left-1/2 w-0 h-0 z-20">
        <div 
          className="absolute bottom-0 -left-[3px] w-[6px] h-[130px] bg-orange-primary origin-bottom rounded-t-md shadow-[0_0_8px_rgba(255,140,0,0.8)] transition-transform duration-[50ms] ease-linear"
          style={{ transform: `rotate(${angle}deg)` }}
        ></div>
        <div className="absolute -top-[15px] -left-[15px] w-[30px] h-[30px] bg-[#333] rounded-full border-2 border-orange-primary shadow-[0_2px_5px_rgba(0,0,0,0.5)]"></div>
      </div>
    </div>
  );
}
