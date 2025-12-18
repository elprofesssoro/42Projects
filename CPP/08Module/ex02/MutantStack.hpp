/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Span.hpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-06-12 12:45:44 by idvinov           #+#    #+#             */
/*   Updated: 2025-06-12 12:45:44 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
#include <iostream>
#include <stack>
#include <cstddef>

template <typename T>
class MutantStack : public std::stack<T>
{
	typedef std::stack<T> stack;
	typedef typename stack::container_type container;

public:
	typedef typename container::iterator iterator;

	MutantStack() : stack()
	{
		std::cout << "Default constructor in MutantStack" << std::endl;
	}

	MutantStack(const MutantStack &instance) : stack(instance)
	{
		std::cout << "Copy constructor in MutantStack" << std::endl;
	}

	MutantStack &operator=(const MutantStack &instance)
	{
		if (*this != instance)
			stack::operator=(instance);
		return *this;
	}

	~MutantStack()
	{
		std::cout << "Default destructor in MutantStack" << std::endl;
	}

	iterator begin()
	{
		return stack::c.begin();
	}

	iterator end()
	{
		return stack::c.end();
	}
};