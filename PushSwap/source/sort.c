/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   sort.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-26 09:57:23 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-26 09:57:23 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

static void	ft_shift_stack(t_stack **stack_a)
{
	int	lowest_pos;
	int	stack_size;

	stack_size = ft_stack_size(stack_a);
	lowest_pos = ft_lowest_position(stack_a);
	if (lowest_pos > stack_size / 2)
	{
		while (lowest_pos < stack_size)
		{
			ft_reverse(stack_a, A);
			lowest_pos++;
		}
	}
	else
	{
		while (lowest_pos > 0)
		{
			ft_rotate(stack_a, A);
			lowest_pos--;
		}
	}
}

void	ft_sort_stack(t_stack **a, t_stack **b)
{
	int		pos;
	int		size;

	while (*b != NULL)
	{
		ft_find_positions(a, b);
		ft_find_cost(a, b);
	}
	pos = 0;
	size = ft_stack_size(a);
	if (ft_is_sorted(a, ft_stack_size(a)))
		return ;
	ft_shift_stack(a);
}
