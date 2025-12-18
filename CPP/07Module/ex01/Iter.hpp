/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Iter.hpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-06-11 12:56:03 by idvinov           #+#    #+#             */
/*   Updated: 2025-06-11 12:56:03 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <iostream>

template <typename T, typename Func>
void Iter(T *arr, size_t length, Func func)
{
	if (!arr)
		return;
	
	for(size_t i = 0; i < length; i++)
		func(arr[i]);
}