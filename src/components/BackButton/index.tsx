import { useRouter } from "next/navigation"

export default function BackButton() {
  const router = useRouter()
  {/* Home button */}
  return (
    <button
      onClick={() => router.back()}
      className="fixed animate-float transition-transform hover:scale-105"
      style={{ top: 24, left: 8, zIndex: 50 }}
    >
      <img
        src="/assets/back.png"
        alt="home"
        style={{ width: 240, height: 240 }}
        draggable={false}
      />
    </button>
  )
}