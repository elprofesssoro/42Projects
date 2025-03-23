/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cost.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-25 12:17:39 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-25 12:17:39 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

static void	ft_get_cost(t_stack **a, t_stack **b)
{
	t_stack	*tmp_a;
	t_stack	*tmp_b;
	int		size_a;
	int		size_b;

	tmp_a = *a;
	tmp_b = *b;
	size_a = ft_stack_size(a);
	size_b = ft_stack_size(b);
	while (tmp_b)
	{
		tmp_b->cost_b = tmp_b->position;
		if (tmp_b->position > size_b / 2)
			tmp_b->cost_b = (size_b - tmp_b->position) * -1;
		tmp_b->cost_a = tmp_b->target_position;
		if (tmp_b->target_position > size_a / 2)
			tmp_b->cost_a = (size_a - tmp_b->target_position) * -1;
		tmp_b = tmp_b->next;
	}
}

static t_stack	ft_min_cost(t_stack *b)
{
	t_stack	res;
	int		cost;
	int		temp;

	cost = ft_abs(b->cost_a) + ft_abs(b->cost_b);
	res = *b;
	b = b->next;
	while (b)
	{
		temp = ft_abs(b->cost_b) + ft_abs(b->cost_a);
		if (temp < ft_abs(cost))
		{
			cost = temp;
			res = *b;
		}
		b = b->next;
	}
	return (res);
}

t_stack	ft_find_cost(t_stack **a, t_stack **b)
{
	t_stack	*node;
	t_stack	index;

	node = *a;
	ft_get_cost(a, b);
	index = ft_min_cost(*b);
	ft_do_move(a, b, index);
	return (index);
}
