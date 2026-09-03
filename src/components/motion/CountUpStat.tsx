import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'motion/react';
import { useRef } from 'react';

interface Props {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}

export const CountUpStat: React.FC<Props> = ({ end, suffix = '', prefix = '', decimals = 0, duration = 2.5, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <span ref={ref} className={className}>
      {isInView ? (
        <CountUp end={end} suffix={suffix} prefix={prefix} decimals={decimals} duration={duration} useEasing={true} separator="." decimal="," />
      ) : (
        `${prefix}0${suffix}`
      )}
    </span>
  );
};
