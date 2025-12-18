/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-06-12 11:10:14 by idvinov           #+#    #+#             */
/*   Updated: 2025-06-12 11:10:14 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Easyfind.hpp"
#include <iostream>
#include <vector>

int main()
{

	std::vector<int> test;
	test.push_back(155);
	test.push_back(156);
	test.push_back(157);

	std::vector<int>::iterator	it = test.end();

	try
	{
		it = Easyfind(test, 157);
	}
	catch(const std::exception& e)
	{
		std::cerr << e.what() << std::endl;
	}

	if (it != test.end())
		std::cout << *it << " found" << std::endl;

	it = test.end();

	try
	{
		it = Easyfind(test, 15);
	}
	catch(const std::exception& e)
	{
		std::cerr << e.what() << std::endl;
	}

	if (it != test.end())
		std::cout << *it << " found" << std::endl;

	return (0);
}