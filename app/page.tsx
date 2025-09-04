"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Button, Box, TextField, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const SEED = 130725;
const RAND = mulberry32(SEED);

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

export default function Home() {
  const [itemsTx, setItemsTx] = useState<string>('');

  const [itemsArr, setItemsArr] = useState<string[]>([]);
  const [generateItemCount, setGenerateItemCount] = useState<number>(0);

  const [uniqueCount, setUniqueCount] = useState(0);
  const [randomizeCountErr, setRandomizeCountErr] = useState<boolean>(false);

  const [candidateWinner, setCandidateWinner] = useState<string>('');

  useEffect(() => {
    if (itemsTx.length > 0) {
      const arr = itemsTx
        .split("\n")
        .filter(line => line !== "");

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
  }, [generateItemCount, uniqueCount])

  const onTextFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    const randomizedArrayTx = randomizedArray.join("\n")

    setItemsArr(randomizedArray);
    setItemsTx(randomizedArrayTx);
  }

  const validateCount = () => {
    if (generateItemCount > uniqueCount && uniqueCount > 1) {
      setRandomizeCountErr(false);
    } else {
      setRandomizeCountErr(true);
    }
  }

  const chooseItem = () => {
    const randomItemResult = getRandomItem(itemsArr);

    setCandidateWinner(randomItemResult);
  }

  const handleReset = () => {
    const uniqueArray = [...new Set(itemsArr)];
    const uniqueArrayTx = uniqueArray.join('\n');

    setItemsArr(uniqueArray);
    setItemsTx(uniqueArrayTx);
    setCandidateWinner('');
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col w-full gap-8 row-start-2 items-center sm:flex-row sm:items-start sm:w-4/5">
        <div className="flex flex-col gap-8 row-start-2 items-center sm:items-start w sm:w-3/5">
          <ThemeProvider theme={theme}>
            <Typography variant="h1" sx={{ fontSize: "2em", fontWeight: 600 }}>Just Another Gacha Tool</Typography>
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
                gap: 2
              }}
            >
              <TextField
                id="outlined-basic"
                label="Randomize Count"
                variant="outlined"
                type="number"
                sx={{ width: "55%" }}
                defaultValue={generateItemCount}
                // error={randomizeCountErr}
                // helperText={
                //   randomizeCountErr
                //     ? "Randomize count cannot exceed the number of unique items"
                //     : ""
                // }
                onChange={onItemCountsChange}
              />
              <Button variant="contained" onClick={handleRandomizeCandidates} disabled={randomizeCountErr}>Generate</Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                width: "100%"
              }}
            >
              <Button variant="contained" onClick={handleReset} disabled={randomizeCountErr} color="error" sx={{ height: "100%" }}>Reset</Button>
              <Button variant="contained" onClick={chooseItem} disabled={randomizeCountErr} color="success" sx={{ height: "100%" }}>Go!</Button>
            </Box>
          </ThemeProvider>
        </div>
        <div className="flex flex-col gap-8 row-start-2 items-center sm:items-start w sm:w-2/5">
          {candidateWinner && candidateWinner !== '' ?
            <Box>
              <Typography variant="body1">🎉 We have a winner!</Typography>
              <Typography variant="h1">{candidateWinner}</Typography>
            </Box> : <Box>
              <Typography variant="body1">⌛ Click GO to proceed</Typography>
            </Box>}
        </div>

      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        Crafted for Amira Fadilla ❤︎
      </footer>
    </div>
  );
}

function getRandomArray<T>(myArray: T[], n: number): T[] {
  const uniqueItems = Array.from(new Set(myArray));

  if (n < uniqueItems.length) {
    throw new Error(`n must be at least ${uniqueItems.length} to include all unique items`);
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
    let t = seed += 0x6D2B79F5;

    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

function getRandomItem(arr: string[]) {
  const index = Math.floor(RAND() * arr.length);

  return arr[index];
}