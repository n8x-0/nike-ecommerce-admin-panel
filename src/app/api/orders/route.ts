import sanityClient from "@/sanity/sanity.client";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const orders = await sanityClient.fetch(`*[_type=="order"]`)
        console.log(orders);
        
        return NextResponse.json(orders, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Failed" , error : error}, { status: 401 })
    }
}   