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
#include "FragTrap.hpp"

int	main(void)
{
	std::string s1 = "Clyde";
	std::string s2 = "Scarlet";
	std::string s3 = "Fred";

	// Constructors
	ClapTrap claptrap(s1);
	ScavTrap scavtrap(s2);
	FragTrap fragtrap(s3);
	std::cout << std::endl;

	// Attacks for each class
	fragtrap.attack(s2);
	claptrap.attack(s2);
	scavtrap.attack(s1);
	std::cout << std::endl;

	// New class attack until exhaustion
	fragtrap.attack(s2);
	fragtrap.attack(s2);
	fragtrap.attack(s2);
	fragtrap.attack(s2);
	std::cout << std::endl;

	// New class personal method call
	fragtrap.highFivesGuys();
	std::cout << std::endl;

	// Repair over max hp
	fragtrap.beRepaired(18);

	// Take damage
	fragtrap.takeDamage(50);

	// Die
	fragtrap.takeDamage(50);

	// Do something after dying
	fragtrap.beRepaired(20);
	fragtrap.attack(s2);

	std::cout << std::endl;
	return (0);
}