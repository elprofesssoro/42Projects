/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ScalarConverter.cpp                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-05-29 12:13:45 by idvinov           #+#    #+#             */
/*   Updated: 2025-05-29 12:13:45 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ScalarConverter.hpp"

ScalarConverter::ScalarConverter()
{
	std::cout << "Default constructor in ScalarConverter" << std::endl;
}

ScalarConverter::ScalarConverter(const ScalarConverter &instance)
{
	std::cout << "Copy constructor in ScalarConverter" << std::endl;
	(void)instance;
}

ScalarConverter &ScalarConverter::operator=(const ScalarConverter &instance)
{
	std::cout << "Assignment operator in ScalarConverter" << std::endl;
	if (this == &instance)
		return *this;
	return *this;
}

ScalarConverter::~ScalarConverter()
{
	std::cout << "Destructor in ScalarConverter" << std::endl;
}

void ScalarConverter::Convert(std::string literal)
{
	Tuple<int> it;
	Tuple<char> ct;
	Tuple<float> ft;
	Tuple<double> dt;
	double d = ConvertD(literal);
	switch (CheckType(literal))
	{
	case CHAR_TYPE:
	{
		ct.WriteValue(literal[0]);
		it.WriteValue(static_cast<int>(ct.value));
		ft.WriteValue(static_cast<float>(ct.value));
		dt.WriteValue(static_cast<double>(ct.value));
		break;
	}
	case INT_TYPE:
		if (d <= INT_MAX && d >= INT_MIN)
			it.WriteValue(static_cast<int>(d));

		if (it.exists && it.value <= 127)
			ct.WriteValue(static_cast<char>(it.value));

		ft.WriteValue(static_cast<float>(d));
		dt.WriteValue(static_cast<double>(d));
		break;
	case FLOAT_TYPE:
		ft.WriteValue(static_cast<float>(d));
		if (d <= INT_MAX && d >= INT_MIN)
			it.WriteValue(static_cast<int>(ft.value));
		if (ft.exists && ft.value <= 127)
			ct.WriteValue(static_cast<char>(ft.value));
		if (ft.value - it.value != 0)
			ct.exists = false;
		dt.WriteValue(static_cast<double>(ft.value));
		break;
	case DOUBLE_TYPE:
		dt.WriteValue(d);
		if (d <= INT_MAX && d >= INT_MIN)
			it.WriteValue(static_cast<int>(dt.value));
		if (dt.exists && dt.value <= 127)
			ct.WriteValue(static_cast<char>(dt.value));
		if (dt.value - it.value != 0)
			ct.exists = false;

		ft.WriteValue(static_cast<float>(dt.value));
		break;
	default:
		break;
	}
	PrintChar(ct);
	PrintInt(it);
	PrintFloat(ft, literal);
	PrintDouble(dt, literal);
}

ScalarConverter::LType ScalarConverter::CheckType(std::string literal)
{
	if (literal[0] && !literal[1] && !isdigit(literal[0]))
		return CHAR_TYPE;
	else if (CheckInt(literal))
		return INT_TYPE;
	else if (CheckFloat(literal))
		return FLOAT_TYPE;
	else if (CheckDouble(literal))
		return DOUBLE_TYPE;

	return NOT_TYPE;
}

double ScalarConverter::ConvertD(std::string literal)
{

	double d = atof(literal.c_str());

	return d;
}

bool ScalarConverter::CheckInt(std::string literal)
{
	std::size_t i = 0;
	if (literal[i] == '-')
		i++;
	for (i = i; i < literal.length(); i++)
	{
		if (!isdigit(literal[i]))
			return false;
	}
	return true;
}

bool ScalarConverter::CheckFloat(std::string literal)
{
	bool isComma = false;
	bool result = false;

	std::size_t i = 0;
	if (literal[i] == '-')
		i++;
	for (i = i; i < literal.length(); i++)
	{
		if (!isdigit(literal[i]))
		{
			if (literal[i] == '.')
			{
				if (!literal[i + 1] || !isdigit(literal[i + 1]))
					return false;

				if (!isComma && i != 0)
					isComma = true;
				else
					return false;
			}
			else if (literal[i] == 'f')
			{
				if (literal[i + 1])
					return false;
				else if (isdigit(literal[i - 1]))
					result = true;
			}
			else
				return false;
		}
	}
	return result;
}

bool ScalarConverter::CheckDouble(std::string literal)
{
	bool isComma = false;

	std::size_t i = 0;
	if (literal[i] == '-')
		i++;
	for (i = i; i < literal.length(); i++)
	{
		if (!isdigit(literal[i]))
		{
			if (literal[i] == '.')
			{
				if (!literal[i + 1] || !isdigit(literal[i + 1]))
					return false;
				if (!isComma && i != 0)
					isComma = true;
				else
					return false;
			}
			else
				return false;
		}
	}
	return true;
}

void ScalarConverter::PrintChar(Tuple<char> &c)
{
	std::cout << "char: ";
	if (c.value < 0 || !c.exists)
	{
		std::cout << "Impossible" << std::endl;
	}
	else if (c.value < 31)
		std::cout << "Non displayable" << std::endl;
	else
		std::cout << "'" << c.value << "'" << std::endl;
}

void ScalarConverter::PrintInt(Tuple<int> &t)
{
	std::cout << "int: ";
	if (!t.exists)
		std::cout << "Impossible" << std::endl;
	else
		std::cout << t.value << std::endl;
}

void ScalarConverter::PrintFloat(Tuple<float> &f, std::string &literal)
{
	std::cout << "float: ";
	if (!literal.compare("-inf") || !literal.compare("-inff"))
		std::cout << "-inff" << std::endl;
	else if (!literal.compare("+inf") || !literal.compare("+inff"))
		std::cout << "+inff" << std::endl;
	else if (!literal.compare("nan"))
		std::cout << "nanf" << std::endl;
	else if (!f.exists)
	{
		std::cout << "Impossible" << std::endl;
		return;
	}
	else
	{
		if (f.value - static_cast<int>(f.value) == 0)
			std::cout << f.value << ".0f" << std::endl;
		else
			std::cout << f.value << "f" << std::endl;
	}
}

void ScalarConverter::PrintDouble(Tuple<double> &f, std::string &literal)
{
	std::cout << "double: ";
	if (!literal.compare("-inf") || !literal.compare("-inff"))
		std::cout << "-inf" << std::endl;
	else if (!literal.compare("+inf") || !literal.compare("+inff"))
		std::cout << "+inf" << std::endl;
	else if (!literal.compare("nan") || !literal.compare("nanf"))
		std::cout << "nan" << std::endl;
	else if (!f.exists)
		std::cout << "Impossible" << std::endl;
	else
	{
		if (f.value - static_cast<int>(f.value) == 0)
			std::cout << f.value << ".0" << std::endl;
		else
			std::cout << f.value << std::endl;
	}
}
