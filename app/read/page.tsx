'use client'

import 'regenerator-runtime/runtime'
import { useSearchParams } from "next/navigation";
import {createRef, RefObject, useEffect, useState} from "react";
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import {Button, ChakraProvider} from "@chakra-ui/react";

export default function Page() {
    const searchParams = useSearchParams()
    let words = searchParams.get('text')?.split(' ');

    // @ts-ignore
    const refs = words.reduce((acc, val, i) => {
        acc[i] = createRef<HTMLSpanElement>();
        return acc;
    }, {} as { [key: number]: RefObject<HTMLSpanElement> });

    const scrollToWord = (index: number) => {
        refs[index].current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
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
    const [latestWordIndex, setLatestWordIndex] = useState(-1); // Track the index of the latest recognized word

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
        if (end > words.length - 1) {
            // @ts-ignore
            end = words.length - 1;
        }

        for (let i = start; i < end; i++) {
            // @ts-ignore
            if (words[i].includes(latestWord.replace(/[^a-zA-Z0-9]/g, ""))) {
                scrollToWord(i + 1); // Scroll to the word with the latestWord
                setLatestWordIndex(i)
                break; // Stop searching after the first match
            }
        }
    }, [latestWord, latestWordIndex, scrollToWord, transcript, words]);

    const resetTranscriptAndLatestWord = () => {
        resetTranscript();
        setLatestWord("");
        setLatestWordIndex(-1);
    }

    return (
        <ChakraProvider>
            <div className={"bg-slate-700 w-screen h-screen"}>
                <div className={"flex flex-col items-center justify-center h-full w-full px-4 py-10"}>
                    <div className={'w-full h-full lg:w-2/3 lg:h-2/3 bg-slate-300 rounded-2xl p-2 overflow-auto'}>
                        <div id={'scrollable'} className={'break-words'}>
                            {words?.map((word, index) => {
                                return <span key={index} ref={refs[index]} className={(latestWordIndex + 1 == index) ? 'text-white text-xl bg-slate-800 bg-opacity-60' : 'text-black text-xl'}>{word + " "}</span>
                            })}
                        </div>
                    </div>
                    <div className={'flex flex-row space-x-10 mt-5'}>
                        <Button onClick={listenContinuously}>Start</Button>
                        <Button colorScheme={'red'} onClick={resetTranscriptAndLatestWord}>Reset</Button>
                        <p>{latestWord}</p>
                    </div>
                </div>
            </div>
        </ChakraProvider>
    )
}