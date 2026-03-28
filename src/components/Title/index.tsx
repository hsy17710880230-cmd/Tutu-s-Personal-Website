import { underline2Capitalized } from "@/src/lib/utils"
import { useRouter } from "next/navigation"

export default function TitleWithNav({
  project,
}: {
  project: string
}) {
  const router = useRouter()

  return (
    <div className="w-full max-w-7xl mb-10 md:mb-12 px-3 sm:px-6">
      <div className="grid grid-cols-3 items-center">
        {/* Back */}
        <div className="flex justify-start">
          <button
            onClick={() => router.back()}
            className="animate-float transition-transform hover:scale-105"
          >
            <img
              src="/assets/back.png"
              alt="Back"
              draggable={false}
              className="w-[120px] sm:w-[160px] md:w-[220px] lg:w-[280px]"
            />
          </button>
        </div>

        {/* Title */}
        <h1 className="text-center font-bold text-xl sm:text-2xl md:text-4xl lg:text-5xl px-2 leading-tight">
          {underline2Capitalized(project as string)}
        </h1>

        {/* Home */}
        <div className="flex justify-end">
          <button
            onClick={() => router.push("/")}
            className="animate-float transition-transform hover:scale-105"
          >
            <img
              src="/assets/home.png"
              alt="Home"
              draggable={false}
              className="w-[120px] sm:w-[160px] md:w-[220px] lg:w-[280px]"
            />
          </button>
        </div>
      </div>
    </div>
  )
}
