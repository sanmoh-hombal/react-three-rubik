import { GroupProps, useFrame } from "@react-three/fiber";
import CubeEntity, { TRubikRotation } from "@components/Rubik/entity/cube";
import { forwardRef, Ref, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import Move from "@components/Rubik/entity/move";
import { getBoxes, rotateAroundWorldAxis } from "@components/Rubik/helper";
import { Euler, MathUtils, Object3D } from "three";
import rotatePieces from "@components/Rubik/state/rotate";
import { Text } from "@react-three/drei";
import Cube from "@components/Cube";

export type TRubikProps = {
	size?: number;
} & GroupProps;

export type TRubikRef = {
	rotate: (rotation: keyof TRubikRotation, inversed?: boolean, stepAngle?: number) => Promise<void>;
	showLabel: (value: boolean) => void;
};

const defaultStepAngle = 6;

const Rubik = forwardRef<TRubikRef, TRubikProps>(
	({ size = 3, ...props }: TRubikProps, ref: Ref<unknown> | undefined) => {
		const rubik = useRef<THREE.Mesh>(null!);
		const moveRef = useRef<Move>();
		const shiftKeyPressed = useRef<boolean>(false);
		const [showLabel, setShowLabel] = useState(false);

		const rotateBoxes = (face: keyof TRubikRotation, targetAngle: number) => {
			const boxes = getBoxes(rubik.current.children, face);
			for (const box of boxes) {
				rotateAroundWorldAxis(box, CubeEntity.rotation[face].axis, MathUtils.degToRad(-targetAngle));
			}
		};

		const rotate = useCallback(
			(face: keyof TRubikRotation, inversed = false, stepAngle = defaultStepAngle): Promise<void> => {
				if (moveRef.current) return Promise.resolve();

				return new Promise<void>((resolve) => {
					moveRef.current = new Move(face, ["B", "L", "D"].includes(face) ? !inversed : inversed, stepAngle);

					moveRef.current.onComplete(() => {
						rotatePieces(face, inversed);
						moveRef.current = undefined;
						resolve();
					});

					moveRef.current.onProgress((move) => {
						const targetSign = Math.sign(move.targetAngle);
						rotateBoxes(face, stepAngle * targetSign);
					});
				});
			},
			[],
		);

		useImperativeHandle(ref, () => ({ rotate, showLabel: (value: boolean) => setShowLabel(value) }));

		useEffect(() => {
			const listenToKeyboard = (e: KeyboardEvent) => {
				const key: string = e.key.toUpperCase();
				if (key === "SHIFT") shiftKeyPressed.current = true;
				if (Object.keys(CubeEntity.rotation).includes(key))
					rotate(key as keyof TRubikRotation, shiftKeyPressed.current);
			};

			window.addEventListener("keydown", listenToKeyboard);
			window.addEventListener("keyup", (e) => {
				if (e.key === "Shift") shiftKeyPressed.current = false;
			});
			return () => {
				window.removeEventListener("keydown", listenToKeyboard);
				window.removeEventListener("keyup", (e: KeyboardEvent) => {
					if (e.key === "Shift") shiftKeyPressed.current = false;
				});
			};
		}, [rotate]);

		useFrame(() => {
			if (moveRef.current) moveRef.current.run();
		});

		const offset: number = -size / 2 + 0.5 - 1;
		const opacity: number = showLabel ? 1 : 0;

		return (
			<group {...props}>
				<Text
					fillOpacity={opacity}
					outlineOpacity={opacity}
					position={[0, 0, 4.5]}
					outlineColor={0x000}
					outlineWidth={0.025}
					fontSize={1.3}>
					Front
				</Text>
				<Text
					fillOpacity={opacity}
					outlineOpacity={opacity}
					position={[0, 0, -4.5]}
					rotation={new Euler(0, Math.PI, 0)}
					outlineColor={0x000}
					outlineWidth={0.025}
					fontSize={1.3}>
					Back
				</Text>
				<Text
					fillOpacity={opacity}
					outlineOpacity={opacity}
					position={[0, 4.5, 0]}
					rotation={new Euler(-Math.PI / 2, 0, 0)}
					outlineColor={0x000}
					outlineWidth={0.025}
					fontSize={1.3}>
					Up
				</Text>
				<Text
					fillOpacity={opacity}
					outlineOpacity={opacity}
					position={[0, -4.5, 0]}
					rotation={new Euler(Math.PI / 2, 0, 0)}
					outlineColor={0x000}
					outlineWidth={0.025}
					fontSize={1.3}>
					Down
				</Text>
				<Text
					fillOpacity={opacity}
					outlineOpacity={opacity}
					position={[4.5, 0, 0]}
					rotation={new Euler(0, Math.PI / 2, 0)}
					outlineColor={0x000}
					outlineWidth={0.025}
					fontSize={1.3}>
					Right
				</Text>
				<Text
					fillOpacity={opacity}
					outlineOpacity={opacity}
					position={[-4.5, 0, 0]}
					rotation={new Euler(0, -Math.PI / 2, 0)}
					outlineColor={0x000}
					outlineWidth={0.025}
					fontSize={1.3}>
					Left
				</Text>
				<group ref={rubik}>
					{[...Array(size)].map((_: number | undefined, x: number) =>
						[...Array(size)].map((_: number | undefined, y: number) =>
							[...Array(size)].map((_: number | undefined, z: number) => (
								<Cube
									name={`${x}-${y}-${z}`}
									key={`${x}-${y}-${z}`}
									position={[x + x * 1 + offset, y + y * 1 + offset, z + z * 1 + offset]}
									faces={[
										x === size - 1 ? "right" : null,
										x === 0 ? "left" : null,
										y === size - 1 ? "up" : null,
										y === 0 ? "down" : null,
										z === size - 1 ? "front" : null,
										z === 0 ? "back" : null,
									]}
								/>
							)),
						),
					)}
				</group>
			</group>
		);
	},
);

Rubik.displayName = "Rubik";
export default Rubik;
