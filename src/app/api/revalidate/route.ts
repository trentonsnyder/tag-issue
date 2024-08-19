import { createEdgeRouter, type NextHandler } from 'next-connect'
// @ts-ignore
import { type EdgeRouter } from 'next-connect/dist/types/edge'
import { NextResponse, type NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export interface ParsedNextRequest extends NextRequest {
  parsedBody?: any
}

function base<T = null>(): EdgeRouter<ParsedNextRequest, T> {
  return createEdgeRouter<NextRequest, T>().use(parseBody)
}

/* ----- Middleware ----- */

async function parseBody(
  req: ParsedNextRequest,
  _ctx: unknown,
  next: NextHandler
) {
  if (!req.body) return next()

  try {
    const body = await req.json()
    req.parsedBody = body
    return next()
  } catch (e) {
    req.parsedBody = {}
    return next()
  }
}

function validateBody(bodySchema: z.AnyZodObject) {
  return async (req: ParsedNextRequest, _ctx: unknown, next: NextHandler) => {
    try {
      req.parsedBody = await bodySchema.parseAsync(req.parsedBody)
      return next()
    } catch (error) {
      console.log(req, 'invalid request', error)
      let err = error
      if (err instanceof z.ZodError) {
        err = err.issues.map((e) => ({ path: e.path[0], message: e.message }))
        return NextResponse.json(
          { error: err },
          { status: 422 }
        )
      }
      return new NextResponse(null, { status: 501 })
    }
  }
}

async function applyCors(_req: NextRequest, _ctx: unknown, next: NextHandler) {
  const res = await next()

  res.headers.append('Access-Control-Allow-Origin', '*')
  // currently do not have any GET/PUT/DELETE, so narrowing for the time being.
  res.headers.append('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.headers.append(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )

  return res
}

const revalidatePathSchema = z.object({
  trainer: z.string()
})

type RevalidatePathSchema = z.infer<typeof revalidatePathSchema>
type RevalidatePathRequest = Omit<ParsedNextRequest, 'parsedBody'> & {
  // TODO: Ask Jaymon why parsedBody has to be optionally typed here. The idea of zod is to validate the body and 400 any malformed requests.
  // Is it just a typescript thing we can't get around? I don't like the ! bangs and optional chaining i'm seeing in other route files
  parsedBody?: RevalidatePathSchema
}

function rp(req: RevalidatePathRequest) {
  const id = req.parsedBody?.trainer

  if (!id) {
    return new NextResponse(null, { status: 400 })
  }

  // https://nextjs.org/docs/app/api-reference/functions/revalidatePath
  revalidatePath(`/${id}`)

  return new NextResponse(null, { status: 200 })
}

const router = base().use(applyCors).use(validateBody(revalidatePathSchema)).post(rp)

export async function POST(req: RevalidatePathRequest) {
  return router.run(req, null) as Promise<NextResponse>
}
