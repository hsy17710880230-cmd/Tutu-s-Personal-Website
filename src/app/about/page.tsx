"use client";

import { useRouter } from "next/navigation";
import { LooseSprite } from "@/src/components/Sprites/LooseSprite";
import TitleWithNav from "@/src/components/Title";

export default function AboutPage() {
  const router = useRouter()
  return (
    <div className="relative w-full min-h-screen flex flex-col ">
      <TitleWithNav
        project="About Me:"
        backImg="/assets/about/rabbit.png"
      />
      {/* <LooseSprite
        imgX={500}
        imgY={500}
        imgW={540}
        imgH={540}
        src="/assets/about/rabbit.png"
        // onClick={() => console.log("Top left sprite")}
      />

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
        imgH={540}
        imgW={540}
        src="/assets/home.png"
        onClick={() => router.push("/")}
        whileHover={ { scale: 1.05 } }
      /> */}
      <LooseSprite
        imgX={3200}
        imgY={2000}
        imgW={540}
        imgH={540}
        src="/assets/about/badge.png"
        rotation={40}
        zIndex={100}
        onClick={() => router.push("/admin")}
      />

      {/* Center Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center mt-8 md:mt-16 max-w-3xl mx-auto text-center gap-8">
        {/* <section> */}
          {/* <h1 className="text-2xl md:text-4xl font-bold mb-4">About Me:</h1> */}
          <p className="text-lg md:text-2xl leading-relaxed">
            Hi, I’m Shiyun Hou ,a children’s illustrator from China, born in 2005.
My work explores the field of healing illustration, where I create gentle, imaginative worlds filled with warmth and storytelling.
          </p>
        {/* </section> */}

        {/* <section> */}
          {/* <h2 className="text-3xl font-semibold mb-4">Section Two</h2> */}
          <p className="text-lg md:text-2xl leading-relaxed">
            I specialise in children’s book illustration and enjoy working across a variety of handmade practices. I love experimenting with different materials and mediums, allowing each piece to find its own unique way of expression.
          </p>
        {/* </section> */}
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
