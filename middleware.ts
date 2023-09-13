import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// export async function middleware(req: NextRequest) {
//     const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    
//     if(!session) {
//         const requestedPage = req.nextUrl.pathname
//         const url = req.nextUrl.clone()

//         url.pathname = `/auth/login`
//         url.search = `p=${ requestedPage }`

//         return NextResponse.redirect(url)
//     }
    
//     return NextResponse.next()
// }

// export const config ={
//     matcher: ['/checkout/address', '/checkout/summary']
// }

// export async function middleware (req: NextRequest) {
//     const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
//     if(!session) {
//         const requestedPage = req.nextUrl.pathname
//         return NextResponse.redirect(`/auth/login?p=${ requestedPage }`)
//     }

//     const validRoles = ['admin', 'super-user', 'SEO']

//     if (!validRoles.includes(session.user.role)) {
//         return NextResponse.redirect('/')
//     }

//     return NextResponse.next()
// }

// export async function middleware (req: NextRequest) {
//     const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
//     if(!session) {
//         return new Response( JSON.stringify({ message: 'No autorizado' }), {
//             status: 401,
//             headers: {
//                 'Content-Type':'application/json'
//             }
//         })
//     }

//     const validRoles = ['admin', 'super-user', 'SEO']

//     if (!validRoles.includes(session.user.role)) {
//         return new Response( JSON.stringify({ message: 'No autorizado' }), {
//             status: 401,
//             headers: {
//                 'Content-Type':'application/json'
//             }
//         })
//     }

//     return NextResponse.next()
// }
 
export async function middleware(req: NextRequest) {
  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
 
 
  if (!session) {
 
    if (req.nextUrl.pathname.startsWith('/api/admin')) {
      return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
    }
 
    const requestedPage = req.nextUrl.pathname;
    return NextResponse.redirect(new URL(`/auth/login?p=${requestedPage}`, req.url));;
  }
 
  const validRoles = ['admin'];
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!validRoles.includes(session.user.role)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
 
  if (req.nextUrl.pathname.startsWith('/api/admin')) {
    if (!validRoles.includes(session.user.role)) {
      return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
    }
  }
 
  return NextResponse.next();
}
 
export const config = {
  matcher: ['/checkout/:path*', '/admin/:path*', '/api/admin/:path*'],
};