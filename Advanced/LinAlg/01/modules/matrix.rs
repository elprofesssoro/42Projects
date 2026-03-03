use std::fmt::Display;
use std::ops::{AddAssign, SubAssign, MulAssign};

pub struct Matrix<K, const ROWS: usize, const COLS: usize> {
    pub data: [[K; COLS]; ROWS],
}

impl<K, const ROWS: usize, const COLS: usize> Matrix<K, ROWS, COLS> {
    pub fn from(data: [[K; COLS]; ROWS]) -> Self {
        Matrix { data }
    }

    pub fn size(&self) -> (usize, usize) {
        (ROWS, COLS)
    }
}

impl<K: Display, const ROWS: usize, const COLS: usize> Matrix<K, ROWS, COLS> {
    pub fn print(&self) {
        for i in 0..ROWS {
            for j in 0..COLS {
                print!("{} ", self.data[i][j]);
            }
            println!();
        }
    }
}

impl<K: Copy + AddAssign + MulAssign + SubAssign, const ROWS: usize, const COLS: usize> Matrix<K, ROWS, COLS> {
    pub fn add(&mut self, v: &Matrix<K, ROWS, COLS>) {
        for i in 0..ROWS {
            for j in 0..COLS {
                self.data[i][j] += v.data[i][j];
            }
        }
    }
	pub fn sub(&mut self, v: &Matrix<K, ROWS, COLS>)
	{
        for i in 0..ROWS {
            for j in 0..COLS {
                self.data[i][j] -= v.data[i][j];
            }
        }
	}
	pub fn scl(&mut self, a: K) {
		        for i in 0..ROWS {
            for j in 0..COLS {
                self.data[i][j] *= a;
            }
        }
	}
}