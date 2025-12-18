/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   RPN.cpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-12-01 15:39:45 by idvinov           #+#    #+#             */
/*   Updated: 2025-12-01 15:39:45 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "RPN.hpp"

RPN::RPN()
{
}

RPN::RPN(const RPN &instance)
{
	*this = instance;
}

RPN &RPN::operator=(const RPN &instance)
{
	if (this != &instance)
	{
		stack = instance.stack;
	}
	return *this;
}

RPN::~RPN()
{
}

int RPN::Execute(const std::string &expr)
{
	int i = -1;
	int result = 0;
	while (expr[++i])
	{
		char c = isSign(expr[i]);
		if (isdigit(expr[i]))
		{
			int num = expr[i] - '0';
			stack.push(num);
			continue;
		}
		else if (c == 1)
			continue;

		if (!c)
			return 0;

		if (stack.size() < 2)
		{
			std::cerr << "Wrong input" << std::endl;
			return 0;
		}

		int num2 = stack.top();
		stack.pop();
		int num1 = stack.top();
		stack.pop();
		switch (c)
		{
		case '*':
			result = num1 * num2;
			break;
		case '+':
			result = num1 + num2;
			break;
		case '-':
			result = num1 - num2;
			break;
		case '/':
			if (num2 == 0)
				return 0;
			result = num1 / num2;
			break;
		default:
			break;
		}

		stack.push(result);
	}

	if (stack.size() != 1)
		return 0;

	std::cout << stack.top() << std::endl;
	return 1;
}

char RPN::isSign(char c)
{
	if (c == '*' || c == '+' || c == '-' || c == '/')
		return c;
	if (c == ' ')
		return 1;
	return 0;
}
