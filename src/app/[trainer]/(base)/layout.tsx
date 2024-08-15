import { PropsWithChildren } from "react";

function BaseLayout({children, params}: PropsWithChildren<{ params: { trainer: string }}>) {
  return <div>{children}</div>
}

export default BaseLayout
export const fetchCache = 'force-no-store'