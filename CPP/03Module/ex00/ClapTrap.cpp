/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ClapTrap.cpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-17 15:58:27 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-17 15:58:27 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ClapTrap.hpp"

ClapTrap::ClapTrap(std::string name) : name(name), hitPoints(10),
									   energyPoints(10), attackDamage(0)
{
	std::cout << "Default constructor in ClapTrap" << std::endl;
}

ClapTrap::ClapTrap(const ClapTrap &instance)
{
	std::cout << "Copy constructor in ClapTrap" << std::endl;
	*this = instance;
}

ClapTrap &ClapTrap::operator=(const ClapTrap &instance)
{
	std::cout << "Assignment operator in ClapTrap" << std::endl;
	if (this == &instance)
		return *this;

	this->name = instance.GetName();
	this->attackDamage = instance.GetAttackDamage();
	this->hitPoints = instance.GetHitPoints();
	this->energyPoints = instance.GetEnergyPoints();
	return *this;
}

ClapTrap::~ClapTrap()
{
	std::cout << "Destructor in ClapTrap" << std::endl;
}

void ClapTrap::attack(const std::string &target)
{
	if (energyPoints <= 0)
	{
		std::cout << "No enery points" << std::endl;
		return;
	}
	if (hitPoints <= 0)
	{
		std::cout << "ClapTrap " << name << " is dead" << std::endl;
		return ;
	}
	--energyPoints;
	std::cout << "ClapTrap " << name << " attacks " << target << " , causing "
			  << attackDamage << " points of damage!" << std::endl;
}

void ClapTrap::takeDamage(unsigned int amount)
{
	int h = hitPoints - amount;
	if(h <= 0)
		h = 0;
	std::cout << "ClapTrap " << name << " takes damage " << amount << " hit points "
			  << hitPoints << ". Now: " << h << std::endl;

	if (h == 0)
		std::cout << "ClapTrap " << name << " is dead" << std::endl;
	hitPoints = h;

}
void ClapTrap::beRepaired(unsigned int amount)
{
	if (energyPoints <= 0)
	{
		std::cout << "No enery points" << std::endl;
		return;
	}
	if (hitPoints <= 0)
	{
		std::cout << "ClapTrap " << name << " is dead" << std::endl;
		return ;
	}
	--energyPoints;
	std::cout << "ClapTrap " << name << " repairs " << amount << " hit points "
			  << hitPoints << ". Now: " << hitPoints + amount << std::endl;
	hitPoints += amount;
}

std::string ClapTrap::GetName() const
{
	return name;
}

int ClapTrap::GetHitPoints() const
{
	return hitPoints;
}

int ClapTrap::GetEnergyPoints() const
{
	return energyPoints;
}

int ClapTrap::GetAttackDamage() const
{
	return attackDamage;
}