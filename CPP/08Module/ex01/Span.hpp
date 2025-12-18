/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Span.hpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-06-12 12:45:44 by idvinov           #+#    #+#             */
/*   Updated: 2025-06-12 12:45:44 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <algorithm>
#include <iostream>
#include <vector>

class Span
{
private:
	std::vector<int> v;
	size_t n;

public:
	Span();
	Span(int n);
	Span(const Span &instance);
	Span &operator=(const Span &span);
	~Span();
	void AddNumber(int num);

	template <typename Iterator>
	void AddNumbers(Iterator b, Iterator e)
	{
		if (std::distance(b, e) + v.size() > n)
			throw OutOfRangeException();

		v.insert(v.end(), b, e);
	}
	int ShortestSpan();
	int LongestSpan();
	class OutOfRangeException : public std::exception
	{
	public:
		virtual const char *what() const throw();
	};
	class EmptyContainerException : public std::exception
	{
	public:
		virtual const char *what() const throw();
	};
};