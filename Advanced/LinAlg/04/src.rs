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
    println!("=== Vector2D Norms ===");
    let v2 = Vector2D::from([3.0, 4.0]);
    println!("Vector: (3.0, 4.0)");
    println!("L1 norm (Manhattan): {}", v2.normL1());      // 7.0
    println!("L2 norm (Euclidean): {}", v2.normL2());      // 5.0
    println!("L∞ norm (Max): {}", v2.normInf());           // 4.0
    
    println!("\n=== Vector3D Norms ===");
    let v3 = Vector3D::from([1.0, 2.0, 3.0]);
    println!("Vector: (1.0, 2.0, 3.0)");
    println!("L1 norm: {}", v3.normL1());                  // 6.0
    println!("L2 norm: {}", v3.normL2());                  // ~3.74
    println!("L∞ norm: {}", v3.normInf());                 // 3.0

    println!("\n=== Negative Values ===");
    let v_neg = Vector2D::from([-3.0, -4.0]);
    println!("Vector: (-3.0, -4.0)");
    println!("L1 norm: {}", v_neg.normL1());               // 7.0
    println!("L2 norm: {}", v_neg.normL2());               // 5.0
    println!("L∞ norm: {}", v_neg.normInf());              // 4.0

    println!("\n=== Unit Vectors ===");
    let unit = Vector3D::from([1.0, 0.0, 0.0]);
    println!("Vector: (1.0, 0.0, 0.0)");
    println!("All norms: L1={}, L2={}, L∞={}", 
             unit.normL1(), unit.normL2(), unit.normInf()); // All = 1.0
}