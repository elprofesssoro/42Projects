
/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Serializer.cpp                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-06-10 13:39:45 by idvinov           #+#    #+#             */
/*   Updated: 2025-06-10 13:39:45 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Data.hpp"
#include "Serializer.hpp"

Serializer::Serializer()
{
	std::cout << "Constructor in Serializer" << std::endl;
}

Serializer::Serializer(const Serializer &instance)
{
	std::cout << "Copy constructor in Serializer" << std::endl;
	*this = instance;
}

Serializer &Serializer::operator=(const Serializer &instance)
{
	std::cout << "Assignemnt operator in Serializer" << std::endl;
	if (this == &instance)
	{
		return *this;
	}
	return *this;
}

Serializer::~Serializer()
{
	std::cout << "Destructor in Serializer" << std::endl;
}

uintptr_t Serializer::Serialize(Data *ptr)
{
	return (reinterpret_cast<uintptr_t>(ptr));
}

Data *Serializer::Deserialize(uintptr_t raw)
{
	return (reinterpret_cast<Data *>(raw));
}