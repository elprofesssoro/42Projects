/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Intern.cpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-05-27 14:58:23 by idvinov           #+#    #+#             */
/*   Updated: 2025-05-27 14:58:23 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Intern.hpp"

Intern::Intern()
{
	std::cout << "Default constructor in Intern" << std::endl;
	formNames[0] = "shrubberycreation\0";
	formNames[1] = "robotomyrequest\0";
	formNames[2] = "presidentialpardon\0";
}

Intern::Intern(const Intern &instance)
{
	std::cout << "Copy constructor in Intern" << std::endl;
	for(int i = 0; i < 3; i++)
		formNames[i] = instance.formNames[i];
}

Intern::~Intern()
{
	std::cout << "Destructor in Intern" << std::endl;
}

Intern &Intern::operator=(const Intern &instance)
{
	if (this == &instance)
		return *this;

	return *this;
}

AForm *Intern::MakeForm(std::string name, std::string target)
{
	std::string namet = name;
	AForm *form = NULL;
	name = RemoveSpaces(name);
	switch (FindName(name))
	{
	case 0:
		form = new ShrubberyCreationForm(target);
		break;
	case 1:
		form = new RobotomyRequestForm(target);
		break;
	case 2:
		form = new PresidentialPardonForm(target);
		break;
	default:
		form = NULL;
		std::cout << "No form such form (" << namet << ") was found" << std::endl;
		break;
	}
	if (form != NULL)
		std::cout << "Intern creates " << form->GetName() << std::endl;
	return form;
}

int Intern::FindName(std::string name)
{
	for (int i = 0; i < 3; i++)
	{
		if (!name.compare(formNames[i]))
			return i;
	}
	return -1;
}

std::string Intern::RemoveSpaces(std::string str)
{
	int i = 0, j = 0;
	while (str[i])
	{
		str[i] = tolower(str[i]);
		if (str[i] != ' ')
			str[j++] = str[i];
		i++;
	}
	str.resize(j);
	return str;
}
