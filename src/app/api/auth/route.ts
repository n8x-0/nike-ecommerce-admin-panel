import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    const body = await request.json()

    if (body == "verify") {
        const cookie = cookies().get("session_token");
        const verification = jwt.verify(cookie?.value as string, process.env.JWT_SECRET as string)
        const { name, password } = verification as { name: string, password: string }
        if (name === process.env.AUTH_NAME && password === process.env.AUTH_PASSWORD){
            return NextResponse.json({ message: "verificaiton success" }, { status: 200 })
        }
        return NextResponse.json({ message: "verification failed" }, { status: 401 })
    }

    const { name, password } = body
    if (name == process.env.AUTH_NAME && password == process.env.AUTH_PASSWORD) {
        const token = jwt.sign({ name, password }, process.env.JWT_SECRET as string)

        if (token) {
            cookies().set("session_token", token, { httpOnly: true, path: "/" });
        }
        return NextResponse.json({ message: "Authenticated" }, { status: 200 })
    }
    return NextResponse.json({ message: "Not Authenticated" }, { status: 401 })
}

export async function GET() {
    const cookie = cookies().delete("session_token")
    console.log("deleting cookie: ", cookie);

    return NextResponse.json({ message: "success" }, { status: 200 })
}