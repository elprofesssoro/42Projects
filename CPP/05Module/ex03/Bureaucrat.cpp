#include "Bureaucrat.hpp"

Bureaucrat::Bureaucrat() : name(""), grade(150)
{
	std::cout << "Default constructor in Bureaucrat" << std::endl;
}

Bureaucrat::Bureaucrat(std::string name, int grade) : name(name), grade(grade)
{
	std::cout << "Constructor with params in Bureaucrat" << std::endl;
	try
	{
		SetGrade(grade);
	}
	catch (Bureaucrat::GradeTooLowException &e)
	{
		std::cout << "Initialization of " << *this
				  << std::endl
				  << e.what() << std::endl
				  << "Setting to 150\n";
		this->grade = 150;
	}
	catch (Bureaucrat::GradeTooHighException &e)
	{
		std::cout << "Initialization of " << *this
				  << std::endl
				  << e.what() << std::endl
				  << "Setting to 150\n";
		;
		this->grade = 150;
	}
}

Bureaucrat::Bureaucrat(const Bureaucrat &instance) : name(instance.name), grade(instance.grade)
{
	std::cout << "Copy constructor in Bureaucrat" << std::endl;
}

Bureaucrat::~Bureaucrat()
{
	std::cout << "Destructor in Bureaucrat" << std::endl;
}
Bureaucrat Bureaucrat::operator=(const Bureaucrat &instance)
{
	std::cout << "Assignment operator in Bureaucrat" << std::endl;
	if (this == &instance)
		return *this;
	grade = instance.grade;
	return *this;
}
std::string Bureaucrat::GetName() const
{
	return name;
}

int Bureaucrat::GetGrade() const
{
	return grade;
}

void Bureaucrat::DecrementGrade(int value)
{
	try
	{
		SetGrade(grade + value);
	}
	catch (Bureaucrat::GradeTooLowException &e)
	{
		std::cout << "Could not decrement grade " << "on " << value << std::endl
				  << *this
				  << e.what() << std::endl;
	}
}

void Bureaucrat::IncrementGrade(int value)
{
	try
	{
		SetGrade(grade - value);
	}
	catch (Bureaucrat::GradeTooHighException &e)
	{
		std::cout << "Could not increment grade " << "on " << value << std::endl
				  << *this
				  << e.what() << std::endl;
	}
}

void Bureaucrat::SetGrade(int value)
{

	if (value < 1)
		throw Bureaucrat::GradeTooHighException();
	else if (value > 150)
		throw Bureaucrat::GradeTooLowException();

	grade = value;
	std::cout << "Changing grade to " << grade << std::endl;
}

void Bureaucrat::SignForm(AForm &form)
{
	form.BeSigned(*this);
}

void Bureaucrat::ExecuteForm(AForm const &form) const
{
	try
	{
		form.Execute(*this);
		std::cout << *this << " executed " << form << std::endl;
	}
	catch (AForm::GradeTooLowException &e)
	{
		std::cout << name << " " << e.what() << " to sign form " << form.GetName() << std::endl;
	}
	catch (AForm::GradeTooHighException &e)
	{
		std::cout << name << " " << e.what() << " to sign form " << form.GetName() << std::endl;
	}
	catch (AForm::FormNotSigned &e)
	{
		std::cout << form.GetName() << " " << e.what() << std::endl;
	}
}

std::ostream &operator<<(std::ostream &stream, const Bureaucrat &instance)
{
	stream << instance.GetName() << ", bureaucrat grade " << instance.GetGrade() << ".";
	return stream;
}

const char *Bureaucrat::GradeTooHighException::what() const throw()
{
	return ("Bureaucrat grade is too high");
}

const char *Bureaucrat::GradeTooLowException::what() const throw()
{
	return ("Bureaucrat grade is too low");
}
