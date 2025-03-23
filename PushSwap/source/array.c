/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   array.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-26 11:40:37 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-26 11:40:37 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

static void	ft_copy_arr(t_stack **a, int size, int *nums)
{
	t_stack	*node;
	int		i;

	node = *a;
	i = -1;
	while (node != NULL && ++i < size)
	{
		nums[i] = node->value;
		node = node->next;
	}
}

int	ft_is_sorted(t_stack **a, int size)
{
	int	i;
	int	*arr;

	arr = ft_init_arr(a, size);
	if (!arr)
		return (-1);
	i = 0;
	while (++i < size)
	{
		if (arr[i] < arr[i - 1])
		{
			free(arr);
			return (0);
		}
	}
	free(arr);
	return (1);
}

int	*ft_init_arr(t_stack **a, int size)
{
	t_stack	*node;
	int		i;
	int		*nums;

	node = *a;
	i = -1;
	nums = (int *)malloc(size * sizeof(int));
	if (!nums)
		return (NULL);
	ft_copy_arr(a, size, nums);
	return (nums);
}
