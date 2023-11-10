'use client'
import { ChakraProvider, Button } from '@chakra-ui/react'
import Link from 'next/link'
import 'regenerator-runtime/runtime'

export default function Home() {
  return (
      <ChakraProvider>
        <div className={"bg-slate-700 w-screen h-screen"}>
          <div className={"flex flex-col items-center justify-center h-full w-full"}>
            <div className={"flex flex-row text-5xl w-full items-center justify-center"}>
              <h1 className={"text-white font-bold"}>Easy</h1>
              <h1 className="bg-clip-text font-extrabold text-transparent bg-gradient-to-r from-blue-500 to-violet-500 italic pr-3">Read</h1>
            </div>
            <Button variant={'outline'} colorScheme={'cyan'} size="lg" className={"mt-10"}><Link href={"/script"}>Get Started!</Link></Button>
          </div>
        </div>
      </ChakraProvider>
  )
}
