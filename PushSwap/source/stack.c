/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   stack.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-16 12:18:20 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-16 12:18:20 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

t_stack	*ft_stacklast(t_stack *head)
{
	if (!head)
		return (NULL);
	while (head->next)
		head = head->next;
	return (head);
}

t_stack	*ft_new_node(int value)
{
	t_stack	*node;

	node = (t_stack *)malloc(sizeof(t_stack));
	if (!node)
		return (NULL);
	node->next = NULL;
	node->value = value;
	node->cost_a = -1;
	node->cost_b = -1;
	node->index = -1;
	node->position = -1;
	node->target_position = -1;
	return (node);
}

void	ft_copy(t_stack *stack, t_stack node)
{
	stack->value = node.value;
	stack->cost_a = node.cost_a;
	stack->cost_b = node.cost_b;
	stack->position = node.position;
	stack->target_position = node.target_position;
	stack->index = node.index;
}

int	ft_stack_size(t_stack **stack)
{
	t_stack	*node;
	int		size;

	node = *stack;
	size = 0;
	while (node != NULL)
	{
		size++;
		node = node->next;
	}
	return (size);
}

void	ft_stack_add_bottom(t_stack **stack, t_stack *new)
{
	t_stack	*tail;

	if (!new)
		return ;
	if (!*stack)
	{
		*stack = new;
		return ;
	}
	tail = ft_stacklast(*stack);
	tail->next = new;
}
