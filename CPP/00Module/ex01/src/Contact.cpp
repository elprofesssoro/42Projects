/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Contact.cpp                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-07 12:45:02 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-07 12:45:02 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../inc/Contact.hpp"
Contact::Contact() : name(""), surname(""), pNum("")
{
}

Contact::Contact(std::string n, std::string s, std::string p) : name(n),
																surname(s),
																pNum(p)
{
}

std::string Contact::getName()
{
	return name;
}

void Contact::setName(std::string name)
{
	this->name = name;
}

std::string Contact::getSurname()
{
	return surname;
}

void Contact::setSurname(std::string surname)
{
	this->surname = surname;
}

void Contact::setNickname(std::string nickname)
{
	this->nickname = nickname;
}

std::string Contact::getNickname()
{
	return nickname;
}

std::string Contact::getPnum()
{
	return pNum;
}

void Contact::setPnum(std::string pNum)
{
	this->pNum = pNum;
}

void Contact::setSecret(std::string secret)
{
	this->secret = secret;
}

std::string Contact::getSecret()
{
	return secret;
}