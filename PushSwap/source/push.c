/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   push.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-17 09:06:35 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-17 09:06:35 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

static void	ft_push(t_stack **head, t_stack **dst)
{
	t_stack	*node;

	if (*head == NULL)
		return ;
	node = (*head)->next;
	(*head)->next = *dst;
	*dst = *head;
	*head = node;
}

void	ft_push_a(t_stack **a, t_stack **b)
{
	ft_push(b, a);
	ft_printf("pa\n");
}

void	ft_push_b(t_stack **a, t_stack **b)
{
	ft_push(a, b);
	ft_printf("pb\n");
}
