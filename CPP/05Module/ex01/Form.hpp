#ifndef FORM_HPP
#define FORM_HPP

#include <iostream>
#include "Bureaucrat.hpp"

class Bureaucrat;
class Form
{
private:
	const std::string name;
	const int sGrade;
	const int eGrade;
	bool isSigned;
	int CheckGrade(int value);
	int CanSign(int value);

public:
	Form();
	Form(std::string name, int sGrage, int eGrade);
	Form(const Form &instance);
	~Form();
	Form operator=(const Form &instance);
	std::string GetName() const;
	int GetSGrade() const;
	int GetEGrade() const;
	bool IsSigned() const;
	void BeSigned(Bureaucrat &bureaucrat);

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
std::ostream &operator<<(std::ostream &stream, const Form &instance);

#endif