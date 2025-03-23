/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   sort_three.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-23 09:45:59 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-23 09:45:59 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

static	int	ft_highest_index(t_stack *node)
{
	int	index;

	index = node->index;
	while (node != NULL)
	{
		if (index < node->index)
			index = node->index;
		node = node->next;
	}
	return (index);
}

void	ft_sort_three(t_stack **head)
{
	t_stack	*node;
	int		index;

	node = *head;
	index = ft_highest_index(node);
	if (node->index == index)
		ft_rotate(head, A);
	else if (node->next->index == index)
		ft_reverse(head, A);
	if (node->index > node->next->index)
		ft_swap(head, A);
}
