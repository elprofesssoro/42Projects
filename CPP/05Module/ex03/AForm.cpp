#include "AForm.hpp"

AForm::AForm() : name(""), sGrade(150), eGrade(150), isSigned(false)
{
	std::cout << "Default constructor in AForm" << std::endl;
}

AForm::AForm(std::string name, int sGrade, int eGrade) : name(name), sGrade(sGrade), eGrade(eGrade), isSigned(false)
{
	std::cout << "Constructor with params in AForm" << std::endl;
	try
	{
		CheckGrade(this->sGrade);
		CheckGrade(this->eGrade);
	}
	catch (Bureaucrat::GradeTooLowException &e)
	{
		std::cout << "Initialization of " << *this
				  << std::endl << e.what() << std::endl;
	}
	catch (Bureaucrat::GradeTooHighException &e)
	{
		std::cout << "Initialization of " << *this
				  << std::endl << e.what() << std::endl;
	}
}

AForm::AForm(const AForm &instance) : name(instance.name), sGrade(instance.sGrade),
								   eGrade(instance.eGrade), isSigned(instance.isSigned)
{
	std::cout << "Copy constructor in AForm" << std::endl;
}

AForm::~AForm()
{
	std::cout << "Destructor in AForm" << std::endl;
}

std::string AForm::GetName() const
{
	return name;
}

int AForm::GetSGrade() const
{
	return sGrade;
}

int AForm::GetEGrade() const
{
	return eGrade;
}

bool AForm::IsSigned() const
{
	return isSigned;
}

void AForm::BeSigned(Bureaucrat &bureaucrat)
{
	try
	{
		if (CanSign(bureaucrat.GetGrade()))
			isSigned = true;
		else
			throw Bureaucrat::GradeTooLowException();

		std::cout << bureaucrat << " signed " << *this << std::endl;
	}
	catch (Bureaucrat::GradeTooLowException &e)
	{
		std::cout << bureaucrat.GetName() << " could not sign " << name << "(" << sGrade << ") " << " because "
				  << bureaucrat.GetName() << " " << e.what()  << "(" << bureaucrat.GetGrade() << ") " << std::endl;
	}
}

int AForm::CheckGrade(int value)
{

	if (value < 1)
		throw Bureaucrat::GradeTooHighException();
	else if (value > 150)
		throw Bureaucrat::GradeTooLowException();

	return 1;
}

int AForm::CanSign(int value)
{

	if (sGrade < 1)
		throw Bureaucrat::GradeTooHighException();
	else if (sGrade > 150 || value > sGrade)
		throw Bureaucrat::GradeTooLowException();

	return 1;
}

int AForm::CanBeExecuted(Bureaucrat const &bureaucrat) const
{
	if (!IsSigned())
		throw FormNotSigned();
	else if (bureaucrat.GetGrade() > GetEGrade())
		throw Bureaucrat::GradeTooLowException();
	return 1;
}

std::ostream &operator<<(std::ostream &stream, const AForm &instance)
{
	stream << "Form: " << instance.GetName() << ", sign grade:  " << instance.GetSGrade()
		   << ", execute grade: " << instance.GetEGrade() << ", is signed: " << instance.IsSigned();
	return stream;
}

const char *AForm::FormNotSigned::what() const throw()
{
	return ("Form is not signed");
}

const char *AForm::GradeTooHighException::what() const throw()
{
	return ("Form grade is too high");
}

const char *AForm::GradeTooLowException::what() const throw()
{
	return ("Form grade is too low");
}


