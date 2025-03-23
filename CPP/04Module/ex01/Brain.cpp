/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Brain.cpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-19 14:34:23 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-19 14:34:23 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Brain.hpp"

Brain::Brain()
{
	ideas = new std::string[100];
	for(int i = 0; i < 100; i++)
		ideas[i] = "Something";
	std::cout << "Default constructor in Brain" << std::endl;
}

Brain::Brain(const Brain &instance)
{
	std::cout << "Copy constructor in Brain" << std::endl;
	std::string *temp = instance.getIdeas();
	ideas = new std::string[100];
	for(int i = 0; i < 100; i++)
		ideas[i] = temp[i] + "copy";
}

Brain &Brain::operator=(const Brain &instance)
{
	std::cout << "Assignment operator in Brain" << std::endl;
	if(this == &instance)
		return *this;
	if(ideas)
		delete[] ideas;
	ideas = new std::string[100];	
	std::string *temp = instance.getIdeas();
	for(int i = 0; i < 100; i++)
		ideas[i] = temp[i] + "copy2";
	return *this;
}
Brain::~Brain()
{
	std::cout << "Destructor in Brain" << std::endl;
	delete[] ideas;
}

std::string *Brain::getIdeas() const
{
	return ideas;
}