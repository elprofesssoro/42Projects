/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   sorting.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-19 09:29:51 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-19 09:29:51 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

void	ft_insert_sort(int *arr, int n)
{
	int	i;
	int	key;
	int	j;

	i = 1;
	while (i < n)
	{
		key = arr[i];
		j = i - 1;
		while (j >= 0 && arr[j] > key)
		{
			arr[j + 1] = arr[j];
			j = j - 1;
		}
		arr[j + 1] = key;
		i++;
	}
}

int	ft_set_indexes(t_stack **a, int size, int *nums)
{
	t_stack	*node;
	int		i;

	node = *a;
	while (node != NULL)
	{
		i = -1;
		while (++i < size)
		{
			if (nums[i] == node->value)
			{
				node->index = i;
				break ;
			}
		}
		node = node->next;
	}
	return (1);
}

void	ft_print(t_stack **a)
{
	t_stack	*node;

	node = *a;
	while (node != NULL)
	{
		ft_printf("%d ", node->index);
		node = node->next;
	}
	ft_printf("\n");
}

int	ft_get_indexes(t_stack **a)
{
	t_stack	*node;
	int		*nums;
	int		size;
	int		i;

	node = *a;
	size = ft_stack_size(a);
	nums = ft_init_arr(a, size);
	if (!nums)
		return (0);
	i = -1;
	ft_insert_sort(nums, size);
	if (!ft_set_indexes(a, size, nums))
	{
		free(nums);
		return (0);
	}
	free(nums);
	return (1);
}
