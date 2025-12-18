/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   RPN.hpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-12-01 15:37:07 by idvinov           #+#    #+#             */
/*   Updated: 2025-12-01 15:37:07 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
#ifndef RPN_HPP
#define RPN_HPP

#include<stack>
#include<iostream>

class RPN
{
	std::stack<int> stack;
	char isSign(char c);
public:
	RPN();
	RPN(const RPN &instance);
	RPN &operator=(const RPN &instance);
	~RPN();
	int Execute(const std::string &expr);
};

#endif