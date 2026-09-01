/*附加题4：
(就往年平均水平来看，这一道附加题的难度确实有些高了。)
首先要说明一些事实：要做这一道附加题，需要有一定的C语言编程基础，还要对于计算机数据的存储有一些了解，
此外，这些附加题的难度是不低的，如果大家没有做出来也不需要沮丧。  

要求和说明：  
1. 不使用任何c语言的库，例如<stdio.h>。
2. 不需要写main函数，每一题只需要把相应的函数补全。
3. 在做下面的题目的时候，最好记录一下自己的思路等等，就算没有做出来，有好的思路也是加分项，或者说，好的思路比起答案更重要。
4. 有任何想法欢迎来单杀或者拷打出题人。
5. 每一道题目中，你会得到一个形式如下的函数：  


    int Funct(arg1, arg2, ...) {
      // brief description of how your implementation works 
      int var1 = Expr1;
      ...
      int varM = ExprM;

      varJ = ExprJ;
      ...
      varN = ExprN;
      return ExprR;
     }

    其中“Expr”是一个只使用如下形式的表达式：  
    1. 一个整型常量，范围是0到0xff。（包括0和0xff）
    2. 函数自变量和局部变量。
    3. 一元的整数运算符 ！和~。
    4. 二进制整数运算符 &、^、|、+、<<和>>。
    5. 某些问题可能会进一步限制运算符的使用并且“Expr”可以由多个运算符组成。

    除此之外，还明确禁止以下操作：
    1. 使用宏。
    2. 调用任何函数。
    3. 使用除了int以外的数据类型。
    4. 使用强制类型转换。
    5. 使用其他的运算，比如||、&&。
    6. 使用控制语句，比如 if, do, while, for, switch。

    在开始解决题目之前，我们先做一点假设：
    1. 你的电脑是32位，使用2s补码。
    2. 算术右移

    接下来放一个例子举例告诉大家正确的代码形式：
*/

   /*
 * isTmax - returns 1 if x is the maximum, two's complement number,
 *     and 0 otherwise 
 *   Legal ops: ! ~ & ^ | +
 *   Max ops: 10
 *   Rating: 1
 */
  int isTmax(int x) {
    return !((~(x+1))^x)&!!(x+1);
    //return 2;
  }

//(如果有同学想要英文版的题目，可以私聊出题人，拷打他为什么出中文的并且偷偷拿一份英文题目)

//此处开始为题目：
/*
第1题：bitXor
完成异或（^）的功能，输出x^y
允许的操作： ~ &
Example: bitXor(4, 5) = 1
*/

int bitXor(int x, int y) {
  return 2;//修改此处代码
}

/*
第2题：allOddBits
如果二进制数所有奇数位都是1，返回1，其中位的计算从第0位到第31位
允许的操作：! ~ & ^ | + << >>
Examples allOddBits(0xFFFFFFFD) = 0, allOddBits(0xAAAAAAAA) = 1
*/

int allOddBits(int x) {
  return 2;
}

/*
第3题：negate
返回 -x
允许的操作：! ~ & ^ | + << >>
Example: negate(1) = -1.
*/
int negate(int x) {
  return 2;
}

/*
第4题：isAsciiDigit
如果0x30<=x<=0x39，返回1
允许的操作：! ~ & ^ | + << >>
Example:   isAsciiDigit(0x35) = 1.
           isAsciiDigit(0x3a) = 0.
           isAsciiDigit(0x05) = 0.
*/
int isAsciiDigit(int x) {
  return 2;
}

/*
第5题：isLessOrEqual
如果 x <= y  返回 1, 否则返回 0
允许的操作：! ~ & ^ | + << >>
*/
int isLessOrEqual(int x, int y) {
  return 2;
}

/*
关于本题的提交：请直接修改本文件题目中的函数内容，提交时单独提交修改过的C文件即可，不需要将本题答案写在原markdown文档中
提交时本题文件名格式应为：“学号-姓名-lot方向-第一期附加题4”
*/