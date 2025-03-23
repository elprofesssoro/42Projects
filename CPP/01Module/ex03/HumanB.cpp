/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   HumanB.cpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-13 15:12:49 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-13 15:12:49 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "HumanB.hpp"

HumanB::HumanB(std::string name) : name(name)
{
	weapon = NULL;
}

void HumanB::attack()
{
	if (weapon == NULL)
		return;
	std::string str = weapon->getType().empty() ? "No weapon" : weapon->getType();
	std::cout << name << "> attacks with their " << str << std::endl;
}

void HumanB::setWeapon(Weapon &weapon)
{
	this->weapon = &weapon;
}
