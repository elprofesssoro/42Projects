/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   zombieHorde.cpp                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-13 13:29:31 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-13 13:29:31 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Zombie.hpp"
#include <sstream>

static std::string to_string(int n)
{
	std::stringstream stm;
	stm << n;
	return stm.str();
}

Zombie *zombieHorde(int N, std::string name)
{
	if(N < 0)
	{
		std::cout << "Amount of zombies is less than 0\n";
		return NULL;
	}
	Zombie *zombies = new Zombie[N];
	for (int i = 0; i < N; i++)
	{
		zombies[i].setName(name + " " + to_string(i + 1));
		zombies[i].announce();
	}

	return (&zombies[0]);
}