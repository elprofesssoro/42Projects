#include "Bureaucrat.hpp"
#include "AForm.hpp"
#include "ShrubberyCreationForm.hpp"
#include "RobotomyRequestForm.hpp"
#include "PresidentialPardonForm.hpp"
#include "Intern.hpp"

int main()
{

	{
		Intern someRandomIntern;
		AForm *rrf;
		rrf = someRandomIntern.MakeForm("PresidentialPardon", "Bender");
		if (rrf != NULL)
		{
			std::cout << *rrf << std::endl;
			delete rrf;
		}
	}
	std::cout << std::endl;
	{
		Intern someRandomIntern;
		AForm *rrf;
		rrf = someRandomIntern.MakeForm("qweqweqwe", "Bender");
		if (rrf != NULL)
		{
			std::cout << *rrf << std::endl;
			delete rrf;
		}
	}
}