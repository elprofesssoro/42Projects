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
	brain = new Brain;
}

Cat::Cat(const Cat &instance) : Animal()
{
	std::cout << "Copy constructor in Cat" << std::endl;
	brain = new Brain(*(instance.GetBrain()));
	type = instance.type;
}

Cat &Cat::operator=(const Cat &instance)
{
	std::cout << "Assignment operator in Cat" << std::endl;
	if(this == &instance)
		return *this;
	brain = new Brain(*(instance.GetBrain()));
	type = instance.type;
	return *this;
}

Cat::~Cat()
{
	std::cout << "Destructor in Cat" << std::endl;
	delete brain;
}

void Cat::makeSound() const
{
	std::cout << "Cat is meowing" << std::endl;
}

Brain *Cat::GetBrain() const
{
	return brain;
}
void Cat::Compare(const Cat &other)
{
	std::cout << std::endl;
	std::cout << "Now comparing two cats\n";
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