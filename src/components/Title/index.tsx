import { underline2Capitalized } from "@/src/lib/utils"
import { useRouter } from "next/navigation"

export default function TitleWithNav({
  project,
  description,
  backImg = "/assets/back.png",
  homeImg = "/assets/home.png",
}: {
  project: string,
  description?: string,
  backImg?: string,
  homeImg?: string
}) {
  const router = useRouter()

  return (
    <div className="w-full max-w-7xl mx-auto mb-12">
      <div className="grid grid-cols-3 items-center">
        {/* Back */}
        <div className="flex justify-start">
          <button
            onClick={() => router.back()}
            className="animate-float transition-transform hover:scale-105"
          >
            <img
              src={backImg || "/assets/back.png"}
              alt="Back"
              draggable={false}
              className="w-[110px] sm:w-[150px] md:w-[200px] lg:w-[240px]"
            />
          </button>
        </div>

        {/* Title */}
        <h1 className="text-center font-bold text-xl sm:text-2xl md:text-4xl lg:text-5xl leading-tight px-2">
          {underline2Capitalized(project)}
        </h1>

        {/* Home */}
        <div className="flex justify-end">
          <button
            onClick={() => router.push("/")}
            className="animate-float transition-transform hover:scale-105"
          >
            <img
              src={homeImg || "/assets/home.png"}
              alt="Home"
              draggable={false}
              className="w-[110px] sm:w-[150px] md:w-[200px] lg:w-[240px]"
            />
          </button>
        </div>
      </div>

      {description && (
        <p className="text-center text-lg md:text-xl mt-4 px-27.5 sm:px-37.5 md:px-50 lg:px-60">
          {underline2Capitalized(description)}
        </p>
      )}
    </div>
  )
}
