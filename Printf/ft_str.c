/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_str.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-06-27 09:40:47 by idvinov           #+#    #+#             */
/*   Updated: 2024-06-27 09:40:47 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ft_printf.h"

void	ft_printstr(char const *str, int *count)
{
	if (!str)
	{
		ft_printstr("(null)", count);
		return ;
	}
	while (*str)
	{
		ft_printc(*str, count);
		str++;
	}
}

void	ft_printc(char c, int *count)
{
	write(1, &c, 1);
	*count += 1;
}
