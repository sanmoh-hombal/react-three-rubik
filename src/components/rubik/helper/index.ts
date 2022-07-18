import { Object3D, Quaternion, Vector3 } from "three";
import { RubikRotation } from "@components/rubik/entity/cube";
import state from "@components/rubik/state";

export function rotateAroundWorldAxis(object: Object3D, axisVector: Vector3, radians: number): void {
	const quaternion: Quaternion = new Quaternion();
	quaternion.setFromAxisAngle(axisVector, radians);

	object.quaternion.multiplyQuaternions(quaternion, object.quaternion);
	object.position.sub(axisVector);
	object.position.applyQuaternion(quaternion);
	object.position.add(axisVector);
}

export function getBoxes(objects: Array<Object3D>, face: keyof RubikRotation): Array<Object3D> {
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
