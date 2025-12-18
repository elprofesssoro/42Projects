/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Whatever.hpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-06-11 12:51:41 by idvinov           #+#    #+#             */
/*   Updated: 2025-06-11 12:51:41 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <iostream>

template <typename T>
void Swap(T &arg1, T &arg2)
{
	T temp = arg1;
	arg1 = arg2;
	arg2 = temp;
}

template <typename T>
T Min(T &arg1, T &arg2)
{
	return arg1 >= arg2 ? arg2 : arg1;
}

template <typename T>
T Max(T &arg1, T &arg2)
{
	return arg1 <= arg2 ? arg2 : arg1;
}