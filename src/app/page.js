"use client";
import dynamic from "next/dynamic";

const Canvas = dynamic(() => import("../../components/Canvas"), { ssr: false });
const CanvasInput = dynamic(() => import("../../components/CanvasInput"), {ssr: false});

export default function Page() {
  return <CanvasInput />;
}
