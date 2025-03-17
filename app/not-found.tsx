import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-muted-foreground mt-2">The page you are looking for does not exist or has been moved.</p>
      <Button className="mt-6">
        <Link href="/users">Go to Users</Link>
      </Button>
    </div>
  )
}
