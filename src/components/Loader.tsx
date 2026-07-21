import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500; // time for the gif to finish
    const interval = 50;
    const steps = duration / interval;
    const increment = 100 / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 300); // Small pause at 100%
      }
      setProgress(current);
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Map progress (0 to 100) to angle (-90deg to 90deg)
  const angle = -90 + (progress / 100) * 180;
  
  // Generate ticks (0 to 100, step 10)
  const ticks = Array.from({ length: 11 }, (_, i) => i * 10);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[9999] bg-[#121212] flex flex-col items-center justify-center text-[#eee]"
      >
        <div className="relative w-[300px] h-[165px] mb-8 flex justify-center items-end">
          {/* Gauge Arc Container */}
          <div className="absolute top-0 left-0 w-[300px] h-[150px] overflow-hidden">
            {/* Gauge Arc */}
            <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full border-[15px] border-[#222] border-b-transparent border-r-transparent rotate-45 box-border shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] before:content-[''] before:absolute before:-top-[15px] before:-left-[15px] before:-right-[15px] before:-bottom-[15px] before:rounded-full before:border-[15px] before:border-transparent before:border-t-[rgba(255,140,0,0.1)] before:border-l-[rgba(255,140,0,0.1)] before:-rotate-45 before:pointer-events-none"></div>
            
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
                
                return (
                  <div key={tickVal}>
                    {/* Tick mark (rotated) */}
                    <div 
                      className="absolute left-[150px] top-0 h-[150px] origin-bottom"
                      style={{ transform: `rotate(${tickAngle}deg)` }}
                    >
                      <div className="w-[2px] h-[15px] bg-[#888] -ml-[1px] mt-[10px]"></div>
                    </div>
                    
                    {/* Tick label (absolute position) */}
                    <div 
                      className="absolute text-[0.85rem] font-light text-[#aaa] flex items-center justify-center"
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
          <div className="absolute bottom-[35px] left-1/2 -translate-x-1/2 text-2xl font-light text-[#eee] z-10 text-center">
            <div>{Math.round(progress)}</div>
            <span className="text-[0.8rem] text-[#888]">%</span>
          </div>

          {/* Needle */}
          <div className="absolute bottom-[15px] left-1/2 w-0 h-0 z-10">
            <div 
              className="absolute -bottom-[5px] -left-[3px] w-[6px] h-[130px] bg-orange-primary origin-[50%_100%] rounded-t-md shadow-[0_0_5px_rgba(255,140,0,0.5)] transition-transform duration-[50ms] ease-linear"
              style={{ transform: `rotate(${angle}deg)` }}
            ></div>
            <div className="absolute -bottom-[15px] -left-[15px] w-[30px] h-[30px] bg-[#333] rounded-full border-2 border-orange-primary z-11 shadow-[0_2px_5px_rgba(0,0,0,0.5)]"></div>
          </div>
        </div>

        <img 
          src="https://res.cloudinary.com/ifuatk2z/image/upload/v1784573831/Sequ%C3%AAncia_03_h2pdd5.gif" 
          alt="Loading animation" 
          className="w-32 h-auto mix-blend-screen mt-8"
        />
      </motion.div>
    </AnimatePresence>
  );
}
