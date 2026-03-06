#![allow(unused)]

mod modules {
    pub mod vector;
    pub mod vector2d;
    pub mod vector3d;
}

use modules::vector::{self, Vector};
use modules::vector2d::Vector2D;
use modules::vector3d::Vector3D;

// i × j should give (0, 0, 1)
// j × i should give (0, 0, -1)
// (1,2,3) × (4,5,6) should give (-3, 6, -3)
// v × v should give (0, 0, 0)

fn main() {
    println!("===Cross Product Test===");
    
    // Test 1: Standard basis vectors (i × j = k)
    let i = Vector3D::from([1., 0., 0.]);
    let j = Vector3D::from([0., 1., 0.]);
    let k = i.cross_product(&j);
    print!("i × j = ");
    k.print();
    
    // Test 2: j × i = -k
    let result = j.cross_product(&i);
    print!("j × i = ");
    result.print();
    
    // Test 3: Arbitrary vectors
    let u = Vector3D::from([1., 2., 3.]);
    let v = Vector3D::from([4., 5., 6.]);
    let cross = u.cross_product(&v);
    print!("(1,2,3) × (4,5,6) = ");
    cross.print();
    
    // Test 4: Cross product with itself should be zero
    let w = Vector3D::from([1., 2., 3.]);
    let zero = w.cross_product(&w);
    print!("v × v = ");
    zero.print();
}