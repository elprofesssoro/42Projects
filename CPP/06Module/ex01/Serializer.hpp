/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Serializer.hpp                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-06-10 12:55:35 by idvinov           #+#    #+#             */
/*   Updated: 2025-06-10 12:55:35 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef S_HPP
#define S_HPP

#include <iostream>
#include "Data.hpp"
#include <stdint.h>

class Serializer
{
private:
public:
	Serializer();
	Serializer(const Serializer &instance);
	Serializer &operator=(const Serializer &instance);
	~Serializer();
	static uintptr_t Serialize(Data *ptr);
	static Data *Deserialize(uintptr_t raw);
};

#endif