/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   fillb.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-20 10:47:57 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-20 10:47:57 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

void	ft_fill_b(t_stack **a, t_stack **b, int size)
{
	int	i;
	int	pushed;

	i = 0;
	pushed = 0;
	while (size > 6 && i < size && pushed < size / 2)
	{
		if ((*a)->index <= size / 2)
		{
			ft_push_b(a, b);
			pushed++;
		}
		else
			ft_rotate(a, A);
		i++;
	}
	while (size - pushed > 3)
	{
		ft_push_b(a, b);
		pushed++;
	}
}
