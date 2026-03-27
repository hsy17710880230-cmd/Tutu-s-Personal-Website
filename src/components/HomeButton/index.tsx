import { useRouter } from "next/navigation"

export default function HomeButton() {
  const router = useRouter()
  {/* Home button */}
  return (
    <button
      onClick={() => router.push("/")}
      className="fixed animate-float transition-transform hover:scale-105"
      style={{ top: 24, right: 8, zIndex: 50 }}
    >
      <img
        src="/assets/home.png"
        alt="home"
        style={{ width: 240, height: 240 }}
        draggable={false}
      />
    </button>
  )
}