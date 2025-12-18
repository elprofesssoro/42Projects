/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-11-14 13:10:06 by idvinov           #+#    #+#             */
/*   Updated: 2025-11-14 13:10:06 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "PMergeMe.hpp"
#include <vector>
#include <deque>
#include <iostream>
#include <ctime>
#include <sys/time.h>
#include <iomanip>

bool IsNumber(const std::string &str)
{
	for(size_t i = 0; i < str.size(); i++)
	{
		if (!isdigit(str[i]))
			return false;
	}
	return true;
}

int main(int argc, char **argv)
{
	if (argc < 2)
	{
		std::cerr << "Wrong amount of argumets" << std::endl;
		return 0;
	}
	std::vector<int> v;
	std::deque<int> d;
	for (int i = 1; i < argc; i++)
	{
		std::string str = argv[i];
		if (!IsNumber(str))
		{
			std::cerr << "Error: only digits are allowed" << std::endl;
			return 0;
		}
		int num = static_cast<int>(std::atof(str.c_str()));
		v.push_back(num);
		d.push_back(num);
	}
	std::cout << "Before:	";
	for (size_t i = 0; i < v.size(); i++)
	{
		std::cout << v[i] << " ";
	}
	std::cout << std::endl;
	PMergeMe p;
	struct timeval start, end;
	gettimeofday(&start, NULL);
	p.MergeInsertSort<std::vector<int>>(v, 1);
	gettimeofday(&end, NULL);
	long seconds = end.tv_sec - start.tv_sec;
	long useconds = end.tv_usec - start.tv_usec;
	double timeV = (seconds * 1000000.0 + useconds) / 1000000;
	gettimeofday(&start, NULL);
	p.MergeInsertSort<std::deque<int>>(d, 1);
	gettimeofday(&end, NULL);
	seconds = end.tv_sec - start.tv_sec;
	useconds = end.tv_usec - start.tv_usec;
	double timeD = (seconds * 1000000.0 + useconds) / 1000000;

	std::cout << "After:	";
	for (size_t i = 0; i < v.size(); i++)
	{
		std::cout << v[i] << " ";
	}
	std::cout <<std::endl << std::endl <<  std::fixed << std::setprecision(6);
	std::cout << "Time to process a range of " << v.size() << " with std::vector	: " << timeV << " s" << std::endl;
	std::cout << "Time to process a range of " << d.size() << " with std::deque		: " << timeD << " s" << std::endl;
	std::cout << std::endl;
}