/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Array.hpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-06-11 12:01:02 by idvinov           #+#    #+#             */
/*   Updated: 2025-06-11 12:01:02 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef ARR_HPP
#define ARR_HPP

#include <iostream>

template <typename T>
class Array
{
private:
	T *arr;
	unsigned int size;

public:
	Array()
	{
		std::cout << "Default constructor in Array" << std::endl;
		size = 0;
		arr = new T[size];
	}

	Array(unsigned int n)
	{
		std::cout << "Constructor with params in Array" << std::endl;
		arr = new T[n];
		size = n;
	}

	Array(const Array &instance)
	{
		std::cout << "Copy constructor in Array" << std::endl;
		if (instance.size)
		{
			size = instance.size;
			arr = new T[size];
			for (unsigned int i = 0; i < size; i++)
				arr[i] = instance.arr[i];
		}
	}

	Array &operator=(const Array &instance)
	{
		std::cout << "Assignment operator in Array" << std::endl;
		if (this == &instance)
			return *this;

		if (arr != NULL)
			delete[] arr;

		if (instance.size)
		{
			size = instance.size;
			arr = new T[size];
			for (unsigned int i = 0; i < size; i++)
				arr[i] = instance.arr[i];
		}
		return *this;
	}

	~Array()
	{
		std::cout << "Default destructor in Array" << std::endl;
		if (arr != NULL)
			delete[] arr;
	}

	T &operator[](int index)
	{
		if (index < 0 || index >= (int)size || !arr)
			throw std::exception();

		return arr[index];
	}

	unsigned int Size()
	{
		return size;
	}
};
#endif