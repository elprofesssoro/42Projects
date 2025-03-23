/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pop.c                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-17 09:30:59 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-17 09:30:59 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

t_stack	ft_pop(t_stack **head)
{
	t_stack	*node;
	t_stack	value;

	value = **head;
	if (*head == NULL)
	{
		ft_printf("Stack is empty\n");
		return (value);
	}
	node = *head;
	*head = (*head)->next;
	free(node);
	return (value);
}
