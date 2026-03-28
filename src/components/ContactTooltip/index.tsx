import { useBackgroundCover } from "@/src/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export function ContactTooltip({
  imgX,
  imgY,
  visible,
  children,
}: {
  imgX: number;
  imgY: number;
  visible: boolean;
  children: React.ReactNode;
}) {
  const { scale, offsetX, offsetY, ready } = useBackgroundCover();

  const screenX = imgX * scale + offsetX;
  const screenY = imgY * scale + offsetY;

  return (
    <AnimatePresence>
      {visible && ready && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.15 }}
          className="fixed pointer-events-none"
          style={{
            left: screenX,
            top: screenY,
            transform: "translate(-50%, -100%)",
            zIndex: 100,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}