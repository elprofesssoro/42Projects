/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ShrubberyCreationForm.cpp                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-05-23 11:31:49 by idvinov           #+#    #+#             */
/*   Updated: 2025-05-23 11:31:49 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ShrubberyCreationForm.hpp"

ShrubberyCreationForm::ShrubberyCreationForm() : AForm(), target("NO-TARGET")
{
	std::cout << "Default constructor in ShrubberyCreationForm" << std::endl;
}

ShrubberyCreationForm::ShrubberyCreationForm(std::string target) : AForm("ShrubberyCreationForm", 145, 137),
																   target(target)
{
	std::cout << "Constructor with params in ShrubberyCreationForm" << std::endl;
}

ShrubberyCreationForm::ShrubberyCreationForm(const ShrubberyCreationForm &instance) : AForm(instance)
{
	std::cout << "Copy constructor in ShrubberyCreationForm" << std::endl;
	target = instance.target;
}

ShrubberyCreationForm::~ShrubberyCreationForm()
{
	std::cout << "Destructor in ShrubberyCreationForm" << std::endl;
}

ShrubberyCreationForm &ShrubberyCreationForm::operator=(const ShrubberyCreationForm &instance)
{
	if (this == &instance)
		return *this;

	target = instance.target;
	return *this;
}

void ShrubberyCreationForm::Execute(Bureaucrat const &bureaucrat) const
{
	CanBeExecuted(bureaucrat);

	std::ofstream outfile(GetTarget().append("_shrubbery").c_str());
	outfile << "       *       " << std::endl
			<< "      ***      " << std::endl
			<< "     *****     " << std::endl
			<< "    *******    " << std::endl
			<< "   *********   " << std::endl
			<< "  ***********  " << std::endl
			<< " ************* " << std::endl
			<< "      ||||     " << std::endl
			<< "      ||||     " << std::endl;

	outfile.close();
}

std::string ShrubberyCreationForm::GetTarget() const
{
	return target;
}

std::ostream &operator<<(std::ostream &stream, const ShrubberyCreationForm &instance)
{
	stream << static_cast<const AForm &>(instance);

	stream << ", Target: " << instance.GetTarget();
	return stream;
}
