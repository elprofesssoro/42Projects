#![allow(unused)]

// mod modules {
//     pub mod vector3d;
//     pub mod vector2d;
// }

// use modules::vector2d::{Vector2D, linear_combination as lc2d};
// use modules::vector3d::{Vector3D, linear_combination as lc3d};

// fn main() {
//     let e1 = Vector2D::from([1., 0.]);
//     let e2 = Vector2D::from([0., 1.]);
//     let e3 = Vector2D::from([0., 0.]);
//     let v1 = Vector2D::from([1., 2.]);
//     let v2 = Vector2D::from([0., 10.]);
    
//     println!("{:?}", lc2d(&[e1, e2, e3], &[10., -2., 0.5]));
//     println!("{:?}", lc2d(&[v1, v2], &[10., -2.]));

//     let e1 = Vector3D::from([1., 0., 0.]);
//     let e2 = Vector3D::from([0., 1., 0.]);
//     let e3 = Vector3D::from([0., 0., 1.]);
//     let v1 = Vector3D::from([1., 2., 3.]);
//     let v2 = Vector3D::from([0., 10., -100.]);
//     println!("{:?}", lc3d(&[e1, e2, e3], &[10., -2., 0.5]));
//     println!("{:?}", lc3d(&[v1, v2], &[10., -2.]));
// }

mod modules {
    pub mod vector;
    pub mod vector2d;
    pub mod vector3d;
}

use modules::vector::linear_combination;
use modules::vector2d::Vector2D;
use modules::vector3d::Vector3D;

fn main() {
    let v1 = Vector2D::from([1., 2.]);
    let v2 = Vector2D::from([3., 4.]);
    let result = linear_combination(&[v1, v2], &[10.0, -2.0]);
    println!("{:?}", result); // Works!
    
    let v1 = Vector3D::from([1., 2., 3.]);
    let v2 = Vector3D::from([4., 5., 6.]);
    let result = linear_combination(&[v1, v2], &[10.0, -2.0]);
    println!("{:?}", result); // Same function, works!
}