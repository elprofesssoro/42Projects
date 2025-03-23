/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Main.cpp                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: idvinov <idvinov@student.42.fr>            #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025-03-13 15:43:02 by idvinov           #+#    #+#             */
/*   Updated: 2025-03-13 15:43:02 by idvinov          ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include <fstream>
#include <iostream>
#include <string>

static void FileReplace(std::string filename, std::string s1, std::string s2)
{
	std::ifstream fin(filename.c_str(), std::ios_base::in);
	if (!fin.is_open())
	{
		std::cout << "Failed to open: " << filename << std::endl;
		return;
	}
	std::ofstream fout((filename + ".replace").c_str(), std::ios_base::out);
	if (!fout.is_open())
	{
		std::cout << "Failed to open: " << filename << std::endl;
		return;
	}

	std::string str;
	while (getline(fin, str))
	{
		size_t sPos;
		while ((sPos = str.find(s1)) != std::string::npos)
		{
			str.erase(sPos, s1.length());
			str.insert(sPos, s2);
		}
		if (!std::cin.eof())
			fout << str;
		if (!fin.eof())
			fout << std::endl;
	}
	fin.close();
	fout.close();
}

int main(int argc, char **argv)
{
	if (argc != 4)
	{
		std::cout << "Wrong amount of parameters.\n";
		return 0;
	}

	FileReplace(argv[1], argv[2], argv[3]);
}