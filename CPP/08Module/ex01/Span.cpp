/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Span.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-06-12 12:45:39 by idvinov           #+#    #+#             */
/*   Updated: 2025-06-12 12:45:39 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Span.hpp"

Span::Span() : n(0)
{
	std::cout << "Default constructor in Span" << std::endl;
	v.reserve(n);
}

Span::Span(int n) : n(n)
{
	std::cout << "Constructor with params in Span" << std::endl;
	std::vector<int> newVector(n);
	v.reserve(n);
}

Span::Span(const Span &instance) : n(instance.n)
{
	std::cout << "Copy constructor in Span" << std::endl;
	v.reserve(n);
	std::copy(instance.v.begin(), instance.v.end(), v.begin());
}

Span &Span::operator=(const Span &span)
{
	if (this == &span)
		return *this;
	std::cout << "Assignemnt operator in Span" << std::endl;
	v.reserve(n);
	std::copy(span.v.begin(), span.v.end(), v.begin());
	return *this;
}

Span::~Span()
{
	std::cout << "Destructor in Span" << std::endl;
	v.clear();
}

void Span::AddNumber(int num)
{
	if (v.size() > n)
		throw OutOfRangeException();

	v.push_back(num);
}

int Span::ShortestSpan()
{
	if (v.size() <= 1)
		throw EmptyContainerException();

	std::vector<int> newVector(v.begin(), v.end());
	std::sort(newVector.begin(), newVector.end());
	int s = newVector[1] - newVector[0];
	if (s < 0)
		s *= -1;
	for (size_t i = 2; i < newVector.size(); i++)
	{
		int s1 = newVector[i] - newVector[i - 1];
		if (s1 < 0)
			s1 *= -1;
		if (s1 < s)
			s = s1;
	}
	return s;
}

int Span::LongestSpan()
{
	if (v.size() <= 1)
		throw EmptyContainerException();

	return *std::max_element(v.begin(), v.end()) - *std::min_element(v.begin(), v.end());
}

const char* Span::OutOfRangeException::what() const throw()
{
	return "OutOfRangeException: Out of Container's range";
}

const char* Span::EmptyContainerException::what() const throw()
{
	return "EmptyContainerException: Container is empty";
}