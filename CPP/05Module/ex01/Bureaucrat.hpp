#ifndef BUR_HPP
#define BUR_HPP

#include <iostream>
#include "Form.hpp"

class Form;
class Bureaucrat
{
private:
	const std::string name;
	int grade;
	void SetGrade(int value);

public:
	Bureaucrat();
	Bureaucrat(std::string name, int grade);
	Bureaucrat(const Bureaucrat &instance);
	~Bureaucrat();
	Bureaucrat operator=(const Bureaucrat &instance);
	std::string GetName() const;
	int GetGrade() const;
	void IncrementGrade(int value);
	void DecrementGrade(int value);
	void SignForm(Form &form);
	
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

std::ostream &operator<<(std::ostream &stream, const Bureaucrat &instance);

#endif