'use client'

import {Button, Center, ChakraProvider, IconButton, Textarea} from "@chakra-ui/react";
import {useState} from "react";
import {useRouter} from "next/navigation";
import { CookiesProvider } from 'react-cookie';
import Dropzone from "../components/dropzone";
import 'regenerator-runtime/runtime'
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";


export default function Page() {
    const [text, setText] = useState('');
    const router = useRouter();

    const createQueryString = (name:string, value:string) => {
        const params = new URLSearchParams();
        params.set(name, value);

        return params.toString();
    };

    const handleInputChange = (e:any) => {
        let inputValue = e.target.value
        setText(inputValue)
    }

    const submit = () => {
        router.push('/read' + "?" + createQueryString("text", text))
    }

    const submitFile = (text: string) => {
        router.push('/read' + "?" + createQueryString("text", text))
    }

    const [showModal, setShowModal] = useState(false);

    return (
        <CookiesProvider>
            <ChakraProvider>
                <div className={"bg-slate-700 w-screen h-screen"}>
                    <div className={"flex flex-col items-center justify-center h-full w-full"}>
                        <div className={'w-4/5 lg:w-2/3 h-2/3 bg-slate-300 p-2 rounded-2xl bg-clip-content'}>
                            <Textarea variant={'flush'} placeholder={'Enter script'} resize={'none'} className={'border-none bg-slate-300'} w={'100%'} h={'100%'} value={text} onChange={handleInputChange} />
                        </div>
                        <div className={'flex flex-row space-x-10 mt-5'}>
                            <Button onClick={submit}>Submit</Button>
                            <Button colorScheme={'red'} onClick={() => setShowModal(true)}>Upload Doc</Button>
                        </div>
                    </div>
                    <div className={"fixed inset-0 bg-black bg-opacity-50 z-10 w-screen h-screen " + (showModal ? "" : "hidden")}>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-lg w-1/2 h-1/4 lg:h-1/2">
                            <Center className={'w-full h-full flex-col'}>
                                <Dropzone onResult={submitFile} />
                                <IconButton colorScheme={'red'} onClick={() => setShowModal(false)} aria-label={'close'} icon={<CloseIcon/>}></IconButton>
                            </Center>
                        </div>
                    </div>
                </div>
            </ChakraProvider>
        </CookiesProvider>
    )
}