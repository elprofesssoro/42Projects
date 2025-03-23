/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   reverse.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-17 12:01:28 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-17 12:01:28 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

static void	ft_reverse_l(t_stack **head)
{
	t_stack	value;
	t_stack	temp;
	t_stack	*node;

	node = *head;
	value = *node;
	while (node->next != NULL)
	{
		temp = *node->next;
		ft_copy(node->next, value);
		node = node->next;
		value = temp;
	}
	ft_copy(*head, value);
}

void	ft_reverse(t_stack **head, int flag)
{
	ft_reverse_l(head);
	if (flag == B)
		ft_printf("rrb\n");
	else if (flag == A)
		ft_printf("rra\n");
}

void	ft_reverse_rr(t_stack **a, t_stack **b)
{
	ft_reverse_l(a);
	ft_reverse_l(b);
	ft_printf("rrr\n");
}
