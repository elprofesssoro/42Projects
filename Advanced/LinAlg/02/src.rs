#![allow(unused)]

mod modules {
    pub mod vector;
    pub mod vector2d;
    pub mod vector3d;
}

use modules::vector::{self, Vector};
use modules::vector2d::Vector2D;
use modules::vector3d::Vector3D;

fn main() {

	let p1 = Vector3D::from([0.0, 0.0, 0.0]);
	let p2 = Vector3D::from([10.0, 10.0, 10.0]);

	let on_segment = vector::lerp(p1, p2, 0.5);     // (5.0, 5.0, 5.0)
	on_segment.print();
	let beyond = vector::lerp(p1, p2, 2.0);         // (20.0, 20.0, 20.0)
	beyond.print();
	let before = vector::lerp(p1, p2, -1.0);		// (-10.0, -10.0, -10.0)
	before.print();
}