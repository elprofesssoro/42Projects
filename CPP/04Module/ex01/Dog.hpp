/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Dog.hpp                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-19 13:46:14 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-19 13:46:14 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef DOG_HPP
#define DOG_HPP

#include "Animal.hpp"
#include "Brain.hpp"
#include <iostream>

class Dog : public Animal
{
private:
	Brain *brain;
public:
	Dog();
	Dog(const Dog &instance);
	Dog &operator=(const Dog &instance);
	~Dog();
	virtual void makeSound() const;
	Brain *GetBrain() const;
	void Compare(const Dog &other);
};

#endif