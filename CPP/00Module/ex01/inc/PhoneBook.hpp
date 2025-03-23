/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PhoneBook.hpp                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-07 12:45:25 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-07 12:45:25 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Contact.hpp"

class PhoneBook
{
public:
	PhoneBook();
	void Add(bool *exit);
	void Search(bool *exit);

private:
	int			count;
	Contact		contacts[8];
	std::string	FillContact(std::string message, bool *exit);
	void		PrintContact();
	void		PrintField(std::string str);
	bool		isNumber(std::string str);
	bool		IsEmpty(std::string str);
};