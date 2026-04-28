import { useInView } from 'motion/react';
import { useCallback, useEffect, useRef } from 'react';

interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const isInView = useInView(ref, { once: true, margin: '0px' });

  const getDecimalPlaces = (num: number): number => {
    const str = num.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatValue = useCallback(
    (latest: number) => {
      const hasDecimals = maxDecimals > 0;

      const options: Intl.NumberFormatOptions = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0
      };

      const formattedNumber = Intl.NumberFormat('en-US', options).format(latest);

      return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
    },
    [maxDecimals, separator]
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(direction === 'down' ? to : from);
    }
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === 'function') {
        onStart();
      }

      const timeoutId = setTimeout(() => {
        const startTime = performance.now();
        const startValue = direction === 'down' ? to : from;
        const endValue = direction === 'down' ? from : to;
        const totalDuration = Math.max(duration * 1000, 1);

        const tick = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / totalDuration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          const latest = startValue + (endValue - startValue) * easedProgress;

          if (ref.current) {
            ref.current.textContent = formatValue(progress >= 1 ? endValue : latest);
          }

          if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame(tick);
            return;
          }

          animationFrameRef.current = null;

          if (typeof onEnd === 'function') {
            onEnd();
          }
        };

        animationFrameRef.current = requestAnimationFrame(tick);
      }, delay * 1000);

      return () => {
        clearTimeout(timeoutId);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      };
    }
  }, [isInView, startWhen, direction, from, to, delay, onStart, onEnd, duration, formatValue]);

  return <span className={className} ref={ref} />;
}
