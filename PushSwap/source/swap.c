/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   swap.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-17 09:55:20 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-17 09:55:20 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

static int	ft_swap_l(t_stack **head)
{
	t_stack	temp;

	if (*head == NULL || (*head)->next == NULL)
		return (0);
	temp = *((*head)->next);
	ft_copy((*head)->next, **head);
	ft_copy((*head), temp);
	return (1);
}

void	ft_swap(t_stack **head, int flag)
{
	if (!ft_swap_l(head))
		return ;
	if (flag == B)
		ft_printf("sb\n");
	else if (flag == A)
		ft_printf("sa\n");
}

void	ft_swap_ss(t_stack **a, t_stack **b)
{
	ft_swap_l(a);
	ft_swap_l(b);
	ft_printf("ss\n");
}
