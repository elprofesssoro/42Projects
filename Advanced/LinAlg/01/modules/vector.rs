use std::ops::AddAssign;

pub trait Vector: Copy + Clone {

    fn zero() -> Self;
	fn print(&self);
    fn add(&mut self, other: &Self);
    fn sub(&mut self, other: &Self);
    fn scl(&mut self, scalar: f32);

}

pub fn linear_combination<V: Vector>(u: &[V], coefs: &[f32]) -> V {
	
    let mut res = V::zero();
    for i in 0..u.len() {
        let mut scaled = u[i];
        scaled.scl(coefs[i]);
        res.add(&scaled);
    }
    res
}