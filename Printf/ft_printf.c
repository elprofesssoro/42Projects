/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_printf.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-06-24 10:08:14 by idvinov           #+#    #+#             */
/*   Updated: 2024-06-24 10:08:14 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "ft_printf.h"

int	ft_printf(const char *str, ...)
{
	va_list	ptr;
	int		count;

	va_start(ptr, str);
	count = 0;
	while (*str)
	{
		if (*str == '%')
		{
			str++;
			ft_checksymb(*str, &count, &ptr);
		}
		else
		{
			ft_printc(*str, &count);
		}
		str++;
	}
	return (count);
}

void	ft_checksymb(char c, int *count, va_list *args)
{
	if (c == 'c')
		ft_printc(va_arg(*args, int), count);
	else if (c == 's')
		ft_printstr(va_arg(*args, char *), count);
	else if (c == 'd' || c == 'i')
		ft_num(va_arg(*args, int), count);
	else if (c == 'u')
		ft_unum(va_arg(*args, unsigned int), count);
	else if (c == '%')
		ft_printc('%', count);
	else if (c == 'p')
		ft_ptr(va_arg(*args, void *), count);
	else if (c == 'x' || c == 'X')
		ft_hex(va_arg(*args, int), count, c);
}
