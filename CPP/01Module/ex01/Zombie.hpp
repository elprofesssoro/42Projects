/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Zombie.hpp                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-13 13:06:31 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-13 13:06:31 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef ZOMBIE_HPP
#define ZOMBIE_HPP

#include <iostream>
#include <string>

class Zombie
{
public:
	Zombie(void);
	Zombie(std::string name);
	~Zombie();
	std::string getName() const;
	void setName(std::string name);
	void announce(void) const;

private:
	std::string name;
};

Zombie *zombieHorde(int N, std::string name);

#endif