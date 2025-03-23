/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   input_check.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-28 11:03:44 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-28 11:03:44 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

static int	ft_arg_is_number(char *av)
{
	int	i;

	i = 0;
	if (ft_is_sign(av[i]) && av[i + 1] != '\0')
		i++;
	while (av[i] && ft_is_digit(av[i]))
		i++;
	if (av[i] != '\0' && !ft_is_digit(av[i]))
		return (0);
	return (1);
}

static int	ft_have_duplicates(char **av)
{
	int	i;
	int	j;

	i = 1;
	while (av[i])
	{
		j = 1;
		while (av[j])
		{
			if (j != i && ft_nbstr_cmp(av[i], av[j]) == 0)
				return (1);
			j++;
		}
		i++;
	}
	return (0);
}

static int	ft_arg_is_zero(char *av)
{
	int	i;

	i = 0;
	if (ft_is_sign(av[i]))
		i++;
	while (av[i] && av[i] == '0')
		i++;
	if (av[i] != '\0')
		return (0);
	return (1);
}

int	ft_is_correct_input(int argc, char **av)
{
	int	i;
	int	nb_zeros;

	nb_zeros = 0;
	if (argc == 2)
		i = 0;
	else
		i = 1;
	while (av[i])
	{
		if (!ft_arg_is_number(av[i]))
			return (0);
		nb_zeros += ft_arg_is_zero(av[i]);
		i++;
	}
	if (nb_zeros > 1)
		return (0);
	if (ft_have_duplicates(av))
		return (0);
	return (1);
}
