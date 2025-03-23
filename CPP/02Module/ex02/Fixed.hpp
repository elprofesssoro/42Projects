/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Fixed.hpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-14 15:16:50 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-14 15:16:50 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef FIXED_HPP
#define FIXED_HPP

#include <iostream>
#include <fstream>

class Fixed
{
private:
	int value;
	static const int bits = 8;
public:
	Fixed();
	Fixed(const Fixed &instance);
	Fixed(const int value);
	Fixed(const float value);
	Fixed &operator=(const Fixed&instance);
	~Fixed();
	float	toFloat(void) const;
	int 	toInt(void) const;
	int 	getRawBits(void) const;
	void 	setRawBits(int const raw);
	Fixed 	operator+(Fixed const &inst) const;
	Fixed 	operator-(Fixed const &inst) const;
	Fixed 	operator*(Fixed const &inst) const;
	Fixed 	operator/(Fixed const &inst) const;
	bool	operator>(Fixed const &inst) const;
	bool	operator<(Fixed const &inst) const;
	bool	operator>=(Fixed const &inst) const;
	bool	operator<=(Fixed const &inst) const;
	bool	operator==(Fixed const &inst) const;
	bool	operator!=(Fixed const &inst) const;
	Fixed 	&operator++();
	Fixed 	operator++(int);
	Fixed	&operator--();
	Fixed	operator--(int);
	static Fixed & min(Fixed & a, Fixed & b );
	static Fixed & max(Fixed & a, Fixed & b );
	static const Fixed & min(const Fixed & a, const Fixed & b );
	static const Fixed & max(const Fixed & a, const Fixed & b );
};

std::ostream &operator<<(std::ostream &o, Fixed const &number);

#endif