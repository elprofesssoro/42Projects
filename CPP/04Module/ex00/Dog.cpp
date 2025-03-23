/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Dog.cpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-19 13:46:05 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-19 13:46:05 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Dog.hpp"

Dog::Dog()
{
	std::cout << "Default constructor in Dog" << std::endl;
	type = "Dog";
}

Dog::Dog(const Dog &instance) : Animal()
{
	std::cout << "Copy constructor in Dog" << std::endl;
	type = instance.type;
}

Dog &Dog::operator=(const Dog &instance)
{
	std::cout << "Assignment operator in Dog" << std::endl;
	if(this == &instance)
		return *this;
	type = instance.type;
	return *this;
}

Dog::~Dog()
{
	std::cout << "Destructor in Dog" << std::endl;
}

void Dog::makeSound() const
{
	std::cout << "Dog is barking" << std::endl;
}