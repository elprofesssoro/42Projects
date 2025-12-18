#include "Bureaucrat.hpp"
#include "Form.hpp"

int main()
{
	Bureaucrat b("Bob", 156);
	b.IncrementGrade(5);
	b.DecrementGrade(10);

	b.IncrementGrade(141);
	Form f("Form1", 1, 0);
	b.SignForm(f);
	std::cout << b << std::endl;
}