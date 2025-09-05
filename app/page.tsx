"use client";

import { useEffect, useState, useRef } from "react";

import { Button, Box, TextField, Typography, Container } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Roller, { RollerHandle } from "./components/Roller";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

export default function Home() {
  const [itemsTx, setItemsTx] = useState<string>("");

  const [itemsArr, setItemsArr] = useState<string[]>([]);
  const [generateItemCount, setGenerateItemCount] = useState<number>(0);

  const [uniqueCount, setUniqueCount] = useState(0);
  const [randomizeCountErr, setRandomizeCountErr] = useState<boolean>(false);

  const [isRunning, setIsRunning] = useState(false);

  const rollerRef = useRef<RollerHandle>(null);

  useEffect(() => {
    if (itemsTx.length > 0) {
      const arr = itemsTx.split("\n").filter((line) => line !== "");

      setItemsArr(arr);

      const uniqueCountTmp = new Set(arr).size;
      setUniqueCount(uniqueCountTmp);

      validateCount();
    } else {
      setItemsArr([]);
      setUniqueCount(0);
    }
  }, [itemsTx]);

  useEffect(() => {
    validateCount();
  }, [generateItemCount, uniqueCount]);

  const onTextFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setItemsTx(e.target.value);
  };

  const onItemCountsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const raw = e.target.value;

    if (raw === "") {
      setGenerateItemCount(0);
      return;
    }

    const valueCount = parseInt(raw, 10);
    setGenerateItemCount(valueCount);

    validateCount();
  };

  const handleRandomizeCandidates = () => {
    const randomizedArray = getRandomArray(itemsArr, generateItemCount);
    const randomizedArrayTx = randomizedArray.join("\n");

    setItemsArr(randomizedArray);
    setItemsTx(randomizedArrayTx);
  };

  const validateCount = () => {
    if (generateItemCount > uniqueCount && uniqueCount > 1) {
      setRandomizeCountErr(false);
    } else {
      setRandomizeCountErr(true);
    }
  };

  const handleReset = () => {
    const uniqueArray = [...new Set(itemsArr)];
    const uniqueArrayTx = uniqueArray.join("\n");

    setItemsArr(uniqueArray);
    setItemsTx(uniqueArrayTx);
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20">
      <main className="flex flex-col w-full gap-8 row-start-2 items-center sm:flex-row sm:items-start sm:w-4/5">
        <ThemeProvider theme={theme}>
          <Container>
            <Typography
              variant="h1"
              sx={{ fontSize: "2em", fontWeight: 600, marginBottom: "1em" }}
              textAlign={"center"}
            >
              Wiggle of Fortune
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <div className="flex flex-col gap-8 row-start-2 items-center sm:items-start w sm:w-3/5">
                <Box
                  component="form"
                  sx={{ width: "100%" }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="outlined-basic"
                    label="Candidates"
                    variant="outlined"
                    multiline
                    rows={10}
                    fullWidth
                    value={itemsTx}
                    onChange={onTextFormChange}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    label="Randomize Count"
                    variant="outlined"
                    type="number"
                    sx={{ width:  { xs: "40%", sm: "25%" },}}
                    defaultValue={generateItemCount}
                    onChange={onItemCountsChange}
                    onClick={(e) => {
                      const input = e.target as HTMLInputElement;

                      if (input.value === "0") {
                        input.value = "";
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleRandomizeCandidates}
                    disabled={randomizeCountErr}
                  >
                    Generate
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleReset}
                    disabled={itemsArr.length < 2}
                    color="warning"
                    sx={{ height: "100%" }}
                  >
                    Reset
                  </Button>
                  {isRunning ? (
                    <Button
                      variant="contained"
                      onClick={() => rollerRef.current?.stop()}
                      disabled={itemsArr.length < 2}
                      color="error"
                      sx={{ height: "100%" }}
                    >
                      Stop!
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => rollerRef.current?.start()}
                      disabled={itemsArr.length < 2}
                      color="success"
                      sx={{ height: "100%" }}
                    >
                      Go!
                    </Button>
                  )}
                </Box>
              </div>
              <div className="flex flex-col gap-8 row-start-2 items-center sm:items-start w sm:w-2/5">
                <Roller
                  arrayData={itemsArr}
                  ref={rollerRef}
                  onRunningChange={setIsRunning}
                />
              </div>
            </Box>
          </Container>
        </ThemeProvider>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        Crafted by Airlangga Fidiyanto for Amira Fadilla ❤︎
      </footer>
    </div>
  );
}

function getRandomArray<T>(myArray: T[], n: number): T[] {
  const uniqueItems = Array.from(new Set(myArray));

  if (n < uniqueItems.length) {
    throw new Error(
      `n must be at least ${uniqueItems.length} to include all unique items`
    );
  }

  const shuffled = [...uniqueItems];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const result: T[] = [...shuffled];

  while (result.length < n) {
    const randIndex = Math.floor(Math.random() * myArray.length);
    result.push(myArray[randIndex]);
  }

  return result;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);

    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
