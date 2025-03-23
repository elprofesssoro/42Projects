/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_hex.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-06-27 09:33:40 by idvinov           #+#    #+#             */
/*   Updated: 2024-06-27 09:33:40 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "libft.h"

static void	ft_printhex(char *buff, int maxsymb, int *count);
static void	ft_fillbuff(char *buff, long int size, int *i, int *count);

void	ft_hex(int num, int *count, char l)
{
	char	*hex;
	char	buff[sizeof(int) * 2 + 1];
	int		i;

	buff[sizeof(int) * 2] = 0;
	i = sizeof(int) * 2;
	while (--i >= 0)
		buff[i] = '/';
	if (l == 'x')
		hex = "0123456789abcdef";
	else if (l == 'X')
		hex = "0123456789ABCDEF";
	i = sizeof(int) * 2;
	if (num == 0)
	{
		ft_printc('0', count);
		return ;
	}
	while (--i >= 0 && num != 0)
	{
		buff[i] = hex[num & 0xF];
		num >>= 4;
	}
	ft_printhex(buff, sizeof(int) * 2, count);
}

void	ft_ptr(void *ptr, int *count)
{
	unsigned long	address;
	char			buff[sizeof(unsigned long) * 2 + 1];
	int				i;
	char			*hex;

	if (!ptr)
	{
		ft_printstr("(nil)", count);
		return ;
	}
	ft_fillbuff(buff, sizeof(unsigned long) * 2, &i, count);
	address = (unsigned long) ptr;
	hex = "0123456789abcdef";
	if (address == 0)
	{
		ft_printc('0', count);
		return ;
	}
	while (--i >= 0 && address != 0)
	{
		buff[i] = hex[address & 0xF];
		address >>= 4;
	}
	buff[(sizeof(unsigned long) * 2)] = 0;
	ft_printhex(buff, sizeof(unsigned long) * 2, count);
}

static void	ft_printhex(char *buff, int maxsymb, int *count)
{
	int		i;

	i = 0;
	while (i < maxsymb)
	{
		if (buff[i] != '/')
		{
			ft_printc(buff[i], count);
		}
		i++;
	}
}

static void	ft_fillbuff(char *buff, long int size, int *i, int *count)
{
	ft_printstr("0x", count);
	*i = size;
	while (--size >= 0)
		buff[size] = '/';
}
