import { useState, useEffect } from 'react';

const Lights = ({ Opacity, Color }: { Opacity: number; Color: string }) => {
  const videoRect = useLargestVideo();
  const [color, setColor] = useState(Color);
  const [opacity, setOpacity] = useState(Opacity);

  useEffect(() => {
    const listener = (message: any) => {
      if (message.action === 'setColor') {
        setColor(message.color);
      }

      if (message.action === 'setOpacity') {
        setOpacity(message.opacity / 100);
      }
    };

    browser.runtime.onMessage.addListener(listener);

    return () => {
      browser.runtime.onMessage.removeListener(listener);
    };
  }, []);

  if (!videoRect) return null;

  return (
    <>
      <div
        id="Turn_Off_Lights"
        style={{
          backgroundColor: color,
          height: '100vh',
          width: '100vw',
          opacity: opacity,
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: '2147483646',
          clipPath: `polygon(
          0 0,
          100% 0,
          100% 100%,
          0 100%,
          0 0,
          ${videoRect.left}px ${videoRect.top}px,
          ${videoRect.left}px ${videoRect.bottom}px,
          ${videoRect.right}px ${videoRect.bottom}px,
          ${videoRect.right}px ${videoRect.top}px,
          ${videoRect.left}px ${videoRect.top}px
        )`,
        }}
      />
    </>
  );
};

export default Lights;
