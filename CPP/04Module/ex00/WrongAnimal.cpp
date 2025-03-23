/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   WrongAnimal.cpp                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-19 14:19:51 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-19 14:19:51 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "WrongAnimal.hpp"

WrongAnimal::WrongAnimal()
{
	std::cout << "Default constructor in WrongAnimal" << std::endl;
	type = "";
}

WrongAnimal::WrongAnimal(const WrongAnimal &instance)
{
	std::cout << "Copy constructor in WrongAnimal" << std::endl;
	*this = instance;
}

WrongAnimal &WrongAnimal::operator=(const WrongAnimal &instance)
{
	std::cout << "Assignment operator in WrongAnimal" << std::endl;
	if(this == &instance)
		return *this;
	type = instance.type;
	return *this;
}
WrongAnimal::~WrongAnimal()
{
	std::cout << "Destructor in WrongAnimal" << std::endl;
}

void WrongAnimal::makeSound() const
{
	std::cout << "WrongAnimal is making a sound, but which... " << std::endl;
}

std::string WrongAnimal::GetType()
{
	return type;
}
