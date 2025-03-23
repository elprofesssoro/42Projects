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
	brain = new Brain;
}

Dog::Dog(const Dog &instance) : Animal()
{
	std::cout << "Copy constructor in Dog" << std::endl;
	type = instance.type;
	brain = new Brain(*(instance.GetBrain()));
}

Dog &Dog::operator=(const Dog &instance)
{
	std::cout << "Assignment operator in Dog" << std::endl;
	if(this == &instance)
		return *this;
	type = instance.type;
	brain = new Brain(*(instance.GetBrain()));
	return *this;
}

Dog::~Dog()
{
	std::cout << "Destructor in Dog" << std::endl;
	delete brain;
}

void Dog::makeSound() const
{
	std::cout << "Dog is barking" << std::endl;
}

Brain *Dog::GetBrain() const
{
	return brain;
}
void Dog::Compare(const Dog &other)
{
	std::cout << std::endl;
	std::cout << "Now comparing two dogs\n";
	std::cout << "My brain's heap address: " << static_cast<void*>(brain) << std::endl;
	std::cout << "Other's heap address: " << static_cast<void*>(other.GetBrain()) << std::endl;
	std::cout << std::endl;
	std::cout << "My brain's ideas \t\t | \t\t\t Other brain's ideas\n";
	for (int i = 0; i < 100; i++)
		std::cout << "-";
	std::cout << std::endl;
	for (int i = 0; i < 100; i++)
		std::cout << (brain->getIdeas())[i] << "\t\t\t | \t\t\t" << ((other.GetBrain())->getIdeas())[i] << std::endl;
	std::cout << std::endl;
}
