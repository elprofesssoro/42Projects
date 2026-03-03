use std::fmt::Display;
use super::vector::Vector;

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

	fn add(&mut self, other: &Self) {
		self.x += other.x;
		self.y += other.y;
	}

	fn sub(&mut self, other: &Self) {
		self.x -= other.x;
		self.y -= other.y;
	}

	fn scl(&mut self, scalar: f32) {
		self.x *= scalar;
		self.y *= scalar;
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