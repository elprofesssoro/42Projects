/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Animal.cpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-19 14:16:54 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-19 14:16:54 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


#include "Animal.hpp"

Animal::Animal()
{
	std::cout << "Default constructor in Animal" << std::endl;
	type = "";
}

Animal::Animal(const Animal &instance)
{
	std::cout << "Copy constructor in Animal" << std::endl;
	type = instance.type;
}

Animal &Animal::operator=(const Animal &instance)
{
	std::cout << "Assignment operator in Animal" << std::endl;
	if(this == &instance)
		return *this;
	type = instance.type;
	return *this;
}

Animal::~Animal()
{
	std::cout << "Destructor in Animal" << std::endl;
}

void Animal::makeSound() const
{
	std::cout << "Animal is making a sound, but which... " << std::endl;
}

std::string Animal::GetType() const
{
	return type;
}
