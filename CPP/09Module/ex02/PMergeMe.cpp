/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PMergeMe.cpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-11-14 12:58:58 by idvinov           #+#    #+#             */
/*   Updated: 2025-11-14 12:58:58 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "PMergeMe.hpp"

int Jacobsthal(int n)
{
	return round((pow(2, n + 1) + pow(-1, n)) / 3);
}

PMergeMe::PMergeMe() {}

PMergeMe::PMergeMe(const PMergeMe &other)
{
	*this = other;
}

PMergeMe &PMergeMe::operator=(const PMergeMe &other)
{
	if (this != &other)
	{
	}
	return *this;
}

PMergeMe::~PMergeMe() {}
