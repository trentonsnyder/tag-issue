function TrainerBase({params: { trainer}}: {params: { trainer: string}}) {
  return <div>TrainerBase - {trainer}</div>
}

export default TrainerBase
export const revalidate = 300
export const dynamic = 'force-static'
export async function generateStaticParams() {
  return []
}