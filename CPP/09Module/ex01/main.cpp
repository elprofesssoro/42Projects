/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-12-01 14:46:59 by idvinov           #+#    #+#             */
/*   Updated: 2025-12-01 14:46:59 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "RPN.hpp"
#include <iostream>
#include <stack>
#include <stdlib.h>


int main(int argc, char **argv)
{
	if (argc != 2)
	{
		std::cerr << "Error1" << std::endl;
		return 0;
	}

	RPN rpn;
	std::string expr = argv[1];
	if (!rpn.Execute(expr))
		std::cerr << "Error" << std::endl;
}