'use client'

import {Button, ChakraProvider, Editable, EditablePreview, EditableTextarea, Textarea} from "@chakra-ui/react";
import {useState} from "react";
import {useRouter} from "next/navigation";
import { CookiesProvider } from 'react-cookie';
import 'regenerator-runtime/runtime'

export default function Page() {
    const [text, setText] = useState('');
    const router = useRouter();

    const handleInputChange = (e:any) => {
        let inputValue = e.target.value
        setText(inputValue)
    }

    const submit = () => {
        router.push('/read');
        localStorage.setItem('text', text)
    }

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
                            <Button colorScheme={'red'}>Upload Doc</Button>
                        </div>
                    </div>
                </div>
            </ChakraProvider>
        </CookiesProvider>
    )
}