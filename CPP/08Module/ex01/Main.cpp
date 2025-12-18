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

#include "Span.hpp"
#include <iostream>
#include <vector>
#include <time.h>

int main()
{
	srand(time(NULL));
	std::cout << "TEST 1" << std::endl;
	{
		int n = 10000;
		Span sp = Span(n);

		std::vector<int> nums;
		for (int i = 0; i < n; i++)
		{
			nums.push_back(rand() % 10000000000000 + 1);
			// std::cout << nums[i] << " ";
		}
		// std::cout << std::endl;
		sp.AddNumbers(nums.begin(), nums.end());
		std::cout << sp.ShortestSpan() << std::endl;
		std::cout << sp.LongestSpan() << std::endl;
	}

	std::cout << std::endl
			  << "TEST 2 (error)" << std::endl;
	{
		int n = 10000;
		Span sp = Span(n);

		std::vector<int> nums;
		for (int i = 0; i < n * 100; i++)
		{
			nums.push_back(rand() % 10000000000000 + 1);
			// std::cout << nums[i] << " ";
		}
		std::cout << std::endl;
		try
		{
			sp.AddNumbers(nums.begin(), nums.end());
			std::cout << sp.ShortestSpan() << std::endl;
			std::cout << sp.LongestSpan() << std::endl;
		}
		catch (const std::exception &e)
		{
			std::cerr << e.what() << std::endl;
		}
	}

	std::cout << std::endl
			  << "TEST 3 (error)" << std::endl;
	{
		int n = 10000;
		Span sp = Span(n);
		try
		{
			std::cout << sp.ShortestSpan() << std::endl;
			std::cout << sp.LongestSpan() << std::endl;
		}
		catch (const std::exception &e)
		{
			std::cerr << e.what() << std::endl;
		}
	}

	std::cout << std::endl << "TEST 4" << std::endl;
	{
		Span sp = Span(5);
		sp.AddNumber(6);
		sp.AddNumber(3);
		sp.AddNumber(17);
		sp.AddNumber(9);
		sp.AddNumber(11);
		std::cout << sp.ShortestSpan() << std::endl;
		std::cout << sp.LongestSpan() << std::endl;
	}
}