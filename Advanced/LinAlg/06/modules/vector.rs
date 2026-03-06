use std::ops::{Add, Sub, Mul, AddAssign, SubAssign, MulAssign};

pub trait Vector: Copy + Clone 
	+ Add <Output = Self>
	+ Sub <Output = Self>
	+ Mul <f32, Output = Self>
	+ Mul <Self, Output = Self>
{
	// fn add(&mut self, other: &Self);
    // fn sub(&mut self, other: &Self);
    // fn scl(&mut self, scalar: f32);
    fn zero() -> Self;
	fn print(&self);
	fn dot(&self, otherx: &Self) -> f32;
	fn normL1(&self) -> f32;
	fn normL2(&self) -> f32;
	fn normInf(&self) -> f32;
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

pub fn dot<V: Vector>(a: &V, b: &V) -> f32  {
	a.dot(b)
}

pub fn angle_cos<V: Vector>(u: &V, v: &V) -> f32 {
	(u.dot(v)) / (u.normL2() * v.normL2())
}