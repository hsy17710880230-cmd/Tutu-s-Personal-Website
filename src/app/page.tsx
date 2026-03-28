"use client";

import { useRouter } from "next/navigation";
import FloatingSprite, { FloatingSpriteProps } from "../components/FloatingSprite";
import { useState } from "react";
import { ContactTooltip } from "../components/ContactTooltip";

const Home = () => {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const [showWeChatQR, setShowWeChatQR] = useState<boolean>(false);
  const [showWeChatDetails, setShowWeChatDetails] = useState<boolean>(false);
  const [showEmailDetails, setShowEmailDetails] = useState<boolean>(false);
  // const [showWeChatQR, setShowWeChatQR] = useState<boolean>(false);
  const [showInsDetails, setShowInsDetails] = useState<boolean>(false);
  // const [showWeChatQR, setShowWeChatQR] = useState<boolean>(false);

  const SPRITES: FloatingSpriteProps[] = [
    {
      hitboxX: 1700,
      hitboxY: 750,
      hitboxW: 800,
      hitboxH: 1000,
      src: "/assets/homepage/rabbit.png",
      onHover: () => setShowDialog(true),
      onHoverEnd: () => setShowDialog(false),
      onClick: () => {router.push("/about")},
      zIndex: 20,
    },
    {
      hitboxX: 1000,
      hitboxY: 1250,
      hitboxW: 450,
      hitboxH: 1000,
      src: "/assets/homepage/work.png",
      onClick: () => {router.push("/work")},
    },
    {
      hitboxX: 1370,
      hitboxY: 850,
      hitboxW: 282,
      hitboxH: 1200,
      src: "/assets/homepage/illustration.png",
      onClick: () => {router.push("/illustration")},
    },
    {
      // this is wrong, but it doesnt matter so I'll just put it here
      hitboxX: 1920,
      hitboxY: 780,
      hitboxW: 554,
      hitboxH: 353,
      src: "/assets/homepage/dialog.png",
      zIndex: 30,
      onClick: () => setShowDialog(false),
    },
    {
      hitboxX: 2170,
      hitboxY: 1600,
      hitboxW: 500,
      hitboxH: 500,
      src: "/assets/homepage/handmade.png",
      onClick: () => {router.push("/handmade")},
      zIndex:100
    },
    {
      hitboxX: 1800,
      hitboxY: 1800,
      hitboxW: 250,
      hitboxH: 300,
      src: "/assets/homepage/sketch.png",
      onClick: () => {router.push("/sketch")},
    },
    {
      hitboxX: 100,
      hitboxY: 1700,
      hitboxW: 350,
      hitboxH: 400,
      src: "/assets/homepage/wechat.png",
      onHover: () => setShowWeChatDetails(true),
      onHoverEnd: () => setShowWeChatDetails(false),
      onClick: () => setShowWeChatQR(true),
    },
    {
      hitboxX: 520,
      hitboxY: 1760,
      hitboxW: 250,
      hitboxH: 300,
      src: "/assets/homepage/ins.png",
      onHover: () => setShowInsDetails(true),
      onHoverEnd: () => setShowInsDetails(false),
      onClick: () => window.open("https://instagram.com/tutushiyun", "_blank"),
    },
    {
      hitboxX: 780,
      hitboxY: 1850,
      hitboxW: 150,
      hitboxH: 150,
      onHover: () => setShowEmailDetails(true),
      onHoverEnd: () => setShowEmailDetails(false),
      src: "/assets/homepage/email.png",
      onClick: () => window.open(
        `https://outlook.office.com/mail/deeplink/compose?to=Hsy17710880230@163.com`,
        "_blank"
      )
    },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Sprites Navigator */}
      {SPRITES.map((it, i) => {
        if (it.src === "/assets/homepage/dialog.png" && !showDialog) return null;
        return <FloatingSprite key={i} {...it} debug={false} />;
      })}

      {/* Background Fixed */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/homepage/bg.png')",
          // backgroundPosition: "center 5%",
        }}
      />

      {showWeChatQR && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowWeChatQR(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="/assets/homepage/wechat-qr.png"
              alt="WeChat QR Code"
              className="w-48 h-48"
            />
            <p className="text-sm text-gray-600">Scan to add on WeChat</p>
            <p className="text-sm text-gray-600">WeChat id: qcm17710880230</p>
          </div>
        </div>
      )}
      <ContactTooltip imgX={150} imgY={1650} visible={showWeChatDetails}>
        <div className="bg-black/80 text-white text-sm px-3 py-1.5 rounded-lg">
          WeChat: qcm17710880230 <br/>(click for QR code)
        </div>
      </ContactTooltip>

      <ContactTooltip imgX={500} imgY={1650} visible={showInsDetails}>
        <div className="bg-black/80 text-white text-sm px-3 py-1.5 rounded-lg">
          Instagram: @tutushiyun <br/> (Click to jump to Ins)
        </div>
      </ContactTooltip>

      <ContactTooltip imgX={650} imgY={1700} visible={showEmailDetails}>
        <div className="bg-black/80 text-white text-sm px-3 py-1.5 rounded-lg">
          Email: Hsy17710880230@163.com <br/>(Click to jump to mail)
        </div>
      </ContactTooltip>



    </div>
  );
};

export default Home;
