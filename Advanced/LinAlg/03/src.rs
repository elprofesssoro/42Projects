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
    // 3D dot product
    let a = Vector3D::from([1.0, 2.0, 3.0]);
    let b = Vector3D::from([4.0, 5.0, 6.0]);

    let d3 = vector::dot(&a, &b);
    println!("dot([1,2,3], [4,5,6]) = {}", d3); // 32

    // Optional: orthogonal vectors => dot = 0
    let x = Vector3D::from([1.0, 0.0, 0.0]);
    let y = Vector3D::from([0.0, 1.0, 0.0]);

    let ortho = vector::dot(&x, &y);
    println!("dot([1,0,0], [0,1,0]) = {}", ortho); // 0
}
