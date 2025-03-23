/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   rotate.c                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-17 11:43:27 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-17 11:43:27 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

static void	ft_rotate_l(t_stack **head)
{
	t_stack	*node;
	t_stack	temp;
	int		head_val;

	node = *head;
	temp = *node;
	head_val = temp.value;
	while (node->next != NULL)
	{
		ft_copy(node, *(node->next));
		node = node->next;
	}
	ft_copy(node, temp);
}

void	ft_rotate(t_stack **head, int flag)
{
	ft_rotate_l(head);
	if (flag == B)
		ft_printf("rb\n");
	else if (flag == A)
		ft_printf("ra\n");
}

void	ft_rotate_rr(t_stack **a, t_stack **b)
{
	ft_rotate_l(a);
	ft_rotate_l(b);
	ft_printf("rr\n");
}
