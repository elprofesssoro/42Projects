/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Fixed.cpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-14 15:20:52 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-14 15:20:52 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Fixed.hpp"
#include <cmath>

Fixed::Fixed()
{
	value = 0;
	std::cout << "Default constructor called" << std::endl;
}

Fixed::Fixed(const Fixed &instance)
{
	std::cout << "Copy constructor called" << std::endl;
	*this = instance;
}

Fixed::Fixed(const int value)
{
	setRawBits(value << bits);
	std::cout << "Int constructor called;" << std::endl;
}

Fixed::Fixed(const float value)
{
	setRawBits((int)roundf(value * (1 << bits)));
	std::cout << "Float constructor called;" << std::endl;
}

Fixed &Fixed::operator=(const Fixed&instance)
{
	std::cout << "Copy assignment operator called" << std::endl;
	if(this != &instance)
	{
		value = instance.getRawBits();
	}
	return *this;
}

Fixed::~Fixed()
{
	std::cout << "Destructor is called" << std::endl;
}

int Fixed::getRawBits(void) const
{
	return value;
}

void Fixed::setRawBits(int const raw)
{
	value = raw;
}

float Fixed::toFloat(void) const
{
	return (float)value / (1 << bits);
}
int Fixed::toInt(void) const
{
	return value >> bits;
}

std::ostream &operator<<(std::ostream &o, Fixed const &number)
{
	o << number.toFloat();
	return o;
}

