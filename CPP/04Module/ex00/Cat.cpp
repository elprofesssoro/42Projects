/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Cat.cpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-19 14:13:41 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-19 14:13:41 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Cat.hpp"

Cat::Cat()
{
	std::cout << "Default constructor in Cat" << std::endl;
	type = "Cat";
}

Cat::Cat(const Cat &instance) : Animal()
{
	std::cout << "Copy constructor in Cat" << std::endl;
	type = instance.type;
}

Cat &Cat::operator=(const Cat &instance)
{
	std::cout << "Assignment operator in Cat" << std::endl;
	if(this == &instance)
		return *this;
	type = instance.type;
	return *this;
}

Cat::~Cat()
{
	std::cout << "Destructor in Cat" << std::endl;
}

void Cat::makeSound() const
{
	std::cout << "Cat is meowing" << std::endl;
}