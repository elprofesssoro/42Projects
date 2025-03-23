/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-13 13:51:09 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-13 13:51:09 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include<iostream>

int main(void)
{
	std::string str = "HI THIS IS BRAIN"; 
	std::string *pStr = &str;
	std::string &rStr = str;

	std::cout << "Adress of string variable: " << &str << std::endl;
	std::cout << "Adress of string pointer: " << pStr << std::endl;
	std::cout << "Adress of string reference: " << &rStr << std::endl;

	std::cout << "\nValue of string variable: " << str << std::endl;
	std::cout << "Value of string pointer: " << *pStr << std::endl;
	std::cout << "Value of string reference: " << rStr << std::endl;
}