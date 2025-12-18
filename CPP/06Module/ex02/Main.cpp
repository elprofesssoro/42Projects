/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-06-11 10:00:25 by idvinov           #+#    #+#             */
/*   Updated: 2025-06-11 10:00:25 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <cstdlib>
#include <iostream>
#include <ctime>

#include "inc/Base.hpp"
#include "inc/A.hpp"
#include "inc/B.hpp"
#include "inc/C.hpp"

Base *generate(void);
void identify(Base *p);
void identify(Base &p);
bool TryCast(Base &b, int i);

int main()
{
	std::srand(std::time({}));
	Base *b = generate();
	identify(b);
	identify(*b);

	delete b;
}

Base *generate(void)
{
	Base *b;
	int random = rand() % 3;
	switch (random)
	{
	case 0:
		b = new A();
		std::cout << "A class was created" << std::endl;
		break;
	case 1:
		b = new B();
		std::cout << "B class was created" << std::endl;
		break;
	case 2:
		b = new C();
		std::cout << "C class was created" << std::endl;
		break;
	default:
		break;
	}
	return b;
}

void identify(Base *p)
{
	std::cout << "Identifying via pointer: ";
	if (dynamic_cast<A *>(p))
		std::cout << "A" << std::endl;
	else if (dynamic_cast<B *>(p))
		std::cout << "B" << std::endl;
	else if (dynamic_cast<C *>(p))
		std::cout << "C" << std::endl;
	else
		std::cout << "Unkown type" << std::endl;
}

void identify(Base &p)
{
	std::cout << "Identifying via reference: ";
	for (int i = 0; i < 3; i++)
	{
		if (TryCast(p, i))
		{
			return;
		}
	}
}

bool TryCast(Base &b, int i)
{
	switch (i)
	{
	case 0:
		try
		{
			A &a = dynamic_cast<A &>(b);
			std::cout << "A" << std::endl;
			return true;
		}
		catch (const std::exception &e)
		{
			return false;
		}
		break;
	case 1:
		try
		{
			B &a = dynamic_cast<B &>(b);
			std::cout << "B" << std::endl;
			return true;
		}
		catch (const std::exception &e)
		{
			return false;
		}
		break;
	case 2:
		try
		{
			C &a = dynamic_cast<C &>(b);
			std::cout << "C" << std::endl;
			return true;
		}
		catch (const std::bad_cast &e)
		{
			return false;
		}
		break;
	default:
		std::cout << "Unknown type" << std::endl;
		break;
	}
	return false;
}
