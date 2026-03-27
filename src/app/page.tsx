"use client";

import { useRouter } from "next/navigation";
import FloatingSprite, { FloatingSpriteProps } from "../components/FloatingSprite";
import { useState } from "react";

const Home = () => {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const SPRITES: FloatingSpriteProps[] = [
    {
      x: 1420,
      y: 810,
      spriteW: 658,
      spriteH: 741,
      img_path: "/assets/homepage/rabbit.png",
      onHover: () => setShowDialog(true),
      onHoverEnd: () => setShowDialog(false),
      onClick: () => {router.push("/about")},
      hoverEffect: "hover:scale-105",
      zIndex: 20,
    },
    {
      x: 830,
      y: 1140,
      spriteW: 343,
      spriteH: 679,
      img_path: "/assets/homepage/tree1.png",
      onClick: () => {router.push("/work")},
      hoverEffect: "hover:scale-105",
    },
    {
      x: 1070,
      y: 910,
      spriteW: 282,
      spriteH: 813,
      img_path: "/assets/homepage/tree2.png",
      onClick: () => {router.push("/illustration")},
      hoverEffect: "hover:scale-105",
    },
    {
      x: 1920,
      y: 780,
      spriteW: 554,
      spriteH: 353,
      img_path: "/assets/homepage/dialog.png",
      zIndex: 30,
      onClick: () => setShowDialog(false),
    },
    {
      x: 1740,
      y: 1230,
      spriteW: 361,
      spriteH: 357,
      img_path: "/assets/homepage/fishtank.png",
      onClick: () => {router.push("/handmade")},
      hoverEffect: "hover:scale-105",
    },
    {
      x: 1370,
      y: 1300,
      spriteW: 174,
      spriteH: 178,
      img_path: "/assets/homepage/pot.png",
      onClick: () => {router.push("/sketch")},
      hoverEffect: "hover:scale-105",
    },
    {
      x: 1750,
      y: 1410,
      spriteW: 256,
      spriteH: 80,
      img_path: "/assets/homepage/HandMade.png",
      // onClick: () => router.push("/handmade"),
    },
    {
      x: 1100,
      y: 1330,
      spriteW: 234,
      spriteH: 75,
      img_path: "/assets/homepage/Illustration.png",
      // onClick: () => router.push("/illustration"),
    },
    {
      x: 830,
      y: 1500,
      spriteW: 135,
      spriteH: 82,
      img_path: "/assets/homepage/Work.png",
      // onClick: () => router.push("/work"),
    },
    {
      x: 1380,
      y: 1400,
      spriteW: 157,
      spriteH: 80,
      img_path: "/assets/homepage/Sketch.png",
      // onClick: () => router.push("/sketch"),
    },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Sprites Navigator */}
      {SPRITES.map((it, i) => {
        if (it.img_path === "/assets/homepage/dialog.png" && !showDialog) return null;
        return <FloatingSprite key={i} {...it} />;
      })}

      {/* Background Fixed */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/homepage/bg.png')",
        }}
      />
    </div>
  );
};

export default Home;
