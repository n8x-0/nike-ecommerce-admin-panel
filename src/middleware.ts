import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const token = await cookies().get("session_token")  
    if(token && token.name == "session_token"){
        return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/', request.url))
}
 
export const config = {
  matcher: '/admin/:path*',
}