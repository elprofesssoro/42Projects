/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Intern.hpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-05-27 14:54:55 by idvinov           #+#    #+#             */
/*   Updated: 2025-05-27 14:54:55 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef INTERN_HPP
#define INTERN_HPP

#include <iostream>
#include "AForm.hpp"
#include "PresidentialPardonForm.hpp"
#include "ShrubberyCreationForm.hpp"
#include "RobotomyRequestForm.hpp"

class Intern
{
private:
	std::string formNames[3];
	std::string RemoveSpaces(std::string str);
	int FindName(std::string name);
public:
	Intern();
	Intern(std::string name, int sGrage, int eGrade);
	Intern(const Intern &instance);
	Intern &operator=(const Intern &instance);
	~Intern();
	AForm *MakeForm(std::string name, std::string target);
};

std::ostream &operator<<(std::ostream &stream, const Intern &instance);

#endif