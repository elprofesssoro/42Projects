/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-17 15:57:36 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-17 15:57:36 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ClapTrap.hpp"
#include "ScavTrap.hpp"

int	main(void)
{
	std::string s1 = "Clyde";
	std::string s2 = "Scarlet";

	ClapTrap claptrap(s1);
	ScavTrap scavtrap(s2);

	std::cout << std::endl;
	claptrap.attack(s2);
	scavtrap.takeDamage(0);
	scavtrap.beRepaired(18);
	std::cout << std::endl;
	scavtrap.attack(s1);
	claptrap.takeDamage(20);
	scavtrap.attack(s1);
	claptrap.takeDamage(20);
	scavtrap.attack(s1);
	claptrap.beRepaired(64);
	std::cout << std::endl;
	scavtrap.guardGate();
	scavtrap.attack(s1);
	std::cout << std::endl;
	scavtrap.takeDamage(100);
	scavtrap.takeDamage(1);
	scavtrap.attack(s2);
	scavtrap.beRepaired(200);
	
	std::cout << std::endl;
	return (0);
}