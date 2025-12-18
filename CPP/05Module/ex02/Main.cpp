#include "Bureaucrat.hpp"
#include "AForm.hpp"
#include "ShrubberyCreationForm.hpp"
#include "RobotomyRequestForm.hpp"
#include "PresidentialPardonForm.hpp"

int main()
{
	Bureaucrat b("Bob", 156);
	b.IncrementGrade(5);
	b.DecrementGrade(10);

	b.IncrementGrade(141);
	ShrubberyCreationForm *f = new ShrubberyCreationForm("Sh");
	b.SignForm(*f);
	b.ExecuteForm(*f);
	std::cout << std::endl << *f << std::endl;
	AForm *f1 = new RobotomyRequestForm("Ro");
	b.SignForm(*f1);
	b.ExecuteForm(*f1);
	std::cout << std::endl;
	PresidentialPardonForm *f2 = new PresidentialPardonForm("Pr");
	b.SignForm(*f2);
	b.ExecuteForm(*f2);
	std::cout << std::endl << *f2 << std::endl;
	delete f;
	delete f1;
	delete f2;
}