use std::fmt::Display;
use super::vector::Vector;
use std::ops::{Add, Sub, Mul, AddAssign, SubAssign, MulAssign, Index, IndexMut};


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

impl Index<usize> for Vector2D {
    type Output = f32;

    fn index(&self, i: usize) -> &Self::Output {
        match i {
            0 => &self.x,
            1 => &self.y,
            _ => panic!("Vector2D index out of bounds: {}", i),	
        }
    }
}

impl IndexMut<usize> for Vector2D {
    fn index_mut(&mut self, i: usize) -> &mut Self::Output {
        match i {
            0 => &mut self.x,
            1 => &mut self.y,
            _ => panic!("Vector2D index out of bounds: {}", i),
        }
    }
}