/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   WrongCat.cpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-19 14:19:32 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-19 14:19:32 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


#include "WrongCat.hpp"

WrongCat::WrongCat()
{
	std::cout << "Default constructor in WrongCat" << std::endl;
	type = "WrongCat";
}

WrongCat::WrongCat(const WrongCat &instance) : WrongAnimal()
{
	std::cout << "Copy constructor in WrongCat" << std::endl;
	*this = instance;
}

WrongCat &WrongCat::operator=(const WrongCat &instance)
{
	std::cout << "Assignment operator in WrongCat" << std::endl;
	if(this == &instance)
		return *this;
	type = instance.type;
	return *this;
}

WrongCat::~WrongCat()
{
	std::cout << "Destructor in WrongCat" << std::endl;
}

void WrongCat::makeSound() const
{
	std::cout << "WrongCat is meowing" << std::endl;
}