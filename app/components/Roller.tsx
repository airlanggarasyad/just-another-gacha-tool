import { Typography } from "@mui/material";

import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";

type RollerProps = {
  timeout?: number;
  arrayData: string[];
  onRunningChange?: (running: boolean) => void;
};

type RollerData = {
  fps: number;
  candidateWinner?: string;
  timeout: number;
  isRunning: boolean;
  interval?: ReturnType<typeof setInterval>;
};

export type RollerHandle = {
  start: () => void;
  stop: () => void;
  isRunning: boolean;
};

const Roller = forwardRef<RollerHandle, RollerProps>(
  ({ timeout = 5000, arrayData, onRunningChange }, ref) => {
    const [rollerData, setRollerData] = useState<RollerData>({
      fps: 120,
      timeout,
      isRunning: false,
    });

    const isRunningRef = useRef(false);
    const arrayDataRef = useRef(arrayData);

    useEffect(() => {
      arrayDataRef.current = arrayData;
    }, [arrayData]);

    const setChoice = useCallback(() => {
      if (arrayDataRef.current.length === 0) return;

      const choice =
        arrayDataRef.current[
          Math.floor(Math.random() * arrayDataRef.current.length)
        ];

      setRollerData((prev) => ({
        ...prev,
        candidateWinner: choice,
      }));
    }, []);

    const start = () => {
      if (rollerData.interval) {
        clearInterval(rollerData.interval);
      }

      const newInterval = setInterval(setChoice, 1000 / rollerData.fps);

      setRollerData((prev) => ({
        ...prev,
        interval: newInterval,
        isRunning: true,
      }));

      isRunningRef.current = true;
      // onRunningChange?.(true);

      setTimeout(() => {
        setRollerData((prev) => {
          if (prev.isRunning) {
            clearInterval(prev.interval);
            isRunningRef.current = false;
            // onRunningChange?.(false);

            return { ...prev, isRunning: false, interval: undefined };
          }

          return prev;
        });
      }, rollerData.timeout);
    };

    const stop = () => {
      if (rollerData.interval) {
        clearInterval(rollerData.interval);
      }
      setRollerData((prev) => ({
        ...prev,
        isRunning: false,
        interval: undefined,
      }));

      isRunningRef.current = false;
      // onRunningChange?.(false);
    };

    useImperativeHandle(
      ref,
      () => {
        return {
          start,
          stop,
          get isRunning() {
            return rollerData.isRunning;
          },
        };
      },
      [rollerData.isRunning]
    );

    useEffect(() => {
      onRunningChange?.(rollerData.isRunning);
    }, [rollerData.isRunning, onRunningChange]);

    return (
      <div style={{ width: "100%" }}>
        {rollerData.isRunning
          ? "⏳ The truth is truthing your life decision..."
          : rollerData.candidateWinner
          ? "🎉 We have a winner!"
          : "🔮 Click GO! to start"}
        <Typography variant="h3" noWrap>
          {rollerData.candidateWinner ?? arrayData[0] ?? "Add items to start"}
        </Typography>
      </div>
    );
  }
);

export default Roller;
