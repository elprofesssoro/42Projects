/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-07 12:45:14 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-07 12:45:14 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../inc/PhoneBook.hpp"
#include<iostream>

int main(void)
{
	PhoneBook p;
	bool exit = false;
	std::string str;
	while(!exit)
	{
		std::cout << "Enter command > ";
		std::getline(std::cin, str);
		if(std::cin.eof())
			exit = true;
		else if(!str.compare("ADD"))
			p.Add(&exit);
		else if(!str.compare("SEARCH"))
			p.Search(&exit);
		else if(!str.compare("EXIT"))
			exit = true;
		str.clear();
	}
}