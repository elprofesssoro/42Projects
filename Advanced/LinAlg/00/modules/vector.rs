use std::fmt::Display;
use std::ops::{AddAssign, SubAssign, MulAssign};


pub struct Vector<K> {
    x: K,
    y: K
}

impl<K> Vector<K> {
    pub fn from(arr: [K; 2]) -> Self {
        let [x, y] = arr;
        Vector { x, y } 
    }
}

impl<K: Display> Vector<K> {
    pub fn print(&self) {
        println!("({}, {})", self.x, self.y);
    }
} 

impl<K: Copy> Vector<K> {
    pub fn get(&self) -> (K, K) {
        (self.x, self.y)
    }
}

impl<K: Copy + AddAssign + SubAssign + MulAssign> Vector<K> {
	pub fn add(&mut self, v: &Vector<K>) {
		self.x += v.x;
		self.y += v.y;
	}

	pub fn sub(&mut self, v: &Vector<K>) {
		self.x -= v.x;
		self.y -= v.y;
	}

	pub fn scl(&mut self, a: K) {
		self.x *= a;
		self.y *= a;
	}
}