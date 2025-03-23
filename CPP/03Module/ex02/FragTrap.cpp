/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   FragTrap.cpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-18 13:36:39 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-18 13:36:39 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "FragTrap.hpp"

FragTrap::FragTrap(std::string name) : ClapTrap(name)
{
	std::cout << "Constructor in FragTrap" << std::endl;
	hitPoints = 100;
	energyPoints = 100;
	attackDamage = 30;
}
FragTrap::FragTrap(const FragTrap &instance) : ClapTrap(instance.name)
{
	std::cout << "Copy constructor in FragTrap" << std::endl;
	*this = instance;
}
FragTrap &FragTrap::operator=(const FragTrap &instance)
{
	std::cout << "Assignment operator in FragTrap" << std::endl;
	if (this == &instance)
		return *this;

	this->name = instance.GetName();
	this->attackDamage = instance.GetAttackDamage();
	this->hitPoints = instance.GetHitPoints();
	this->energyPoints = instance.GetEnergyPoints();
	return *this;
}
FragTrap::~FragTrap()
{
	std::cout << "Destructor in FragTrap" << std::endl;
}

void FragTrap::attack(std::string &target)
{
	if (energyPoints <= 0)
	{
		std::cout << "No enery points" << std::endl;
		return;
	}
	if (hitPoints <= 0)
	{
		std::cout << "FragTrap " << name << " is dead" << std::endl;
		return;
	}
	--energyPoints;
	std::cout << "FragTrap " << name << " attacks " << target << ", causing "
			  << attackDamage << " points of damage!" << std::endl;
}

void FragTrap::highFivesGuys()
{
	std::cout << "FragTrap " << name << " positive high-fives request" << std::endl;
}