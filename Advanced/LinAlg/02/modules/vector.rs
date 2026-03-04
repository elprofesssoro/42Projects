use std::ops::{Add, Sub, Mul, AddAssign, SubAssign, MulAssign};

pub trait Vector: Copy + Clone 
	+ Add <Output = Self>
	+ Sub <Output = Self>
	+ Mul<f32, Output = Self>
{
	// fn add(&mut self, other: &Self);
    // fn sub(&mut self, other: &Self);
    // fn scl(&mut self, scalar: f32);
    fn zero() -> Self;
	fn print(&self);

}

pub fn linear_combination<V: Vector>(u: &[V], coefs: &[f32]) -> V {
	
    let mut res = V::zero();
    for i in 0..u.len() {
        res = res + u[i] * coefs[i]
    }
    res
}

pub fn lerp<V: Vector>(a: V, b: V, t: f32) -> V {
	let mut res = a;
	let mut diff = b;
	a + (b - a) * t
	// diff.sub(&a);
	// diff.scl(t);
	// res.add(&diff);
	// res
}