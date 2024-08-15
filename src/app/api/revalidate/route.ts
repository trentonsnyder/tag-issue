import { type NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const res = await request.json()
  const trainer = res?.trainer
  
  if (trainer) {
    revalidatePath(`/${trainer}`)
    return Response.json({})
  }
    
 return Response.json({ error: 'No trainer provided' }, { status: 400 })
}