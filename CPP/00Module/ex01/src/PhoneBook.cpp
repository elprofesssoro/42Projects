/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PhoneBook.cpp                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-07 12:45:21 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-07 12:45:21 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../inc/PhoneBook.hpp"
#include <sstream>
#include <iostream>
#include <cstdlib>

PhoneBook::PhoneBook()
{
	count = 0;
}

void PhoneBook::Add(bool *exit)
{
	Contact contact;
	std::string temp;
	contact.setName(FillContact("Type Name: ", exit));
	if (*exit)
		return;
	contact.setSurname(FillContact("Type Last Name: ", exit));
	if (*exit)
		return;
	contact.setPnum(FillContact("Type Phone Number: ", exit));
	if (*exit)
		return;
	contact.setNickname(FillContact("Type Nickname: ", exit));
	if (*exit)
		return;
	contact.setSecret(FillContact("Type secret: ", exit));
	if (*exit)
		return;
	contacts[count % 8] = contact;
	count++;
}

void PhoneBook::Search(bool *exit)
{
	std::cout << " ------------------------------------------- \n";
	std::cout << "|     Index|First Name| Last Name|  Nickname|\n";
	std::cout << "|-------------------------------------------|\n";
	PrintContact();
	std::cout << " ------------------------------------------- \n";
	std::cout << "Select index: ";
	int index = -1;
	std::string temp;
	std::getline(std::cin, temp);
	if (std::cin.eof())
	{
		*exit = true;
		return;
	}
	if (!isNumber(temp))
	{
		std::cout << "Invalid index. Try again!\n";
		return;
	}
	index = std::atoi(temp.c_str());
	if ((!index || index > 7) || contacts[--index].getName().empty())
	{
		std::cout << "Invalid index. Try again!\n";
		return;
	}
	std::cout << "First Name: " << contacts[index].getName() << '\n';
	std::cout << "Last Name: " << contacts[index].getSurname() << '\n';
	std::cout << "Nickname: " << contacts[index].getNickname() << '\n';
	std::cout << "Phone Number: " << contacts[index].getPnum() << '\n';
	std::cout << "Secret: " << contacts[index].getSecret() << '\n';
}

std::string PhoneBook::FillContact(std::string message, bool *exit)
{
	std::string temp;

	std::cout << message;
	std::getline(std::cin, temp);
	if (std::cin.eof())
	{
		*exit = true;
		temp.clear();
	}
	else if(IsEmpty(temp))
	{
		std::cout << "Empty string. Try again: \n";
		temp = FillContact(message, exit);
	}
	return temp;
}

void PhoneBook::PrintContact()
{

	for (int i = 0; i < 8; i++)
	{
		if (contacts[i].getName().empty())
			break;
		std::cout << "|";
		std::stringstream ss;
		std::string str;
		ss << i + 1;
		str = ss.str();
		PrintField(str);
		PrintField(contacts[i].getName());
		PrintField(contacts[i].getSurname());
		PrintField(contacts[i].getNickname());
		std::cout << "\n";
		ss.clear();
		str.clear();
	}
}

void PhoneBook::PrintField(std::string str)
{
	int space = 10 - str.length();
	for (int i = 0; i < space; i++)
		std::cout << " ";
	for (std::size_t i = 0; i < str.length(); i++)
	{
		if (i >= 9 && str.length() > 10)
		{
			std::cout << ".";
			break;
		}
		std::cout << str[i];
	}
	std::cout << "|";
}

bool PhoneBook::isNumber(std::string str)
{
	if (str.empty())
		return (false);
	for (size_t i = 0; i < str.length(); i++)
	{
		if (!std::isdigit(str[i]))
		{
			return (false);
		}
	}
	return (true);
}

bool PhoneBook::IsEmpty(std::string str)
{
	for(size_t i = 0; i < str.length(); i++)
	{
		if(str[i] != ' ')
			return false;
	}
	return true;
}
