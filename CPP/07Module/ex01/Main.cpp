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

#include <iostream>
#include "Iter.hpp"

void IntFunc(const int i)
{
	std::cout << i << " ";
}

void StringFunc(std::string &str)
{
	str = "Gar\n";
}

int main(void)
{
	int arr1[5];
	for (int i = 0; i < 5; i++)
		arr1[i] = i + 10;

	std::string arr2[5];
	for (int i = 0; i < 5; i++)
		arr2[i] = "Hello " + i;

	Iter(arr1, 5, IntFunc);
	std::cout << std::endl;
	Iter(arr2, 5, StringFunc);
	for (int i = 0; i < 5; i++)
		std::cout << arr2[i];
}
