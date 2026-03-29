
/* ─── Scene Container ─── */

export function SceneContainer({
  children,
  bgColor = "#000000",
}: {
  children: React.ReactNode;
  bgColor?: string;
}) {
  return (
    <div className="fixed inset-0" style={{ backgroundColor: bgColor }}>
      {children}
    </div>
  );
}
