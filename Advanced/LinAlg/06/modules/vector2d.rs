use std::fmt::Display;
use super::vector::Vector;
use std::ops::{Add, Sub, Mul, AddAssign, SubAssign, MulAssign};


#[derive(Debug, Copy, Clone)]
pub struct Vector2D {
    x: f32,
    y: f32
}

impl Vector2D {
    pub fn from(arr: [f32; 2]) -> Self {
        let [x, y] = arr;
        Vector2D { x, y } 
    }
}

impl Vector for Vector2D {
	
	fn zero() -> Self {
		Self {x: 0.0, y: 0.0}
	}
	fn print(&self) {
        println!("({}, {})", self.x, self.y);
    }
	
	fn dot(&self, other: &Self) -> f32 {
        self.x * other.x + self.y * other.y
    }

	fn normL1(&self) -> f32 {
		self.x.abs() + self.y.abs()
	}

	fn normL2(&self) -> f32 {
		(self.x.powi(2) + self.y.powi(2)).sqrt()
	}

	fn normInf(&self) -> f32 {
		self.x.abs().max(self.y.abs())
	}
	// fn add(&mut self, other: &Self) {
	// 	self.x += other.x;
	// 	self.y += other.y;
	// }

	// fn sub(&mut self, other: &Self) {
	// 	self.x -= other.x;
	// 	self.y -= other.y;
	// }

	// fn scl(&mut self, scalar: f32) {
	// 	self.x *= scalar;
	// 	self.y *= scalar;
	// }
}

impl Add for Vector2D {
	type Output = Self;
	fn add(self, other: Self) -> Self {
		Vector2D {
			x: self.x + other.x,
			y: self.y + other.y,
		}
	}
}

impl AddAssign for Vector2D {
    fn add_assign(&mut self, other: Self) {
        self.x += other.x;
        self.y += other.y;
    }
}

impl Sub for Vector2D {
    type Output = Self;
    fn sub(self, other: Self) -> Self {
        Vector2D {
            x: self.x - other.x,
            y: self.y - other.y,
        }
    }
}

impl SubAssign for Vector2D {
    fn sub_assign(&mut self, other: Self) {
        self.x -= other.x;
        self.y -= other.y;
    }
}

impl Mul<f32> for Vector2D {
    type Output = Self;
    fn mul(self, scalar: f32) -> Self {
        Vector2D {
            x: self.x * scalar,
            y: self.y * scalar,
        }
    }
}

impl MulAssign<f32> for Vector2D {
    fn mul_assign(&mut self, scalar: f32) {
        self.x *= scalar;
        self.y *= scalar;
    }
}

impl Mul<Self> for Vector2D {
	type Output = Self; 
	fn mul(self, other: Self) -> Self {
		Vector2D {
			x: self.x * other.x,
			y: self.y * other.y,
		}
	}
}


// impl Vector2D {
//     pub fn print(&self) {
//         println!("({}, {})", self.x, self.y);
//     }
// } 

// impl Vector2D {
//     pub fn get(&self) -> Vector2D {
//         self
//     }
// }

// impl Vector for Vector2D {
// 	fn add(&mut self, other: &Vector2D) {
// 		self.x += v.x;
// 		self.y += v.y;
// 	}

// 	fn sub(&mut self, other: &Vector2D) {
// 		self.x -= v.x;
// 		self.y -= v.y;
// 	}

// 	fn scl(&mut self, scalar: f32) {
// 		self.x *= a;
// 		self.y *= a;
// 	}
// }

// pub fn linear_combination<K>(u: &[Vector2D<K>], coefs: &[K]) -> Vector2D<K> 
// where K: Copy + Default + AddAssign + Mul<Output = K>
// {
//     let mut res: Vector2D<K> = Vector2D { x: K::default(), y: K::default() };
//     for i in 0..u.len() {
//         res.x += u[i].x * coefs[i];
//         res.y += u[i].y * coefs[i];
//     }
//     res
// }