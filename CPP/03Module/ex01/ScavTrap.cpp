/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ScavTrap.cpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-18 13:08:42 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-18 13:08:42 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ScavTrap.hpp"

ScavTrap::ScavTrap(std::string name) : ClapTrap(name)
{
	std::cout << "Constructor in ScavTrap" << std::endl;
	hitPoints = 100;
	energyPoints = 50;
	attackDamage = 20;
}
ScavTrap::ScavTrap(const ScavTrap &instance) : ClapTrap(instance.name)
{
	std::cout << "Copy constructor in ScavTrap" << std::endl;
	*this = instance;
}
ScavTrap &ScavTrap::operator=(const ScavTrap &instance)
{
	std::cout << "Assignment operator in ScavTrap" << std::endl;
	if (this == &instance)
		return *this;

	this->name = instance.GetName();
	this->attackDamage = instance.GetAttackDamage();
	this->hitPoints = instance.GetHitPoints();
	this->energyPoints = instance.GetEnergyPoints();
	return *this;
}
ScavTrap::~ScavTrap()
{
	std::cout << "Destructor in ScavTrap" << std::endl;
}

void ScavTrap::attack(std::string &target)
{
	if (energyPoints <= 0)
	{
		std::cout << "No enery points" << std::endl;
		return;
	}
	if (hitPoints <= 0)
	{
		std::cout << "ScavTrap " << name << " is dead" << std::endl;
		return;
	}
	--energyPoints;
	std::cout << "ScavTrap " << name << " attacks " << target << " , causing "
			  << attackDamage << " points of damage!" << std::endl;
}

void ScavTrap::guardGate()
{
	std::cout << "ScavTrap " << name << " is now in Gate keeper mode" << std::endl;
}