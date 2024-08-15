import { PropsWithChildren } from "react";

function BaseLayout({children, params, dialog}: PropsWithChildren<{ params: { trainer: string }, dialog: React.ReactNode}>) {
  return <div>{children}</div>
}

export default BaseLayout
export const fetchCache = 'force-no-store'