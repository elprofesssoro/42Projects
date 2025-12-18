/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   PMergeMe.hpp                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-11-13 14:56:47 by idvinov           #+#    #+#             */
/*   Updated: 2025-11-13 14:56:47 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef PMERGEME_HPP
#define PMERGEME_HPP

#include <iostream>
#include <vector>
#include <deque>
#include <ctime>
#include <cmath>
#include <algorithm>

template <typename T>
bool IsLess(T first, T second)
{
	return *first < *second;
}

int Jacobsthal(int n);

class PMergeMe
{
private:
	template <typename T>
	T MoveTo(T it, int to)
	{
		std::advance(it, to);
		return it;
	}

	template <typename T>
	void Swap(T &first, T &second, int pairsSize)
	{
		while (pairsSize > 0)
		{
			std::iter_swap(first, second);
			first--;
			second--;
			--pairsSize;
		}
	}

public:
	PMergeMe();
	PMergeMe(const PMergeMe &other);
	PMergeMe &operator=(const PMergeMe &other);
	~PMergeMe();

	template <typename T>
	void MergeInsertSort(T &container, int pairsSize)
	{
		typedef typename T::iterator iter;

		int amountPairs = container.size() / pairsSize;
		if (amountPairs / 2 < 1)
		{
			return;
		}

		bool isOdd = amountPairs % 2 == 1;
		iter start = container.begin() + pairsSize - 1;
		int non = container.size() - pairsSize * amountPairs;
		iter end = MoveTo(container.end() - non, -(isOdd * pairsSize));
		int step = 2 * pairsSize;
		for (; start < end; start += step)
		{
			iter cur = start;
			iter next = MoveTo(cur, pairsSize);
			if (IsLess(next, cur))
			{
				Swap(cur, next, pairsSize);
			}
		}

		MergeInsertSort(container, pairsSize * 2);
		std::vector<iter> main;
		std::vector<iter> pend;
		start = MoveTo(container.begin(), pairsSize - 1);
		main.insert(main.end(), container.begin() + pairsSize - 1);
		main.insert(main.end(), container.begin() + pairsSize * 2 - 1);
		start = MoveTo(start, pairsSize);
		for (int i = 4; i <= amountPairs; i += 2)
		{
			main.push_back(MoveTo(container.begin(), pairsSize * i - 1));
			pend.push_back(MoveTo(container.begin(), pairsSize * (i - 1) - 1));
		}
		if (isOdd)
		{
			pend.push_back(end + pairsSize - 1);
		}

		size_t c = 2;
		int prevJ = 1;
		int inserted_count = 0;

		while (!pend.empty())
		{
			int curr_jacobsthal = Jacobsthal(++c);
			int right_idx = curr_jacobsthal - 2;
			int left_idx = prevJ - 1;

			if (right_idx >= static_cast<int>(pend.size()))
				right_idx = pend.size() - 1;

			if (left_idx >= static_cast<int>(pend.size()))
				break;

			for (int i = right_idx; i >= left_idx; --i)
			{
				int at = i + 2 + inserted_count;
				typename std::vector<iter>::iterator tillMain = at >= static_cast<int>(main.size()) ? main.end() : MoveTo(main.begin(), at);
				iter pend_val = pend[i];
				typename std::vector<iter>::iterator pos =
					std::upper_bound(main.begin(), tillMain, pend_val, IsLess<iter>);
				main.insert(pos, pend_val);
				inserted_count++;
			}

			prevJ = curr_jacobsthal;
		}

		std::vector<int> copyContainer;
		copyContainer.reserve(container.size());
		for (typename std::vector<iter>::iterator it = main.begin(); it != main.end(); it++)
		{
			for (int i = pairsSize - 1; i >= 0; i--)
			{
				iter pairStart = *it;
				pairStart = MoveTo(pairStart, -i);
				copyContainer.insert(copyContainer.end(), *pairStart);
			}
		}
		std::vector<int>::iterator copyIt = copyContainer.begin();
		iter contIt = container.begin();
		while (copyIt != copyContainer.end())
		{
			*contIt = *copyIt;
			contIt++;
			copyIt++;
		}
	}
};

#endif