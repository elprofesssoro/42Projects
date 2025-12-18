/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PresidentialPardonForm.cpp                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-05-27 12:44:33 by idvinov           #+#    #+#             */
/*   Updated: 2025-05-27 12:44:33 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "PresidentialPardonForm.hpp"

PresidentialPardonForm::PresidentialPardonForm() : AForm("PresidentialPardonForm", 25, 2),
												   target("NO_TARGET")
{
	std::cout << "Default constructor in PresidentialPardonForm" << std::endl;
}

PresidentialPardonForm::PresidentialPardonForm(std::string target) : AForm("PresidentialPardonForm", 25, 2),
																	 target(target)
{
	std::cout << "Constructor with params in PresidentialPardonForm" << std::endl;
}

PresidentialPardonForm::PresidentialPardonForm(const PresidentialPardonForm &instance) : AForm(instance)
{
	std::cout << "Copy constructor in PresidentialPardonForm" << std::endl;
	target = instance.target;
}

PresidentialPardonForm::~PresidentialPardonForm()
{
	std::cout << "Destructor in PresidentialPardonForm" << std::endl;
}

PresidentialPardonForm &PresidentialPardonForm::operator=(const PresidentialPardonForm &instance)
{
	if (this == &instance)
		return *this;

	target = instance.target;
	return *this;
}

void PresidentialPardonForm::Execute(Bureaucrat const &bureaucrat) const
{
	CanBeExecuted(bureaucrat);
	std::cout << GetTarget() << " was pardoned by Zaphod Beeblebrox" << std::endl;
}

std::string PresidentialPardonForm::GetTarget() const
{
	return target;
}

std::ostream &operator<<(std::ostream &stream, const PresidentialPardonForm &instance)
{
	stream << static_cast<const AForm &>(instance);

	stream << ", Target: " << instance.GetTarget();
	return stream;
}
