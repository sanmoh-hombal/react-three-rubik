import { Object3D, Quaternion } from "three";
import { TRubikRotation } from "@components/Rubik/entity/cube";
import state from "@components/Rubik/state";

export function rotateAroundWorldAxis(object: THREE.Object3D, axisVector: THREE.Vector3, radians: number): void {
	const quaternion: Quaternion = new Quaternion();
	quaternion.setFromAxisAngle(axisVector, radians);

	object.quaternion.multiplyQuaternions(quaternion, object.quaternion);
	object.position.sub(axisVector);
	object.applyQuaternion(quaternion);
	object.position.add(axisVector);
}

export function getBoxes(objects: Array<Object3D>, face: keyof TRubikRotation): Array<Object3D<THREE.Event>> {
	const rotationPieces: Array<string> = Object.keys(state)
		.filter((position: string) => {
			if (face === "M") {
				return !position.includes("L") && !position.includes("R");
			} else if (face === "S") {
				return !position.includes("F") && !position.includes("B");
			} else if (face === "E") {
				return !position.includes("U") && !position.includes("D");
			} else {
				return position.includes(face);
			}
		})
		.map((key: string) => state[key as keyof typeof state]);

	return objects.filter((cube: Object3D) => rotationPieces.includes(cube.name));
}
