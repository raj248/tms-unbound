import { useNavigate } from "react-router-dom"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { TablerIcons } from "@workspace/ui/lib/Icons"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <Card className="w-full max-w-md border-dashed text-center shadow-lg">
        <CardHeader className="flex flex-col items-center justify-center pt-8">
          {/* Animated Error Icon Icon */}
          <div className="mb-4 flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <TablerIcons.IconAlertCircle className="h-10 w-10" />
          </div>
          <span className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Error 404
          </span>
          <CardTitle className="mt-2 text-3xl font-bold tracking-tight">
            Page Not Found
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-balance text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved, deleted, or the URL might be mistyped.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col justify-center gap-2 pt-4 pb-8 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="inline-flex w-full items-center gap-2 sm:w-auto"
          >
            <TablerIcons.IconArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <Button
            onClick={() => navigate("/")}
            className="inline-flex w-full items-center gap-2 sm:w-auto"
          >
            <TablerIcons.IconHome className="h-4 w-4" />
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
