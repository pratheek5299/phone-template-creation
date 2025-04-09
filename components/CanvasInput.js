"use client";
import { useState, useRef } from "react";
import { Stage, Layer, Image, Circle, Rect } from "react-konva";
import { GrRotateLeft, GrRotateRight } from "react-icons/gr";

export default function CanvasEditor() {
	const [img, setImg] = useState(null);
	const [stageSize, setStageSize] = useState({ width: 300, height: 600 });
	const [shapes, setShapes] = useState([]);
	const [selectedShape, setSelectedShape] = useState(null);
	const [scale, setScale] = useState(1);
	const [imageProps, setImageProps] = useState({
		x: 0,
		y: 0,
		scale: 1,
		rotation: 0,
	});

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

	const addShape = (type) => {
		const newShape = {
			id: shapes.length + 1,
			type,
			x: 50,
			y: 50,
			width: type === "rectangle" ? 100 : null,
			height: type === "rectangle" ? 100 : null,
			radius: type === "circle" ? 50 : null,
			cornerRadius: type === "rectangle" ? 20 : null,
		};
		setShapes([...shapes, newShape]);
		setSelectedShape(newShape.id);
	};

	const updateShape = (id, key, value) => {
		setShapes(
			shapes.map((shape) =>
				shape.id === id ? { ...shape, [key]: parseFloat(value) } : shape
			)
		);
	};

	const deleteShape = (id) => {
		setShapes(shapes.filter((shape) => shape.id !== id));
		setSelectedShape(null);
	};

	const handleWheelZoom = (e) => {
		e.evt.preventDefault();

		const scaleBy = 1.05;
		const stage = stageRef.current;
		const pointer = stage.getPointerPosition(); // Get cursor position
		const oldScale = imageProps.scale;
		const newScale =
			e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

		// Ensure scale remains within reasonable limits
		if (newScale < 0.2 || newScale > 5) return;

		setImageProps((prev) => ({
			...prev,
			scale: newScale,
		}));

		stage.batchDraw();
	};

	const handleScaleChange = (e) => {
		const newScale = parseFloat(e.target.value);
		if (isNaN(newScale) || newScale < 0.2 || newScale > 5) return;

		setImageProps((prev) => ({
			...prev,
			scale: newScale,
		}));
	};

	const styles = {
		container: {
			fontFamily: "Arial, sans-serif",
			padding: "20px",
			textAlign: "center",
			backgroundColor: "#f4f4f4",
			minHeight: "100vh",
		},
		header: { fontSize: "28px", marginBottom: "20px", fontWeight: "bold" },
		inputContainer: {
			marginBottom: "15px",
			display: "flex",
			gap: "10px",
			justifyContent: "center",
			alignItems: "center",
		},
		button: {
			padding: "10px 15px",
			backgroundColor: "#007bff",
			color: "#fff",
			border: "none",
			height: "fit-content",
			borderRadius: "6px",
			cursor: "pointer",
			transition: "0.3s",
			display: "flex",
			alignItems: "center",
			gap: "5px",
		},
		buttonHover: {
			backgroundColor: "#0056b3",
		},
		deleteButton: {
			padding: "5px 10px",
			backgroundColor: "red",
			color: "#fff",
			border: "none",
			borderRadius: "6px",
			cursor: "pointer",
			transition: "0.3s",
		},
		exportButton: {
			padding: "10px 15px",
			backgroundColor: "#28a745",
			color: "#fff",
			border: "none",
			borderRadius: "6px",
			cursor: "pointer",
			//   marginTop: "10px",
		},
		canvasContainer: {
			display: "inline-block",
			border: "10px solid rgba(0,0,0,0.5",
			borderRadius: "10px",
			boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
			backgroundColor: "#ffffff",
			overflow: "hidden",
		},
		shapeBlock: {
			border: "1px solid #ccc",
			padding: "10px",
			borderRadius: "6px",
			marginBottom: "10px",
			backgroundColor: "#fff",
			width: "fit-content",
			margin: "5px auto",
		},
	};

	return (
		<div style={styles.container}>
			<h1 style={styles.header}>🎨 Mobile Cover Designer</h1>

			<div style={styles.inputContainer}>
				<label>Stage Width:</label>
				<input
					type="number"
					value={stageSize.width || 0}
					style={{
						border: "1px solid gray",
						borderRadius: "5px",
						padding: "5px",
					}}
					onChange={(e) =>
						setStageSize({
							...stageSize,
							width: parseInt(e.target.value),
						})
					}
				/>

				<label>Stage Height:</label>
				<input
					type="number"
					value={stageSize.height || 0}
					style={{
						border: "1px solid gray",
						borderRadius: "5px",
						padding: "5px",
					}}
					onChange={(e) =>
						setStageSize({
							...stageSize,
							height: parseInt(e.target.value),
						})
					}
				/>
			</div>

			<div
				style={{
					display: "flex",
					gap: "10px",
					justifyContent: "center",
					marginBottom: "15px",
				}}
				className=""
			>
				<input type="file" onChange={handleImageUpload} />
				<button
					style={styles.button}
					onClick={() =>
						setImageProps({
							...imageProps,
							rotation: imageProps.rotation - 15,
						})
					}
				>
					<GrRotateLeft /> Rotate Left
				</button>
				<button
					style={styles.button}
					onClick={() =>
						setImageProps({
							...imageProps,
							rotation: imageProps.rotation + 15,
						})
					}
				>
					<GrRotateRight /> Rotate Right
				</button>

				<input
					type="range"
					min={0.5}
					max={3}
					step={0.01}
					value={scale}
					onChange={(e) => setScale(parseFloat(e.target.value))}
				/>
			</div>

			<div
				style={{
					margin: "15px 0",
					display: "flex",
					gap: "10px",
					//   backgroundColor: "red",
					justifyContent: "center",
				}}
			>
				<button
					style={styles.button}
					onClick={() => addShape("circle")}
				>
					Add Circle
				</button>
				<button
					style={styles.button}
					onClick={() => addShape("rectangle")}
				>
					Add Rectangle
				</button>
				<button style={styles.exportButton} onClick={exportImage}>
					📥 Export Design
				</button>
			</div>

			<div
				style={{
					marginBottom: "15px",
					display: "flex",
					gap: "10px",
					//   backgroundColor: "red",
					justifyContent: "center",
				}}
			></div>

			{/* Shapes List */}
			{shapes.length > 0 && (
				<div>
					<h3>🔧 Edit Shapes</h3>
					{shapes.map((shape) => (
						<div key={shape.id} style={styles.shapeBlock}>
							<strong>
								Shape {shape.id} ({shape.type})
							</strong>
							<div
								style={{
									display: "flex",
									gap: "10px",
									flexWrap: "wrap",
									alignItems: "center",
								}}
							>
								<label>Left:</label>
								<input
									type="number"
									value={shape.x || 0}
									style={{
										border: "1px solid gray",
										borderRadius: "5px",
										padding: "5px",
									}}
									onChange={(e) =>
										updateShape(
											shape.id,
											"x",
											e.target.value
										)
									}
								/>
								<label>Top:</label>
								<input
									type="number"
									value={shape.y || 0}
									style={{
										border: "1px solid gray",
										borderRadius: "5px",
										padding: "5px",
									}}
									onChange={(e) =>
										updateShape(
											shape.id,
											"y",
											e.target.value
										)
									}
								/>
								{shape.type === "circle" ? (
									<>
										<label>Radius:</label>
										<input
											type="number"
											value={shape.radius || 0}
											style={{
												border: "1px solid gray",
												borderRadius: "5px",
												padding: "5px",
											}}
											onChange={(e) =>
												updateShape(
													shape.id,
													"radius",
													e.target.value
												)
											}
										/>
									</>
								) : (
									<div className="grid grid-cols-2 gap-4">
										<div className="">
											<label>Width:</label>
											<input
												type="number"
												value={shape.width || 0}
												style={{
													border: "1px solid gray",
													borderRadius: "5px",
													padding: "5px",
												}}
												onChange={(e) =>
													updateShape(
														shape.id,
														"width",
														e.target.value
													)
												}
											/>
										</div>
										<div className="">
											<label>Height:</label>
											<input
												type="number"
												value={shape.height || 0}
												style={{
													border: "1px solid gray",
													borderRadius: "5px",
													padding: "5px",
												}}
												onChange={(e) =>
													updateShape(
														shape.id,
														"height",
														e.target.value
													)
												}
											/>
										</div>
										<div className="">
											<label>Corner Radius:</label>
											<input
												type="number"
												value={shape.cornerRadius || 0}
												style={{
													border: "1px solid gray",
													borderRadius: "5px",
													padding: "5px",
												}}
												onChange={(e) =>
													updateShape(
														shape.id,
														"cornerRadius",
														e.target.value
													)
												}
											/>
										</div>
									</div>
								)}
								<button
									style={styles.deleteButton}
									onClick={() => deleteShape(shape.id)}
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			<div style={styles.canvasContainer}>
				<Stage
					width={stageSize.width}
					height={stageSize.height}
					ref={stageRef}
					// onWheel={handleWheelZoom}
				>
					<Layer>
						{img && (
							<Image
								alt={img}
								image={img}
								{...imageProps}
								draggable
								scaleX={scale}
								scaleY={scale}
								// onWheel={handleWheelZoom}
							/>
						)}
					</Layer>
					<Layer>
						{shapes.map((shape) =>
							shape.type === "circle" ? (
								<Circle
									key={shape.id}
									{...shape}
									fill="black"
								/>
							) : (
								<Rect key={shape.id} {...shape} fill="black" />
							)
						)}
					</Layer>
				</Stage>
			</div>
		</div>
	);
}
