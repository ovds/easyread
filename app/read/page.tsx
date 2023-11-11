'use client'

import 'regenerator-runtime/runtime'
import {createRef, RefObject, useEffect, useMemo, useState} from "react";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import {Button, ChakraProvider} from "@chakra-ui/react";
import { IconButton } from '@chakra-ui/react'
import {AddIcon, MinusIcon} from "@chakra-ui/icons";
import {useSearchParams} from "next/navigation";

export default function Page() {
    const searchParams = useSearchParams()
    const words = searchParams.get('text')?.split(' ') || [];

    // @ts-ignore
    const refs = words.reduce((acc, val, i) => {
        acc[i] = createRef<HTMLSpanElement>();
        return acc;
    }, {} as { [key: number]: RefObject<HTMLSpanElement> });

    const scrollToWord = (index: number) => {
        refs[index].current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    };

    const {
        transcript,
        interimTranscript,
        finalTranscript,
        resetTranscript,
        listening,
    } = useSpeechRecognition();

    const listenContinuously = () => {
        SpeechRecognition.startListening({
            continuous: true,
            language: 'en-GB',
        });
    };

    const [latestWord, setLatestWord] = useState(""); // Track the latest recognized word
    const [latestWordIndex, setLatestWordIndex] = useState(0); // Track the index of the latest recognized word

    useEffect(() => {
        if (transcript) {
            setLatestWord(transcript.split(" ").pop() || "");
        }

        if (latestWordIndex < 0) {
            return; // No need to process if the latestWordIndex is not set
        }

        let start = latestWordIndex - 2;
        if (start < 0) {
            start = 0;
        }

        let end = latestWordIndex + 10;
        // @ts-ignore
        if (end > words.length) {
            // @ts-ignore
            end = words.length;
        }

        if (words.length > 0 && words) {
            for (let i = latestWordIndex; i < end - 5; i++) {
                // @ts-ignore
                if (words[i].includes(latestWord.replace(/[^a-zA-Z0-9]/g, ""))) {
                    scrollToWord(i); // Scroll to the word with the latestWord
                    setLatestWordIndex(i)
                    break; // Stop searching after the first match
                }
            }

            for (let i = start; i < latestWordIndex + 1; i++) {
                // @ts-ignore
                if (words[i].includes(latestWord.replace(/[^a-zA-Z0-9]/g, ""))) {
                    scrollToWord(i); // Scroll to the word with the latestWord
                    setLatestWordIndex(i)
                    break; // Stop searching after the first match
                }
            }

            for (let i = latestWordIndex; i < end; i++) {
                // @ts-ignore
                if (words[i].includes(latestWord.replace(/[^a-zA-Z0-9]/g, ""))) {
                    scrollToWord(i); // Scroll to the word with the latestWord
                    setLatestWordIndex(i)
                    break; // Stop searching after the first match
                }
            }
        }
    }, [latestWord, latestWordIndex, scrollToWord, transcript, words]);

    const [fontSize, setFontSize] = useState(16);
    const [lineHeight, setLineHeight] = useState(24);

    const increaseFont = () => {
        setFontSize((prevSize) => Math.min(48,prevSize + 2));
        setLineHeight((prevHeight) => Math.min(72,(((prevHeight/2.0) + 2) * 2.0)));
      };
    
      const decreaseFont = () => {
        setFontSize((prevSize) => Math.max(10, prevSize - 2));
        setLineHeight((prevHeight) => Math.max(15,(((prevHeight/2.0) - 2) * 2.0)));
      };

    const reset = () => {
        resetTranscript();
        setLatestWord("");
        setLatestWordIndex(0);
    }
      
    return (
        <ChakraProvider>
            <div className={"bg-slate-700 w-screen h-screen"}>
                <div className={"flex flex-col items-center justify-center h-full w-full px-4 py-10"}>
                    <div className={'flex flex-row space-x-5 mt-5 mb-5'}>
                    <IconButton
                        aria-label='Decrease font'
                        onClick={decreaseFont}
                        icon={<MinusIcon />}
                        />
                    <IconButton
                        aria-label='Increase font'
                        onClick={increaseFont}
                        icon={<AddIcon />}
                        />
                    
                    </div>
                    <div className={'w-full h-full lg:w-2/3 lg:h-2/3 bg-slate-300 rounded-2xl p-2 overflow-auto'}>
                        <div id={'scrollable'} className={'break-words transition-transform duration-10'}>
                            {words?.map((word, index) => {
                                return <span key={index} ref={refs[index]} style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` }} className={(((latestWordIndex + 1) == index && latestWordIndex != 0) || (latestWordIndex == 0 && index == 0)) ? 'text-white text-2xl font-bold' : 'text-black text-xl'}>{word + " "}</span>
                            })}
                        </div>
                    </div>
                    <div className={'flex flex-row space-x-10 mt-5'}>
                        <Button onClick={listenContinuously}>Start</Button>
                        <Button colorScheme={'red'} onClick={reset}>Reset</Button>
                    </div>
                </div>
            </div>
        </ChakraProvider>
    )
}