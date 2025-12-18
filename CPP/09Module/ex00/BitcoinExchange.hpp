/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   BitcoinExchange.hpp                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-11-07 12:10:56 by idvinov           #+#    #+#             */
/*   Updated: 2025-11-07 12:10:56 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef BITCOINEXCHANGE_HPP
#define BITCOINEXCHANGE_HPP

#include <iostream>
#include <map>
#include <string>
#include <fstream>
#include <sstream>
#include <stdlib.h>

class BitcoinExchange
{

public:
	struct DateValue
	{
		int year;
		int month;
		int day;
		bool operator<(const DateValue &other) const;
		bool operator==(const DateValue &other) const;
	
	};
	BitcoinExchange();
	~BitcoinExchange();
	BitcoinExchange(const BitcoinExchange &other);
	BitcoinExchange &operator=(const BitcoinExchange &other);
	void Exchange(const std::string &filename);

private:
	std::string _databaseName;
	std::map<std::string, float> _data;
	std::map<DateValue, float> _dataValues;

	void ParseFile(const std::string &filename);
	DateValue StrToDate(const std::string &date);
	void ValidDate(const std::string &date);
	void ValidInputValue(const std::string &value);
	void ValidDatabaseValue(const std::string &value);
	float GetValueForDate(const DateValue &dv);
};

class Exception : public std::exception
{
private:
	std::string _message;

public:
	Exception(const std::string &message) : _message(message) {}
	virtual const char *what() const throw()
	{
		return _message.c_str();
	}
	virtual ~Exception() throw() {}
};

#endif