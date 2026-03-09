#![allow(unused)]

mod modules {
    pub mod vector;
    pub mod vector2d;
    pub mod vector3d;
    pub mod matrix;
}

use modules::vector::{self, Vector};
use modules::vector2d::Vector2D;
use modules::vector3d::Vector3D;
use modules::matrix::Matrix;

fn main() {
    println!("=== mul_vec2D test ===");
    // A (2x2) * v (2)
    let a = Matrix::<2, 2>::from([
        [1.0, 2.0],
        [3.0, 4.0],
    ]);
    let v = Vector2D::from([5.0, 6.0]);

    let y = a.mul_vec2D(&v);
    println!("A * v = {:?}", y); // expected: [17.0, 39.0]

    println!("\n=== mul_mat test ===");
    // A (2x3) * B (3x2) = C (2x2)
    let a23 = Matrix::<2, 3>::from([
        [1.0, 2.0, 3.0],
        [4.0, 5.0, 6.0],
    ]);
    let b32 = Matrix::<3, 2>::from([
        [7.0, 8.0],
        [9.0, 10.0],
        [11.0, 12.0],
    ]);

    let c = a23.mul_mat(&b32);
    c.print();
    // expected:
    // 58 64
    // 139 154
}