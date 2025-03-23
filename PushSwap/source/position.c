/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   position.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-23 10:12:53 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-23 10:12:53 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

static void	ft_position(t_stack **head)
{
	int		i;
	t_stack	*node;

	i = 0;
	node = *head;
	while (node != NULL)
	{
		node->position = i;
		node = node->next;
		i++;
	}
}

static int	ft_target(t_stack *a, int target, int index, int tar_pos)
{
	t_stack	*tmp;

	tmp = a;
	while (tmp)
	{
		if (tmp->index > index && tmp->index < target)
		{
			tar_pos = tmp->position;
			target = tmp->index;
		}
		tmp = tmp->next;
	}
	if (target != __INT_MAX__)
		return (tar_pos);
	tmp = a;
	while (tmp)
	{
		if (tmp->index < target)
		{
			target = tmp->index;
			tar_pos = tmp->position;
		}
		tmp = tmp->next;
	}
	return (tar_pos);
}

int	ft_lowest_position(t_stack **stack)
{
	t_stack	*tmp;
	int		lowest_index;
	int		lowest_pos;

	tmp = *stack;
	lowest_index = INT_MAX;
	ft_position(stack);
	lowest_pos = tmp->position;
	while (tmp)
	{
		if (tmp->index < lowest_index)
		{
			lowest_index = tmp->index;
			lowest_pos = tmp->position;
		}
		tmp = tmp->next;
	}
	return (lowest_pos);
}

void	ft_find_positions(t_stack **a, t_stack **b)
{
	t_stack	*b_head;

	b_head = *b;
	ft_position(a);
	ft_position(b);
	while (b_head)
	{
		b_head->target_position = ft_target(*a, __INT_MAX__,
				b_head->index, 0);
		b_head = b_head->next;
	}
}
