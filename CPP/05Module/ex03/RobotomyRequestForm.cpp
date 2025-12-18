/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   RobotomyRequestForm.cpp                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-05-27 12:44:33 by idvinov           #+#    #+#             */
/*   Updated: 2025-05-27 12:44:33 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "RobotomyRequestForm.hpp"

RobotomyRequestForm::RobotomyRequestForm() : AForm()
{
	std::cout << "Default constructor in RobotomyRequestForm" << std::endl;
}

RobotomyRequestForm::RobotomyRequestForm(std::string target) : AForm("RobotomyRequestForm", 72, 45),
															   target(target)
{
	std::cout << "Constructor with params in RobotomyRequestForm" << std::endl;
}

RobotomyRequestForm::RobotomyRequestForm(const RobotomyRequestForm &instance) : AForm(instance)
{
	std::cout << "Copy constructor in RobotomyRequestForm" << std::endl;
	target = instance.target;
}

RobotomyRequestForm::~RobotomyRequestForm()
{
	std::cout << "Destructor in RobotomyRequestForm" << std::endl;
}

RobotomyRequestForm &RobotomyRequestForm::operator=(const RobotomyRequestForm &instance)
{
	if (this == &instance)
		return *this;

	target = instance.target;
	return *this;
}

static int robotomy = 0;
void RobotomyRequestForm::Execute(Bureaucrat const &bureaucrat) const
{
	CanBeExecuted(bureaucrat);
	if (robotomy++ % 2)
		std::cout << "BRRRRRRRRRRRRRR\n"
				  << GetTarget() << " was robotomized" << std::endl;
	else
		std::cout << "Robotomy failed" << std::endl;
}

std::string RobotomyRequestForm::GetTarget() const
{
	return target;
}

std::ostream &operator<<(std::ostream &stream, const RobotomyRequestForm &instance)
{
	stream << static_cast<const AForm &>(instance);

	stream << ", Target: " << instance.GetTarget();
	return stream;
}