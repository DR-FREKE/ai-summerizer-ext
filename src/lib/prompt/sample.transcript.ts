export const transcript_example = `0:00 yesterday the clouds opened up and a
0:01 weird new programming language came down
0:03 to earth with a promise of parallelism
0:05 for allou who writeth code this is big
0:08 if true because parallel Computing is a
0:09 superpower it allows a programmer to
0:11 take a problem that could be solved in a
0:13 week and instead solve it in seven days
0:15 using seven different computers
0:16 unfortunately running code in parallel
0:18 is like conducting a symphony one wrong
0:20 note and the entire thing becomes a
0:22 total disaster but luckily Bend offers
0:24 Hope by making a bold promise everything
0:26 that can run in parallel will run in
0:28 parallel you don't need to know anything
0:30 about Cuda blocks locks mutexes or
0:32 regex's to write algorithms that take
0:35 advantage of all 24 of your CPU cores or
0:37 even all 16,000 of your GPU cores you
0:40 just write some highlevel python looking
0:42 code and the rest is Magic it is May
0:44 17th 2024 and you're watching the code Python
0:47 report when you write code in a language
0:48 like python your code runs on a single
0:50 thread that means only one thing can
0:52 happen at a time it's like going to a
0:54 KFC with only one employee who takes the
0:56 order cleans the toilets and Cooks the
0:57 food in that order now on a modern CPU
1:00 you might have a clock cycle around 4
1:01 GHz and if it's handling one instruction
1:04 per cycle you're only able to perform 4
1:06 billion instructions per second now if
1:08 four giips is not enough you can modify
1:10 your python code to take advantage of
1:12 multiple threads but it adds a lot of
1:14 complexity to your code and there's all
1:16 kinds of gotas like race conditions
1:18 Deadlocks thread starvation and may even
1:20 lead to conflicts with demons even if
1:22 you do manage to get it working you
1:24 might find that your CPU just doesn't
1:25 have enough juice at which point you
1:27 look into using the thousands of cacor
1:29 on your GPU you but now you'll need to
1:31 write some C++ code and likely blow your
1:33 leg off in the process well what if
1:34 there is a language that just knew how Bend
1:36 to run things in parallel by default
1:38 that's the promise of Bend imagine we
1:39 have a computation that adds two
1:41 completely random numbers together in
1:43 Python The Interpreter is going to
1:44 convert this into B code and then
1:46 eventually run it on the python virtual
1:48 machine pretty simple but in Bend things
1:50 are a little more complex the elements
1:52 of the computation are structured into a
1:54 graph which are called interaction
1:55 combinators you can think of it as a big
1:57 network of all the computations that
1:59 need to be done when two nodes run into
2:00 each other the computation progresses by
2:03 following a simple set of rules that
2:04 rewrite the computation in a way that
2:06 can be done in parallel it continues
2:08 this pattern until all computations are
2:09 done it then merges the result back into
2:11 whatever expression was returned from
2:13 the function this concept of interaction
2:15 combinators goes all the way back to the
2:17 1990s and is implemented in a runtime
2:19 called the higher order virtual machine
2:21 hbm is not meant to be used directly and
2:23 that's why they build bend a highle
2:25 language to interface with it and the
2:26 language itself is implemented in Rust
2:29 its syntax is very similar to Python and
2:31 we can write a Hello World by defining a
2:32 main function that returns a string now Bend Run
2:34 to execute this code we can pull up the
2:36 terminal and use the Ben run command by
2:39 default this is going to use the rust
2:40 interpreter which will execute it
2:42 sequentially just like any other boring
2:44 language but now here's where things get
2:46 interesting imagine we have an algorithm
2:48 that needs to count a bunch of numbers
2:49 and then add them together the first
2:50 thing that might blow your mind is that
2:52 bend does not have loops like we can't
2:54 just do a for Loop like we would in
2:56 Python instead Bend has something
2:58 entirely different called a fold that
3:00 works like a search and replace for data
3:01 types and any algorithm that requires a
3:04 loop can be replaced with a fold
3:05 basically a fold allows you to consume
3:07 recursive data types in parallel like a
3:09 list or a tree but first we need to
3:11 construct a recursive data type and for
3:13 that we have the bend keyword which is
3:15 like the opposite of fold now if that's
3:16 a little too mind-bending maybe check
3:18 out my back catalog for recursion in 100
3:20 seconds but now let's see what this
3:22 looks like from a performance standpoint
3:24 when I try to run this algorithm on a
3:25 single thread it takes forever like 10
3:27 minutes or more however I can run the
3:29 same code without any modification
3:31 whatsoever with the bend run C command
3:33 when I do that it's now utilizing all 24
3:36 threads on my CPU and now it only takes
3:38 about 30 seconds to run the computation
3:40 that's a huge Improvement but I think we
3:42 can still do better because I'm a baller
3:44 I have an Nvidia RTX 490 and once again
3:47 I can run this code without any
3:48 modification on Cuda with Bend run- cuu
3:51 and now this code only takes 1 and 1
3:53 half seconds to run and I'll just go
3:54 ahead and drop the mic right there this
3:56 has been the code report thanks for
3:58 watching and I will see you in the next
3:59 one`;
