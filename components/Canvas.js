"use client";
import { useState, useRef } from "react";
import { Stage, Layer, Image, Circle } from "react-konva";
import { createAdvancedClip } from "../utils/createAdvancedClip"; // or wherever you placed it

export default function CanvasEditor() {
  const [img, setImg] = useState(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const stageRef = useRef();

  const handleImageUpload = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new window.Image();
      image.src = reader.result;
      image.onload = () => setImg(image);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const exportImage = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 3 });
    const link = document.createElement("a");
    link.download = "cover-design.png";
    link.href = uri;
    link.click();
  };

  // Inline styling for demonstration (no Tailwind)
  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      textAlign: "center",
      backgroundColor: "#f7f7f7",
      minHeight: "100vh",
    },
    header: {
      fontSize: "24px",
      marginBottom: "20px",
    },
    fileInput: {
      marginBottom: "15px",
    },
    controls: {
      marginBottom: "15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    },
    button: {
      padding: "8px 12px",
      backgroundColor: "#4a90e2",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    exportButton: {
      padding: "8px 15px",
      backgroundColor: "#5cb85c",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    canvasContainer: {
      display: "inline-block",
      border: "1px solid #ddd",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      backgroundColor: "#ffffff",
      overflow: "hidden",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🎨 Mobile Cover Designer</h1>

      <input
        type="file"
        onChange={handleImageUpload}
        style={styles.fileInput}
      />

      <div style={styles.controls}>
        <label>Zoom:</label>
        <input
          type="range"
          min={0.5}
          max={3}
          step={0.01}
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
        />
        <button
          style={styles.button}
          onClick={() => setRotation(rotation - 15)}
        >
          Rotate Left
        </button>
        <button
          style={styles.button}
          onClick={() => setRotation(rotation + 15)}
        >
          Rotate Right
        </button>

        <button style={styles.exportButton} onClick={exportImage}>
          📥 Export Design
        </button>
      </div>

      {/* Stage must match your custom clip shape sizes */}
      <div style={styles.canvasContainer}>
        <Stage width={300} height={600} ref={stageRef}>
          <Layer>
            {/* IMAGE WITH CLIPPING */}
            {img && (
              <Image
                alt={img}
                image={img}
                draggable
                x={position.x}
                y={position.y}
                scaleX={scale}
                scaleY={scale}
                rotation={rotation}
                onDragEnd={(e) =>
                  setPosition({ x: e.target.x(), y: e.target.y() })
                }
                // clipFunc={(ctx) => {
                //   ctx.beginPath();

                //   // 1. Define the rectangular boundary
                //   ctx.rect(50, 50, 200, 500);

                //   // 2. Subtract the circle cutout
                //   ctx.moveTo(150, 100); // Move to center of circle
                //   ctx.arc(150, 100, 40, 0, 2 * Math.PI, true); // Create circle cutout

                //   ctx.closePath();
                //   ctx.clip(); // Apply clipping
                // }}
              />
            )}
          </Layer>

          <Layer>
            {/* ADD CIRCLE ABOVE IMAGE TO MAKE IT VISIBLE */}
            <Circle
              x={60}
              y={60}
              radius={40}
              // stroke={"red"} // Make it visible
              fill={"lightgray"}
              strokeWidth={2}
            />
            <Circle
              x={60}
              y={160}
              radius={40}
              // stroke={"red"} // Make it visible
              fill={"lightgray"}
              strokeWidth={2}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
