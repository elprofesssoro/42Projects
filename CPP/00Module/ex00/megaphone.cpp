/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   megaphone.cpp                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-07 12:44:53 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-07 12:44:53 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <iostream>

int main(int argc, char **argv)
{
	if(argc == 1)
		std::cout << "* LOUD AND UNBEARABLE FEEDBACK NOISE *";
	std::string outp;
	for(int i = 1; i < argc; i++)
	{
		outp = argv[i];
		for(size_t j = 0; j < outp.length(); j++)
			std::cout << (char)toupper(outp[j]);
		outp.clear();
	}
	std::cout << std::endl;
}