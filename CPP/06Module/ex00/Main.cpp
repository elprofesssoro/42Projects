#include "ScalarConverter.hpp"

int main(int argc, char **argv)
{

	if (argc != 2)
	{
		std::cout << "Wrong amount of arguments" << std::endl;
		return 0;
	}
	// std::string s = "123.1fffqW";
	// std::cout << ConvertInt(s);
	ScalarConverter::Convert(argv[1]);
}
