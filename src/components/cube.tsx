import { useGLTF } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import React, { useRef } from "react";
import { GLTF } from "three-stdlib";
import { Material, Mesh } from "three";

type DreiGLTF = GLTF & {
	nodes: Record<string, Mesh>;
	materials: Record<string, Material>;
};

type Faces = "front" | "back" | "up" | "down" | "right" | "left" | "netral" | null;
type Props = GroupProps & {
	faces: Faces[];
};

export default function Cube({ faces, ...props }: Props): JSX.Element {
	const group = useRef();
	const { nodes, materials } = useGLTF("/cube.glb") as DreiGLTF;

	return (
		<group ref={group} {...props} dispose={null}>
			<mesh geometry={nodes.Cube_1.geometry} material={materials.base} />
			<mesh geometry={nodes.Cube_2.geometry} material={faces.includes("right") ? materials.right : materials.base} />
			<mesh geometry={nodes.Cube_3.geometry} material={faces.includes("back") ? materials.back : materials.base} />
			<mesh geometry={nodes.Cube_4.geometry} material={faces.includes("front") ? materials.front : materials.base} />
			<mesh geometry={nodes.Cube_5.geometry} material={faces.includes("up") ? materials.up : materials.base} />
			<mesh geometry={nodes.Cube_6.geometry} material={faces.includes("left") ? materials.left : materials.base} />
			<mesh geometry={nodes.Cube_7.geometry} material={faces.includes("down") ? materials.down : materials.base} />
		</group>
	);
}

useGLTF.preload("/cube.glb");
