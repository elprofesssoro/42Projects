/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   push_swap.h                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-09-16 12:05:31 by idvinov           #+#    #+#             */
/*   Updated: 2024-09-16 12:05:31 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef PUSH_SWAP_H
# define PUSH_SWAP_H

# include <stdio.h>
# include <stdlib.h>
# include "../lib/libft/libft.h"
# include <limits.h>

# define A 0
# define B 1

typedef struct Stack
{
	int				value;
	int				index;
	int				position;
	int				target_position;
	int				cost_a;
	int				cost_b;
	struct Stack	*next;
}	t_stack;

t_stack		ft_pop(t_stack **head);
t_stack		*ft_stacklast(t_stack *head);
t_stack		*ft_peek(t_stack **head);
t_stack		*ft_new_node(int value);
void		ft_print_stack(t_stack *head);
void		ft_clear_stack(t_stack **head);
void		ft_copy(t_stack *stack, t_stack node);
void		ft_swap(t_stack **head, int flag);
void		ft_swap_ss(t_stack **a, t_stack **b);
void		ft_push_a(t_stack **a, t_stack **b);
void		ft_push_b(t_stack **a, t_stack **b);
void		ft_rotate(t_stack **head, int flag);
void		ft_rotate_rr(t_stack **a, t_stack **b);
void		ft_reverse(t_stack **head, int flag);
void		ft_reverse_rr(t_stack **a, t_stack **b);
int			ft_get_indexes(t_stack **a);
void		ft_fill_b(t_stack **a, t_stack **b, int size);
int			ft_stack_size(t_stack **stack);
void		ft_sort_three(t_stack **head);
void		ft_find_positions(t_stack **a, t_stack **b);
t_stack		ft_find_cost(t_stack **a, t_stack **b);
void		ft_sort_stack(t_stack **a, t_stack **b);
int			ft_is_sorted(t_stack **a, int size);
int			*ft_init_arr(t_stack **a, int size);
void		ft_do_move(t_stack **a, t_stack **b, t_stack index);
int			ft_is_digit(char c);
int			ft_is_sign(char c);
int			ft_nbstr_cmp(const char *s1, const char *s2);
int			ft_is_correct_input(int argc, char **av);
void		ft_stack_add_bottom(t_stack **stack, t_stack *new);
int			ft_abs(int nb);
void		ft_exit_error(t_stack **stack_a, t_stack **stack_b);
int			ft_is_digit(char c);
void		ft_clear_str(char **av);
long int	ft_atoi_l(const char *str);
int			ft_lowest_position(t_stack **stack);

#endif