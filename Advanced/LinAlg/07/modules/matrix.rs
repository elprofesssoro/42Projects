use std::fmt::Display;
use std::ops::{AddAssign, SubAssign, MulAssign, Index, IndexMut, Mul};
use super::vector2d::Vector2D;
use super::vector::Vector;

pub struct Matrix<const ROWS: usize, const COLS: usize> {
    pub data: [[f32; COLS]; ROWS],
}

impl<const ROWS: usize, const COLS: usize> Matrix<ROWS, COLS> {
    pub fn from(data: [[f32; COLS]; ROWS]) -> Self {
        Matrix { data }
    }

    pub fn size(&self) -> (usize, usize) {
        (ROWS, COLS)
    }
}

impl<const ROWS: usize, const COLS: usize> Matrix<ROWS, COLS> {
    pub fn print(&self) {
        for i in 0..ROWS {
            for j in 0..COLS {
                print!("{} ", self.data[i][j]);
            }
            println!();
        }
    }
}

impl<const ROWS: usize, const COLS: usize> Index<usize> for Matrix<ROWS, COLS> {
    type Output = [f32; COLS];
    fn index(&self, i: usize) -> &Self::Output {
        &self.data[i]
    }
}

impl<const ROWS: usize, const COLS: usize> IndexMut<usize> for Matrix<ROWS, COLS> {
    fn index_mut(&mut self, i: usize) -> &mut Self::Output {
        &mut self.data[i]
    }
}

impl<const ROWS: usize, const COLS: usize> Matrix<ROWS, COLS> {
    pub fn add(&mut self, v: &Matrix<ROWS, COLS>) {
        for i in 0..ROWS {
            for j in 0..COLS {
                self.data[i][j] += v.data[i][j];
            }
        }
    }
	pub fn sub(&mut self, v: &Matrix<ROWS, COLS>)
	{
        for i in 0..ROWS {
            for j in 0..COLS {
                self.data[i][j] -= v.data[i][j];
            }
        }
	}
	pub fn scl(&mut self, a: f32) {
		for i in 0..ROWS {
            for j in 0..COLS {
                self.data[i][j] *= a;
            }
        }
	}
	pub fn mul_vec2D(&self, v: &Vector2D) -> Vector2D {
		let mut out: Vector2D = Vector::zero();
		for i in 0..ROWS {
			let mut sum: f32 = 0.0;
			for j in 0..COLS {
				sum += self.data[i][j] * v[j];
			}
			out[i] = sum;
		}
		out
	}

	pub fn mul_mat<const C: usize>(&self, m: &Matrix<COLS, C>) -> Matrix<ROWS, C> {
        let mut out = Matrix::from([[0.0; C]; ROWS]);
		for i in 0..ROWS {
			for j in 0..C {
				let mut sum = 0.0;
				for k in 0..COLS {
					sum += self[i][k] * m[k][j];
				}
				out[i][j] = sum
			}
		}
		out
	}
}

