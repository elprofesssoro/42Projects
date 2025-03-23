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
}

Fixed::Fixed(const Fixed &instance)
{
	*this = instance;
}

Fixed::Fixed(const int value)
{
	setRawBits(value << bits);
}

Fixed::Fixed(const float value)
{
	setRawBits((int)roundf(value * (1 << bits)));
}

Fixed &Fixed::operator=(const Fixed &instance)
{
	if (this != &instance)
	{
		value = instance.getRawBits();
	}
	return *this;
}

Fixed::~Fixed()
{
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

Fixed Fixed::operator+(Fixed const &inst) const
{
	return Fixed(this->toFloat() + inst.toFloat());
}

Fixed Fixed::operator-(Fixed const &inst) const
{
	return (Fixed(this->toFloat() - inst.toFloat()));
}

Fixed Fixed::operator*(Fixed const &inst) const
{
	return (Fixed(this->toFloat() * inst.toFloat()));
}

Fixed Fixed::operator/(Fixed const &inst) const
{
	return Fixed(this->toFloat() / inst.toFloat());
}

bool Fixed::operator>(Fixed const &inst) const
{
	return value > inst.getRawBits();
}

bool Fixed::operator<(Fixed const &inst) const
{
	return value < inst.getRawBits();
}

bool Fixed::operator>=(Fixed const &inst) const
{
	return value >= inst.getRawBits();
}

bool Fixed::operator<=(Fixed const &inst) const
{
	return value <= inst.getRawBits();
}

bool Fixed::operator==(Fixed const &inst) const
{
	return value == inst.getRawBits();
}

bool Fixed::operator!=(Fixed const &inst) const
{
	return value != inst.getRawBits();
}

Fixed &Fixed::operator++() 
{
	value += 1;
	return *this;
}
Fixed Fixed::operator++(int) 
{
	Fixed temp = *this;
	value += 1;
	return temp;
}
Fixed &Fixed::operator--() 
{
	value -= 1;
	return *this;
}
Fixed Fixed::operator--(int) 
{
	Fixed temp = *this;
	value -= 1;
	return temp;
}

Fixed &Fixed::min(Fixed &a, Fixed &b) 
{
	return a < b ? a : b;
}
const Fixed &Fixed::min(const Fixed &a, const Fixed &b) 
{
	return a < b ? a : b;
}

const Fixed &Fixed::max(const Fixed &a, const Fixed &b) 
{
	return a > b ? a : b;
}

Fixed &Fixed::max(Fixed &a, Fixed &b) 
{
	return a > b ? a : b;
}

std::ostream &operator<<(std::ostream &o, Fixed const &number)
{
	o << number.toFloat();
	return o;
}
