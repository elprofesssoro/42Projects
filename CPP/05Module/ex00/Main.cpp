#include "Bureaucrat.hpp"

int main()
{
	Bureaucrat b("Bob", 1);
	b.IncrementGrade(5);
	b.DecrementGrade(10);

	//b.IncrementGrade(144);

	std::cout << b;
}