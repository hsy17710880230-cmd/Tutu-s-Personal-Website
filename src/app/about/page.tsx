"use client";

import { useRouter } from "next/navigation";
import LooseSprite from "../../components/LooseSprite";

export default function AboutPage() {
  const router = useRouter()
  return (
    <div className="w-full fixed z-100 min-h-screen overflow-hidden flex items-center justify-center">
      
      {/* Top Left Sprite */}
      <LooseSprite
        imgX={500}
        imgY={500}
        imgW={540}
        imgH={540}
        src="/assets/about/rabbit.png"
        // onClick={() => console.log("Top left sprite")}
      />

      {/* Bottom Right Sprite */}
      <LooseSprite
        imgX={2250}
        imgY={1450}
        imgW={540}
        imgH={540}
        src="/assets/about/badge.png"
        rotation={40}
        zIndex={-100}
        // onClick={() => console.log("Bottom right sprite")}
      />

      <LooseSprite
        imgX={1900}
        imgY={500}
        imgH={360}
        imgW={360}
        src="/assets/home.png"
        onClick={() => router.push("/")}
        whileHover={ { scale: 1.05 } }
      />

      {/* Center Content */}
      <div className="relative z-10 max-w-3xl text-center space-imgY-12 px-6">
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
