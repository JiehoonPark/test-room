"use client";

import { useRef, useState, useEffect } from "react";

interface Texts {
  top: string;
  middle: string;
  bottom: string;
}

export default function CanvasEditor({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [texts, setTexts] = useState<Texts>({
    top: "버텨!!!",
    middle: "견뎌!!!",
    bottom: "이겨내!!!",
  });

  // 편집 위젯 기준 크기
  const BASE_WIDTH = 360;
  const BASE_HEIGHT = 640;

  // 기준 좌표(px)와 폰트 크기
  const COORDS = {
    top: { x: 4, y: 240, fontSize: 40 },
    middle: { x: 230, y: 345, fontSize: 30 },
    bottom: { x: 48, bottomOffset: 153, fontSize: 25 },
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = src;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // 1) 원본 해상도 버퍼 설정
      const W = img.naturalWidth;
      const H = img.naturalHeight;
      canvas.width = W;
      canvas.height = H;
      //  화면에는 BASE_WIDTH×BASE_HEIGHT 로 CSS 크기 지정
      canvas.style.width = `${BASE_WIDTH}px`;
      canvas.style.height = `${BASE_HEIGHT}px`;

      // 2) 스케일 계산
      const scaleX = W / BASE_WIDTH;
      const scaleY = H / BASE_HEIGHT;

      // 3) 배경 그리기
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(img, 0, 0, W, H);

      ctx.fillStyle = "black";
      ctx.textBaseline = "top";

      // 4) 위 텍스트
      ctx.font = `bold ${COORDS.top.fontSize * scaleY}px sans-serif`;
      ctx.fillText(texts.top, COORDS.top.x * scaleX, COORDS.top.y * scaleY);

      // 5) 가운데 텍스트
      ctx.font = `bold ${COORDS.middle.fontSize * scaleY}px sans-serif`;
      ctx.fillText(
        texts.middle,
        COORDS.middle.x * scaleX,
        COORDS.middle.y * scaleY
      );

      // 6) 아래 텍스트 (하단에서 bottomOffset 만큼 위로)
      ctx.font = `bold ${COORDS.bottom.fontSize * scaleY}px sans-serif`;
      const bottomY =
        H -
        COORDS.bottom.bottomOffset * scaleY -
        COORDS.bottom.fontSize * scaleY;
      ctx.fillText(texts.bottom, COORDS.bottom.x * scaleX, bottomY);
    };
  }, [src, texts]);

  // 다운로드 시에는 internal buffer (W×H) 그대로 PNG로 추출
  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "박지훈의실험실_결과물.png";
    link.click();
  };

  const handleChange =
    (key: keyof Texts) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setTexts((t) => ({ ...t, [key]: e.target.value }));

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 1) 화면에 축소되어 보이는 캔버스 */}
      <canvas ref={canvasRef} className="border shadow-lg" />

      {/* 2) 텍스트 입력 폼 (360px 고정) */}
      <div className="flex flex-col gap-4 w-[360px]">
        {(["top", "middle", "bottom"] as (keyof Texts)[]).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700">
              {key === "top"
                ? "위 텍스트"
                : key === "middle"
                ? "가운데 텍스트"
                : "아래 텍스트"}
            </label>
            <input
              type="text"
              value={texts[key]}
              onChange={handleChange(key)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2
                         outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>
        ))}
      </div>

      {/* 3) 다운로드 버튼 */}
      <button
        onClick={downloadImage}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        이미지 다운로드
      </button>
    </div>
  );
}
