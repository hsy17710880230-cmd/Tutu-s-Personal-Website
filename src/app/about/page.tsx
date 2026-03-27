"use client";

import { useRouter } from "next/navigation";
import FloatingSprite from "../../components/FloatingSprite";

export default function AboutPage() {
  const router = useRouter()
  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">
      
      {/* Top Left Sprite */}
      <FloatingSprite
        x={500}
        y={500}
        spriteW={540}
        spriteH={540}
        img_path="/assets/about/rabbit.png"
        // onClick={() => console.log("Top left sprite")}
      />

      {/* Bottom Right Sprite */}
      <FloatingSprite
        x={1900}
        y={1354}
        spriteW={540}
        spriteH={540}
        img_path="/assets/about/badge.png"
        rotation={30}
        // onClick={() => console.log("Bottom right sprite")}
      />

      <FloatingSprite
        x={1900}
        y={500}
        spriteH={360}
        spriteW={360}
        img_path="/assets/home.png"
        onClick={() => router.push("/")}
        hoverEffect="hover:scale-105"
      />

      {/* Center Content */}
      <div className="relative z-10 max-w-3xl text-center space-y-12 px-6">
        <section>
          <h1 className="text-2xl md:text-4xl font-bold mb-4">About Me:</h1>
          <p className="text-lg md:text-2xl leading-relaxed">
            Hi, I’m Shiyun Hou ,a children’s illustrator from China, born in 2005.
My work explores the field of healing illustration, where I create gentle, imaginative worlds filled with warmth and storytelling.
          </p>
        </section>

        <section>
          {/* <h2 className="text-3xl font-semibold mb-4">Section Two</h2> */}
          <p className="text-lg md:text-2xl leading-relaxed">
            I specialise in children’s book illustration and enjoy working across a variety of handmade practices. I love experimenting with different materials and mediums, allowing each piece to find its own unique way of expression.
          </p>
        </section>
      </div>

      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/bg.png')",
        }}
      />
    </div>
  );
}
