/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Easyfind.hpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-06-12 11:10:24 by idvinov           #+#    #+#             */
/*   Updated: 2025-06-12 11:10:24 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */
#include <algorithm>
#include <iostream>

template <typename T>
typename T::iterator Easyfind(T &arg1, int arg2)
{
	typename T::iterator it = find(arg1.begin(), arg1.end(), arg2);
	if (it == arg1.end())
		throw std::exception();
	else
		return it;
}