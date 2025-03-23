/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Harl.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-14 13:45:25 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-14 13:45:25 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Harl.hpp"

void Harl::complain(std::string level)
{
	void (Harl::*func[4])(void) = {&Harl::debug, &Harl::info, &Harl::warning, &Harl::error};
	std::string msg[4] = {"DEBUG", "INFO", "WARNING", "ERROR"};
	int iMsg = -1;
	bool res = false;
	for (int i = 0; i < 4; i++)
	{
		if (msg[i] == level)
		{
			iMsg = i;
			res = true;
			break;
		}
	}
	switch (res)
	{
	case true:
		for (int i = iMsg; i < 4; i++)
		{
			std::cout << "[" << msg[i] << "]" << std::endl;
			(this->*func[i])();
		}
		break;

	default:
		std::cout << "[ Probably complaining about insignificant problems ]" << std::endl;
		break;
	}
}

void Harl::debug(void)
{
	std::cout << "I love having extra bacon for my 7XL-double-cheese-triple-pickle-special-ketchup burger. I really do!\n";
}

void Harl::info(void)
{
	std::cout << "I cannot believe adding extra bacon costs more money. You didn’t put enough bacon in my burger! If you did, I wouldn’t be asking for more!\n";
}

void Harl::warning(void)
{
	std::cout << "I think I deserve to have some extra bacon for free. I’ve been coming foryears, whereas you started working here just last month.\n";
}

void Harl::error(void)
{
	std::cout << "This is unacceptable! I want to speak to the manager now.\n";
}
