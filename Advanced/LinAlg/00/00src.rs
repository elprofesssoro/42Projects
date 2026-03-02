
fn main() {
	let a = 5;
	let b = 10;
	let result = add(a, b);
	println!("The sum of {} and {} is {}", a, b, result);
}

fn add(x: i32, y: i32) -> i32 {
	x + y
}
