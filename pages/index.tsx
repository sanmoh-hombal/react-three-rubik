import React, { useEffect, useRef, useState, Suspense } from "react";
import { Html, OrbitControls, useProgress } from "@react-three/drei";
import type { TRubikRotation } from "@components/Rubik/entity/cube";
import CubeEntity from "@components/Rubik/entity/cube";
import { NextPage } from "next";
import Rubik, { TRubikRef } from "@components/Rubik";
import { Canvas } from "@react-three/fiber";
import styles from "@styles/rubik.module.css";

const Loader: React.FC = () => {
	const { progress } = useProgress();
	return (
		<Html center>
			<progress value={progress} />
		</Html>
	);
};

const random = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min);

type TFace = { face: string; inversed: boolean };

const faces: TFace[] = Object.keys(CubeEntity.rotation).flatMap((face) => [
	{ face, inversed: false },
	{ face, inversed: true },
]);

const Home: NextPage = () => {
	const rubik = useRef<TRubikRef>(null!);
	const randomStep = useRef<Array<TFace & { index: number }>>([]);

	const [isScrambling, setIsScrambling] = useState(false);
	const [currentStep, setCurrentStep] = useState<(TFace & { index: number }) | undefined>(undefined);

	const scramble = () => {
		if (isScrambling && rubik.current) {
			setCurrentStep(undefined);
			randomStep.current = [];
			setIsScrambling(false);
			return;
		} else {
			setIsScrambling(true);
			const steps = [...new Array(random(15, 30))].map((_, index) => ({ ...faces[random(0, faces.length)], index }));
			randomStep.current = steps;
			setCurrentStep(steps[0]);
		}
	};

	useEffect(() => {
		if (currentStep) {
			rubik.current.rotate(currentStep.face as keyof TRubikRotation, currentStep.inversed).then(() => {
				const nextStep = randomStep.current.find((step) => step.index === currentStep.index + 1);
				if (isScrambling) setCurrentStep(nextStep);
				if (!nextStep) setIsScrambling(false);
			});
		}
	}, [rubik.current, randomStep.current, currentStep, isScrambling, setIsScrambling, setCurrentStep]);

	const progress = currentStep?.index ? Math.ceil(((currentStep?.index + 1) / randomStep.current.length) * 100) : 0;

	return (
		<>
			<div
				id="top-nav"
				role="navigation"
				className={`${styles["button-action"]} container justify-between items-center px-4 top-4 h-14`}>
				<div className="flex items-center">
					<button aria-label="Scrumble" onClick={scramble} className="btn md:btn-sm btn-secondary w-28">
						{isScrambling ? "Stop" : "Scramble"}
					</button>
					{isScrambling && (
						<svg className="ml-4 stroke-secondary" height="30" width="30">
							<circle
								style={{ transition: "stroke-dashoffset 300ms linear" }}
								strokeDasharray={100}
								strokeDashoffset={Math.ceil(100 - (progress / 100) * 82)}
								cx="15"
								cy="15"
								r="13"
								strokeWidth="2"
								fillOpacity="0"
							/>
						</svg>
					)}
				</div>
				<div data-theme="dark" className="form-control">
					<label id="label-toggle" className="flex items-center gap-4 font-mono">
						Labels
						<input
							aria-labelledby="label-toggle"
							type="checkbox"
							onChange={(e) => rubik.current?.showLabel?.(e.target.checked)}
							className="toggle toggle-secondary toggle-lg md:toggle-md"
						/>
					</label>
				</div>
			</div>
			<main id="main" role="main" className="h-screen bg-gradient-radial from-gray-600 to-gray-900">
				<Canvas camera={{ position: [-2, 2, 3] }} style={{ height: "100%" }}>
					<OrbitControls enablePan={false} zoomSpeed={0.3} maxDistance={16} minDistance={12} />
					<ambientLight />
					<pointLight color={0xfff} position={[10, 10, 10]} />
					<Suspense fallback={<Loader />}>
						<Rubik position={[0, 1, 0]} ref={rubik} />
					</Suspense>
				</Canvas>
			</main>
			<nav id="bottom-nav" role="navigation" className={styles["button-action--bottom"]}>
				<div>
					<button
						aria-label="Rotate Up"
						disabled={isScrambling}
						onClick={() => rubik.current?.rotate?.("U")}
						className="btn md:btn-sm btn-secondary">
						U
					</button>
					<button
						aria-label="Rotate Up Inversed"
						disabled={isScrambling}
						onClick={() => rubik.current?.rotate?.("U", true)}
						className="btn md:btn-sm btn-secondary">
						U&apos;
					</button>
				</div>
				<div>
					<button
						aria-label="Rotate Front"
						disabled={isScrambling}
						onClick={() => rubik.current?.rotate?.("F")}
						className="btn md:btn-sm btn-secondary">
						F
					</button>
					<button
						aria-label="Rotate Front Inversed"
						disabled={isScrambling}
						onClick={() => rubik.current?.rotate?.("F", true)}
						className="btn md:btn-sm btn-secondary">
						F&apos;
					</button>
				</div>
				<div>
					<button
						aria-label="Rotate Left"
						disabled={isScrambling}
						onClick={() => rubik.current?.rotate?.("L")}
						className="btn md:btn-sm btn-secondary">
						L
					</button>
					<button
						aria-label="Rotate Left Inversed"
						disabled={isScrambling}
						onClick={() => rubik.current?.rotate?.("L", true)}
						className="btn md:btn-sm btn-secondary">
						L&apos;
					</button>
				</div>
				<div>
					<button
						aria-label="Rotate Down"
						disabled={isScrambling}
						onClick={() => rubik.current?.rotate?.("D")}
						className="btn md:btn-sm btn-secondary">
						D
					</button>
					<button
						aria-label="Rotate Down Inversed"
						disabled={isScrambling}
						onClick={() => rubik.current?.rotate?.("D", true)}
						className="btn md:btn-sm btn-secondary">
						D&apos;
					</button>
				</div>
				<div>
					<button
						aria-label="Rotate Back"
						disabled={isScrambling}
						onClick={() => rubik.current?.rotate?.("B")}
						className="btn md:btn-sm btn-secondary">
						B
					</button>
					<button
						aria-label="Rotate Back Inversed"
						disabled={isScrambling}
						onClick={() => rubik.current?.rotate?.("B", true)}
						className="btn md:btn-sm btn-secondary">
						B&apos;
					</button>
				</div>
				<div>
					<button
						aria-label="Rotate Right"
						disabled={isScrambling}
						onClick={() => rubik.current?.rotate?.("R")}
						className="btn md:btn-sm btn-secondary">
						R
					</button>
					<button
						aria-label="Rotate Right Inversed"
						disabled={isScrambling}
						onClick={() => rubik.current?.rotate?.("R", true)}
						className="btn md:btn-sm btn-secondary">
						R&apos;
					</button>
				</div>
				<div>
					<button
						aria-label="Rotate Middle"
						disabled={isScrambling}
						onClick={() => rubik.current?.rotate?.("M")}
						className="btn md:btn-sm btn-secondary">
						M
					</button>
					<button
						aria-label="Rotate Middle Inversed"
						disabled={isScrambling}
						onClick={() => rubik.current?.rotate?.("M", true)}
						className="btn md:btn-sm btn-secondary">
						M&apos;
					</button>
				</div>
				<div>
					<button
						aria-label="Rotate Standing"
						disabled={isScrambling}
						onClick={() => rubik.current?.rotate?.("S")}
						className="btn md:btn-sm btn-secondary">
						S
					</button>
					<button
						aria-label="Rotate Standing Inversed"
						disabled={isScrambling}
						onClick={() => rubik.current?.rotate?.("S", true)}
						className="btn md:btn-sm btn-secondary">
						S&apos;
					</button>
				</div>
				<div>
					<button
						aria-label="Rotate Equator"
						disabled={isScrambling}
						onClick={() => rubik.current?.rotate?.("E")}
						className="btn md:btn-sm btn-secondary">
						E
					</button>
					<button
						aria-label="Rotate Equator Inversed"
						disabled={isScrambling}
						onClick={() => rubik.current?.rotate?.("E", true)}
						className="btn md:btn-sm btn-secondary">
						E&apos;
					</button>
				</div>
			</nav>
		</>
	);
};

export default Home;
