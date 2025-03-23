/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Contact.hpp                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-07 12:45:08 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-07 12:45:08 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef CONTACT_H
#define CONTACT_H

#include <string>

class Contact
{
private:
	std::string name;
	std::string surname;
	std::string nickname;
	std::string pNum;
	std::string secret;

public:
	Contact();
	Contact(std::string name, std::string surname, std::string pNum);
	std::string getName();
	void setName(std::string name);
	std::string getSurname();
	void setSurname(std::string surname);
	void setNickname(std::string nickname);
	std::string getNickname();
	void setPnum(std::string pNum);
	std::string getPnum();
	void setSecret(std::string secret);
	std::string getSecret();
};

#endif