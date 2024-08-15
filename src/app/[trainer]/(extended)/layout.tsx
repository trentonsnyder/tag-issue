import { type PropsWithChildren } from "react"

async function ExtendedLayout({
  children,
}: PropsWithChildren<{}>) {

  return <div>{children}</div>
}

export default ExtendedLayout
export const fetchCache = 'force-no-store'