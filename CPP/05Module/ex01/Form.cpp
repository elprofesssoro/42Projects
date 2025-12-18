#include "Form.hpp"

Form::Form() : name(""), sGrade(150), eGrade(150), isSigned(false)
{
	std::cout << "Default constructor in Form" << std::endl;
}

Form::Form(std::string name, int sGrade, int eGrade) : name(name), sGrade(sGrade), eGrade(eGrade), isSigned(false)
{
	std::cout << "Constructor with params in Form" << std::endl;
	try
	{
		CheckGrade(this->sGrade);
		CheckGrade(this->eGrade);
	}
	catch (Form::GradeTooLowException &e)
	{
		std::cout << "Initialization of " << *this
				  << std::endl
				  << e.what() << std::endl;
	}
	catch (Form::GradeTooHighException &e)
	{
		std::cout << "Initialization of " << *this
				  << std::endl
				  << e.what() << std::endl;
	}
}

Form::Form(const Form &instance) : name(instance.name), sGrade(instance.sGrade),
								   eGrade(instance.eGrade), isSigned(instance.isSigned)
{
	std::cout << "Copy constructor in Form" << std::endl;
}

Form::~Form()
{
	std::cout << "Destructor in Form" << std::endl;
}

Form Form::operator=(const Form &instance)
{
	std::cout << "Assignment operator in Form" << std::endl;
	if (this == &instance)
		return *this;
	isSigned = instance.isSigned;
	return *this;
}
std::string Form::GetName() const
{
	return name;
}

int Form::GetSGrade() const
{
	return sGrade;
}

int Form::GetEGrade() const
{
	return eGrade;
}

bool Form::IsSigned() const
{
	return isSigned;
}

void Form::BeSigned(Bureaucrat &bureaucrat)
{
	try
	{
		if (CanSign(bureaucrat.GetGrade()))
			isSigned = true;
		else
			throw GradeTooLowException();

		std::cout << bureaucrat << " signed " << *this;
	}
	catch (GradeTooLowException &e)
	{
		std::cout << bureaucrat.GetName() << " could not sign " << name << " because "
				  << e.what() << std::endl;
	}
}

int Form::CheckGrade(int value)
{

	if (value < 1)
		throw Form::GradeTooHighException();
	else if (value > 150)
		throw Form::GradeTooLowException();

	return 1;
}

int Form::CanSign(int value)
{

	if (sGrade < 1)
		throw Form::GradeTooHighException();
	else if (sGrade > 150 || value > sGrade)
		throw Form::GradeTooLowException();

	return 1;
}

std::ostream &operator<<(std::ostream &stream, const Form &instance)
{
	stream << "Form: " << instance.GetName() << ", sign grade:  " << instance.GetSGrade()
		   << ", execute grade: " << instance.GetEGrade() << ", is signed: " << instance.IsSigned();
	return stream;
}

const char *Form::GradeTooHighException::what() const throw()
{
	return ("Form grade is too high\n");
}

const char *Form::GradeTooLowException::what() const throw()
{
	return ("Form grade is too low\n");
}
