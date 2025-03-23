/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   printf.h                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2024-06-24 09:07:58 by idvinov           #+#    #+#             */
/*   Updated: 2024-06-24 09:07:58 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef FT_PRINTF_H
# define FT_PRINTF_H

# include <stdio.h>
# include <stdlib.h>
# include <stdarg.h>
# include <unistd.h>

int		ft_printf(const char *str, ...);
void	ft_checksymb(char c, int *count, va_list *args);
void	ft_printc(char c, int *count);
void	ft_printstr(char const *str, int *count);
void	ft_ptr(void *ptr, int *count);
void	ft_hex(int num, int *count, char l);
void	ft_num(int n, int *count);
void	ft_unum(unsigned int n, int *count);

#endif