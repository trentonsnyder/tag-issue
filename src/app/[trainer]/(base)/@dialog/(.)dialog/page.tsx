import React from 'react'

async function Page({
  params: { trainer}
}: {
  params: { trainer: string }
}) {
  return <div>The Dialog - {trainer}</div>
}

export default Page
