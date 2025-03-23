/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-17 10:17:29 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-17 10:17:29 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "push_swap.h"

static t_stack	*ft_fill_stack_values(int ac, char **av)
{
	t_stack		*stack_a;
	long int	nb;
	int			i;

	stack_a = NULL;
	nb = 0;
	if (ac == 2)
		i = 0;
	else
		i = 1;
	while (av[i])
	{
		nb = ft_atoi_l(av[i]);
		if (nb > INT_MAX || nb < INT_MIN)
		{
			if (ac == 2)
				ft_clear_str(av);
			ft_exit_error(&stack_a, NULL);
		}
		ft_stack_add_bottom(&stack_a, ft_new_node((int)nb));
		i++;
	}
	return (stack_a);
}

static void	ft_init_sort(t_stack **a, t_stack **b)
{
	if (ft_is_sorted(a, ft_stack_size(a)))
		return ;
	if (!ft_get_indexes(a))
		return ;
	if (ft_stack_size(a) <= 3)
	{
		ft_sort_three(a);
		return ;
	}
	if (ft_is_sorted(a, ft_stack_size(a)))
		return ;
	ft_fill_b(a, b, ft_stack_size(a));
	ft_sort_three(a);
	ft_sort_stack(a, b);
}

int	main(int argc, char **argv)
{
	t_stack	*a;
	t_stack	*b;
	char	**arg;

	if (argc < 2)
		return (0);
	if (argc == 2)
		arg = ft_split(argv[1], ' ');
	else
		arg = argv;
	if (!ft_is_correct_input(argc, arg))
	{
		if (argc == 2)
			ft_clear_str(arg);
		ft_exit_error(NULL, NULL);
	}
	b = NULL;
	a = ft_fill_stack_values(argc, arg);
	ft_init_sort(&a, &b);
	ft_clear_stack(&a);
	ft_clear_stack(&b);
	if (argc == 2)
		ft_clear_str(arg);
	return (0);
}
