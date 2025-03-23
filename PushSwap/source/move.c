/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   move.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-27 10:55:08 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-27 10:55:08 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

static	void	ft_do_rev_rotate(t_stack **a, t_stack **b, t_stack *index)
{
	while (index->cost_a < 0 && index->cost_b < 0)
	{
		(index->cost_a)++;
		(index->cost_b)++;
		ft_reverse_rr(a, b);
	}
}

static	void	ft_do__rotate(t_stack **a, t_stack **b, t_stack *index)
{
	while (index->cost_a > 0 && index->cost_b > 0)
	{
		(index->cost_a)--;
		(index->cost_b)--;
		ft_rotate_rr(a, b);
	}
}

static	void	ft_move(t_stack **a, t_stack **b, int *cost, int flag)
{
	while (*cost != 0)
	{
		if (*cost < 0)
		{
			if (flag == A)
				ft_reverse(a, A);
			else if (flag == B)
				ft_reverse(b, B);
			(*cost)++;
		}
		else if (*cost > 0)
		{
			if (flag == A)
				ft_rotate(a, A);
			else if (flag == B)
				ft_rotate(b, B);
			(*cost)--;
		}
	}
}

void	ft_do_move(t_stack **a, t_stack **b, t_stack index)
{
	if (index.cost_a < 0 && index.cost_b < 0)
		ft_do_rev_rotate(a, b, &index);
	else if (index.cost_a > 0 && index.cost_b > 0)
		ft_do__rotate(a, b, &index);
	ft_move(a, b, &index.cost_b, B);
	ft_move(a, b, &index.cost_a, A);
	ft_push_a(a, b);
}
