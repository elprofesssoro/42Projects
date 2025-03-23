/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Weapon.cpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-13 15:10:20 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-13 15:10:20 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Weapon.hpp"

Weapon::Weapon() : type("")
{
}

Weapon::Weapon(std::string type) : type(type)
{
}

const std::string &Weapon::getType()
{
	return type;
}

void Weapon::setType(std::string type)
{
	this->type = type;
}