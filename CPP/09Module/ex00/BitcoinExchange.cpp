/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   BitcoinExchange.cpp                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-11-07 12:16:57 by idvinov           #+#    #+#             */
/*   Updated: 2025-11-07 12:16:57 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "BitcoinExchange.hpp"

BitcoinExchange::BitcoinExchange()
{
	_databaseName = "data/data.csv";
}

BitcoinExchange::~BitcoinExchange()
{
}

BitcoinExchange::BitcoinExchange(const BitcoinExchange &other)
{
	_data = other._data;
	_databaseName = other._databaseName;
}

BitcoinExchange &BitcoinExchange::operator=(const BitcoinExchange &other)
{
	if (this != &other)
	{
		_data = other._data;
		_databaseName = other._databaseName;
	}
	return *this;
}

void BitcoinExchange::Exchange(const std::string &filename)
{
	try
	{
		ParseFile(_databaseName);
	}
	catch (const std::exception &e)
	{
		std::cerr << e.what() << '\n';
		return;
	}
	std::cout << "----- Database was parsed -----" << std::endl;
	std::ifstream file;
	file.open(filename.c_str());
	if (!file.is_open())
	{
		throw Exception("Error: Could not open database file.");
	}
	std::string line;
	unsigned long lineNumber = 1;
	std::getline(file, line);
	while (std::getline(file, line))
	{
		++lineNumber;
		std::string date;
		float value;
		DateValue dv;
		if (line.empty())
			continue;

		try
		{
			size_t pipePos = line.find('|');
			if (pipePos == std::string::npos)
				throw Exception("Error: bad input => " + line);
			date = line.substr(0, pipePos);
			ValidDate(date);
			std::string valueStr = line.substr(pipePos + 1);
			ValidInputValue(valueStr);
			dv = StrToDate(date);
			value = std::atof(valueStr.c_str());
		}
		catch (const std::exception &e)
		{
			std::cerr << e.what() << '\n';
			continue;
		}
		float dbValue = GetValueForDate(dv);
		if (dbValue == -1)
			continue;

		std::cout << date << " => " << value << " = " << value * dbValue << std::endl;
	}
	file.close();
}

void BitcoinExchange::ParseFile(const std::string &filename)
{
	std::ifstream file;
	file.open(filename.c_str());
	if (!file.is_open())
	{
		throw Exception("Error: Could not open database file.");
	}
	std::string line;
	unsigned long lineNumber = 1;
	std::getline(file, line);
	while (std::getline(file, line))
	{
		++lineNumber;
		std::string date;
		float value;
		if (line.empty())
			continue;
		size_t commaPos = line.find(',');
		if (commaPos == std::string::npos)
			throw Exception("Error: bad input => " + line);
		date = line.substr(0, commaPos);
		ValidDate(date);
		std::string valueStr = line.substr(commaPos + 1);
		ValidDatabaseValue(valueStr);
		value = std::atof(valueStr.c_str());
		_data[date] = value;
		_dataValues[StrToDate(date)] = value;
	}
	file.close();
}

void BitcoinExchange::ValidDate(const std::string &date)
{
	size_t dash = date.find('-');
	double num;
	if (dash == std::string::npos)
		throw Exception("Error: bad input => " + date);
	std::string yearStr = date.substr(0, dash);
	if (yearStr.empty() || yearStr.find_first_not_of(" \t0123456789") != std::string::npos)
		throw Exception("Error: bad input => " + date);
	num = std::atof(yearStr.c_str());
	if (num < 2000)
		throw Exception("Error: bad input => " + date);
	dash = date.find('-', dash);
	size_t dash1 = date.find('-', dash + 1);
	if (dash == std::string::npos || dash1 == std::string::npos)
		throw Exception("Error: bad input => " + date);
	std::string monthStr = date.substr(dash + 1, dash1 - dash - 1);
	if (monthStr.empty() || monthStr.find_first_not_of(" \t0123456789") != std::string::npos)
		throw Exception("Error: bad input => " + date);
	num = std::atof(monthStr.c_str());
	if (num < 1 || num > 12)
		throw Exception("Error: bad input => " + date);
	if (dash1 == std::string::npos)
		throw Exception("Error: bad input => " + date);
	std::string dayStr = date.substr(dash1 + 1);
	if (dayStr.empty() || dayStr.find_first_not_of(" \t0123456789") != std::string::npos)
		throw Exception("Error: bad input => " + date);
	num = std::atof(dayStr.c_str());
	if (num < 1 || num > 31)
		throw Exception("Error: bad input => " + date);
}

void BitcoinExchange::ValidInputValue(const std::string &value)
{
	if (value.empty())
		throw Exception("Error: empty value in database.");
	if (value.find_first_not_of(" \t0123456789.-") != std::string::npos)
		throw Exception("Error1: bad input => " + value);
	double num = std::atof(value.c_str());
	if (num < 0)
		throw Exception("Error: not a positive number.");
	else if (num > 1000)
		throw Exception("Error: too large a number.");
}

void BitcoinExchange::ValidDatabaseValue(const std::string &value)
{
	if (value.empty())
		throw Exception("Error: empty value in database.");
	size_t i = 0;
	if (value.find_first_not_of("0123456789.-", i) != std::string::npos)
		throw Exception("Error: bad input => " + value);
	double num = std::atof(value.c_str());
	if (num < 0)
		throw Exception("Error: not a positive number.");
}

float BitcoinExchange::GetValueForDate(const DateValue &dv)
{
	std::map<DateValue, float>::const_iterator it = _dataValues.lower_bound(dv);
	if (it != _dataValues.end() && it->first == dv)
		return it->second;
	if (it == _dataValues.begin())
	{
		std::cerr << "Error: No earlier date found in database for given date." << std::endl;
		return -1;
	}
	--it;
	return it->second;
}

BitcoinExchange::DateValue BitcoinExchange::StrToDate(const std::string &date)
{
	DateValue dv;
	size_t firstDash = date.find('-');
	size_t secondDash = date.find('-', firstDash + 1);
	dv.year = std::atoi(date.substr(0, firstDash).c_str());
	dv.month = std::atoi(date.substr(firstDash + 1, secondDash - firstDash - 1).c_str());
	dv.day = std::atoi(date.substr(secondDash + 1).c_str());
	return dv;
}

bool BitcoinExchange::DateValue::operator<(const DateValue &other) const
{
	if (year < other.year)
		return true;
	else if (year == other.year && month < other.month)
		return true;
	else if (year == other.year && month == other.month && day < other.day)
		return true;
	return false;
}

bool BitcoinExchange::DateValue::operator==(const DateValue &other) const
{

	return year == other.year && month == other.month && day == other.day;
}
