use std::ops::{Add, Sub, Mul, AddAssign, SubAssign, MulAssign, Index, IndexMut};
use super::vector::Vector;

#[derive(Debug, Clone, Copy)]
pub struct Vector3D {
    x: f32,
    y: f32,
	z: f32
}

impl Vector3D {
	
    pub fn from(arr: [f32; 3]) -> Self {
        let [x, y, z] = arr;
        Vector3D { x, y ,z} 
    }
}

impl Vector for Vector3D {
	
	fn zero() -> Self {
		Self {x: 0.0, y: 0.0, z: 0.0}
	}

	fn print(&self) {
        println!("({}, {}, {})", self.x, self.y, self.z);
    }
	
	fn dot(&self, other: &Self) -> f32 {
		self.x * other.x + self.y * other.y + self.z * other.z
	}

	fn normL1(&self) -> f32 {
		self.x.abs() + self.y.abs() + self.z.abs()
	}

	fn normL2(&self) -> f32 {
		(self.x.powi(2) + self.y.powi(2) + self.z.powi(2)).sqrt()
	}

	fn normInf(&self) -> f32 {
		self.z.abs().max(self.x.abs().max(self.y.abs()))
	}
}

impl Add for Vector3D {
	type Output = Self;
	fn add(self, other: Self) -> Self {
		Vector3D {
			x: self.x + other.x,
			y: self.y + other.y,
			z: self.z + other.z,
		}
	}
}

impl AddAssign for Vector3D {
    fn add_assign(&mut self, other: Self) {
        self.x += other.x;
        self.y += other.y;
        self.z += other.z;
    }
}

impl Sub for Vector3D {
    type Output = Self;
    fn sub(self, other: Self) -> Self {
        Vector3D {
            x: self.x - other.x,
            y: self.y - other.y,
            z: self.z - other.z,
        }
    }
}

impl SubAssign for Vector3D {
    fn sub_assign(&mut self, other: Self) {
        self.x -= other.x;
        self.y -= other.y;
        self.z -= other.z;
    }
}

impl Mul<f32> for Vector3D {
    type Output = Self;
    fn mul(self, scalar: f32) -> Self {
        Vector3D {
            x: self.x * scalar,
            y: self.y * scalar,
            z: self.z * scalar,
        }
    }
}

impl MulAssign<f32> for Vector3D {
    fn mul_assign(&mut self, scalar: f32) {
        self.x *= scalar;
        self.y *= scalar;
        self.z *= scalar;
    }
}

impl Mul<Self> for Vector3D {
	type Output = Self; 
	fn mul(self, other: Self) -> Self {
		Vector3D {
			x: self.x * other.x,
			y: self.y * other.y,
			z: self.z * other.z,
		}
	}
}

impl Vector3D {
	pub fn cross_product(&self, other: &Self) -> Self {
       Vector3D {
            x: self.y * other.z - other.y * self.z,
            y: self.z * other.x - other.z * self.x,
            z: self.x * other.y - other.x * self.y,
        }
	}
}

impl Index<usize> for Vector3D {
    type Output = f32;

    fn index(&self, i: usize) -> &Self::Output {
        match i {
            0 => &self.x,
            1 => &self.y,
			2 => &self.z,
            _ => panic!("Vector3D index out of bounds: {}", i),	
        }
    }
}

impl IndexMut<usize> for Vector3D {
    fn index_mut(&mut self, i: usize) -> &mut Self::Output {
        match i {
            0 => &mut self.x,
            1 => &mut self.y,
			2 => &mut self.z,
            _ => panic!("Vector3D index out of bounds: {}", i),
        }
    }
}