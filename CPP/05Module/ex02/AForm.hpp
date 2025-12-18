#ifndef AForm_HPP
#define AForm_HPP

#include <iostream>
#include "Bureaucrat.hpp"

class Bureaucrat;
class AForm
{
private:
	const std::string name;
	const int sGrade;
	const int eGrade;
	bool isSigned;
	int	CheckGrade(int value);
	int CanSign(int value);

protected:
	int CanBeExecuted(Bureaucrat const &bureaucrat) const;
public:
	AForm();
	AForm(std::string name, int sGrage, int eGrade);
	AForm(const AForm &instance);
	virtual ~AForm();
	void BeSigned(Bureaucrat &bureaucrat);
	virtual void Execute(Bureaucrat const &bureaucrat) const = 0;
	std::string GetName() const;
	int GetSGrade() const;
	int GetEGrade() const;
	bool IsSigned() const;

	class FormNotSigned : public std::exception
	{
	public:
		virtual const char *what() const throw();
	};
	class GradeTooHighException : public std::exception
	{
	public:
		virtual const char *what() const throw();
	};
	class GradeTooLowException : public std::exception
	{
	public:
		virtual const char *what() const throw();
	};
};

std::ostream &operator<<(std::ostream &stream, const AForm &instance);

#endif