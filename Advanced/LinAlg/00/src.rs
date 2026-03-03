#![allow(unused)]

mod modules {
    pub mod matrix;
    pub mod vector;
}

use modules::vector::Vector;
use modules::matrix::Matrix;

fn main() {
	let mut u = Vector::from([2., 3.]);
	let v = Vector::from([5., 7.]);
	u.add(&v);
	u.print();
	// [7.0]
	// [10.0]
	let mut u = Vector::from([2., 3.]);
	let v = Vector::from([5., 7.]);
	u.sub(&v);
	u.print();
	// [-3.0]
	// [-4.0]
	let mut u = Vector::from([2., 3.]);
	u.scl(2.);
	u.print();
	// [4.0]
	// [6.0]

	println!("---------------------");
	let mut u = Matrix::from([
	[1., 2.],
	[3., 4.]
	]);
	let v = Matrix::from([
	[7., 4.],
	[-2., 2.]
	]);
	u.add(&v);
	u.print();
	// [8.0, 6.0]
	// [1.0, 6.0]
	let mut u = Matrix::from([
	[1., 2.],
	[3., 4.]
	]);
	let v = Matrix::from([
	[7., 4.],
	[-2., 2.]
	]);
	u.sub(&v);
	u.print();
	// [-6.0, -2.0]
	// [5.0, 2.0]
	let mut u = Matrix::from([
	[1., 2.],
	[3., 4.]
	]);
	u.scl(2.);
	u.print();
	// [2.0, 4.0]
	// [6.0, 8.0]
}

fn add(x: i32, y: i32) -> i32 {
	x + y
}
