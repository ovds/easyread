'use server'

import {cookies} from "next/headers";

export default async function getCook() {
    // get cookie
    const cookieStore = cookies();
    return cookieStore.get('text')?.value || '';
}

export async function setCook(text: string) {
    // set cookie
    const cookieStore = cookies();
    cookieStore.set('text', text);
}