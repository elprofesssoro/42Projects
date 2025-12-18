/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-06-11 11:08:50 by idvinov           #+#    #+#             */
/*   Updated: 2025-06-11 11:08:50 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


#include <cstdlib>
#include <iostream>
#include "Array.hpp"

int main(void)
{
	int MAX_VAL = 15;

	Array<int> numbers(MAX_VAL);
	int *mirror = new int[MAX_VAL];
	srand(time(NULL));

	for (int i = 0; i < MAX_VAL; i++)
	{
		const int value = rand();
		numbers[i] = value;
		mirror[i] = value;
	}

	// SCOPE
	{

		Array<int> tmp;
		try
		{
			for (int i = 0; i < MAX_VAL + 1; i++)
				std::cout << "tmp[" << i << "]:\t" << tmp[i] << std::endl;
		}
		catch (const std::exception &e)
		{
			std::cerr << e.what() << '\t';
			std::cerr << "You tried to access past the last element of the array" << std::endl;
		}
		tmp = numbers;
		Array<int> test(tmp);
		try
		{
			for (int i = 0; i < MAX_VAL + 1; i++)
			{
				if (tmp[i] != test[i])
				{
					std::cerr << "didn't save the same value!!" << std::endl;
					return 1;
				}
				// std::cout << "tmp[" << i << "]:\t" << tmp[i] << std::endl;
				// std::cout << "test[" << i << "]:\t" << test[i] << std::endl;
			}
		}
		catch (const std::exception &e)
		{
			std::cerr << e.what() << '\t';
			std::cerr << "You tried to access past the last element of the array" << std::endl;
		}

		std::cout << std::endl
				  << "test[1]:\t" << test[1] << std::endl;
		std::cout << "tmp[1]:\t\t" << tmp[1] << std::endl
				  << std::endl;

		test[1] = 123456789;

		std::cout << "test[1]:\t" << test[1] << std::endl;
		std::cout << "tmp[1]:\t\t" << tmp[1] << std::endl
				  << std::endl;
	}


	for (int i = 0; i < MAX_VAL; i++)
	{
		if (mirror[i] != numbers[i])
		{
			std::cerr << "didn't save the same value!!" << std::endl;
			return 1;
		}
	}
	try
	{
		numbers[-2] = 0;
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << '\n';
		std::cout << "index was -2" << std::endl;
	}
	try
	{
		numbers[MAX_VAL] = 0;
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << '\n';
		std::cout << "tried to access past the last element of the array" << std::endl;
	}

	for (int i = 0; i < MAX_VAL; i++)
	{
		numbers[i] = rand();
	}

	delete[] mirror; 
	return 0;
}
