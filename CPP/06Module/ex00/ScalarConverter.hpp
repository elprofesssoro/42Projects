/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ScalarConverter.hpp                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-05-29 12:06:04 by idvinov           #+#    #+#             */
/*   Updated: 2025-05-29 12:06:04 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef SCV_HPP
#define SCV_HPP

#include <iostream>
#include <sstream>
#include <string>
#include <cstdlib>
#include <limits.h>

class ScalarConverter
{
public:
	ScalarConverter();
	ScalarConverter(const ScalarConverter &instance);
	ScalarConverter &operator=(const ScalarConverter &instance);
	~ScalarConverter();
	static void Convert(std::string literal);
	enum LType
	{
		NOT_TYPE = 0,
		CHAR_TYPE = 1,
		INT_TYPE = 2,
		FLOAT_TYPE = 3,
		DOUBLE_TYPE = 4,
	};

private:
	template <typename T>
	struct Tuple
	{
		T value;
		bool exists;
		Tuple()
		{
			exists = false;
		}
		void WriteValue(T value)
		{
			this->value = value;
			exists = true;
		}
	};

	static LType CheckType(std::string literal);
	static bool CheckInt(std::string literal);
	static bool CheckFloat(std::string literal);
	static bool CheckDouble(std::string literal);
	static double ConvertD(std::string literal);
	static void PrintInt(Tuple<int> &t);
	static void PrintChar(Tuple<char> &c);
	static void PrintFloat(Tuple<float> &f, std::string &literal);
	static void PrintDouble(Tuple<double> &d, std::string &literal);
};

#endif