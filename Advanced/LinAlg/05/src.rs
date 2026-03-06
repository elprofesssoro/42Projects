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
    println!("===Cos Test===");
    // Test 1: Perpendicular vectors (cos should be 0)
    let u: Vector2D = Vector2D::from([1., 0.]);
    let v: Vector2D = Vector2D::from([0., 1.]);
    println!("Perpendicular:	{}", vector::angle_cos(&u, &v));
    
    // Test 2: Parallel vectors (cos should be 1)
    let a: Vector2D = Vector2D::from([1., 0.]);
    let b: Vector2D = Vector2D::from([2., 0.]);
    println!("Parallel:	{}", vector::angle_cos(&a, &b));
    
    // Test 3: Opposite vectors (cos should be -1)
    let c: Vector2D = Vector2D::from([1., 0.]);
    let d: Vector2D = Vector2D::from([-1., 0.]);
    println!("Opposite:	{}", vector::angle_cos(&c, &d));
}