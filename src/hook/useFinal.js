import {useEffect, useRef} from 'react';

export default function useFinal(start, callback, dependency = [], ms = 1000) {
  const refTimeout = useRef();
  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    if (refTimeout.current) {
      clearTimeout(refTimeout.current);
    }
    refTimeout.current = setTimeout(() => {
      callback();
    }, ms);
  }, dependency);
}
