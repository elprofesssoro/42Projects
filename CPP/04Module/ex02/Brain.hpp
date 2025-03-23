/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Brain.hpp                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-19 14:31:50 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-19 14:31:50 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef BRAIN_HPP
#define BRAIN_HPP

#include <iostream>

class Brain
{
private:
	std::string	*ideas;
public:
	Brain();
	Brain(const Brain &instance);
	Brain &operator=(const Brain &instance);
	~Brain();
	std::string *getIdeas() const;
};

#endif