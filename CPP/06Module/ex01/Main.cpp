/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-06-10 13:47:27 by idvinov           #+#    #+#             */
/*   Updated: 2025-06-10 13:47:27 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "Data.hpp"
#include "Serializer.hpp"

int main()
{
	Data d1;
	d1.symb = 'h';
	d1.number = 12354;
	d1.string = "Hello";

	Data d2;
	d1.symb = 'b';
	d1.number = 9999999;
	d1.string = "Bye";

	uintptr_t p;

	std::cout << "Data 1 : " << d1.number << ", " << d1.symb << ", " << d1.string << std::endl;
	p = Serializer::Serialize(&d1);
	Data *d3 = Serializer::Deserialize(p);
	std::cout << "Data 3 : " << d3->number << ", " << d3->symb << ", " << d3->string << std::endl;

}
