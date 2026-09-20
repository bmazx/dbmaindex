---
title: Switching From C++ to C For My Game Engine
author: Brian Ma
date: 2026-09-19
description: Building a game engine in C moving from C++
---

As you may have noticed, I am currently building a game engine in C99... well more like a game framework or renderer hardware interface (RHI) instead. When you hear the term 'game engine' you probably might be thinking of complete applications with fully in built editors and multiple component systems for moving and manipulating game assets in the scene. My game engine on the other hand does not have any sort of editor GUI interface, nor does it have any plans to implement one, instead you would need to call API function calls to render scenes. This is more akin to other game frameworks like sfml and raylib.

This time, I will only be discussing the transition of my engine from C++ to C.

## What? Why?

Now you are probably wondering why I would do this? Why would I move from C++ which has a lot more useful and convenient features and switch to just plain old boring C. These are valid questions, most game engines and also the entire game industry in general regards C++ as the number one go-to for writing video games and game engines.

First, let's discuss the way I write and use C++. If you don't know, C++ is a multiparadigm language meaning you can write C++ code that is either completely object oriented (OOP) or procedural. I use the latter form so this means I'm mostly not using any OOP in my code at all. And what ends up happening is that I write C++ code that looks a lot similar to C with only a few C++ aspects such as namespaces or some C++ features like std::vector.

I use this paradigm because there are some disadvantages with using OOP or some of the more advanced features in the standard library. This is mostly due to the way data containers work in the standard library. For example most data containers such as std::list or std::unordered_set allocate memory internally using new and delete. This is alright for general use case, but in the world of game development, this is especially an annoying issue since it's a bit harder to control where these data containers are allocating memory from. Of course you might be able to do something like overriding the new operator to redirect memory allocations to custom allocators, but this is a little janky as it's applied globally and so every allocation made throughout the entire program will go through the overrided function instead even if you don't need every alloc to be.

There is another way to redirect allocations from data containers which is done through the template parameters of the data container, but this is a bit tedious as well since I have to add an extra parameter to the template for each data container I declare.

Another thing that I have come to realize is that I tend to always write C-styled C++ when using C++ when building the earlier versions of my game engine.This isn't really anything special, in fact this C-styled C++ is actually a popular coding styled within the gaming industry as well as the embedded programming.

The point is that sometimes simpler is better, and in this case C or C-styled C++ is just way better for understanding code and readability especially for a game engine. A pretty well known example of this are the jokes on the horrors of template meta-programming in C++ or the weird and convoluted ways you can use operator overloading on data structures. Contrast this with C-styled programming and suddenly a lot of things become more simpler to understand and read. It may take more work setting things up, but the payoff is that code is much more readable and you can actually tell what the code is doing without any hidden implementation details.

So is this why I moved to C? Well this was not the main reason. I'll even say that if it weren't for the other reasons to switch, I would have wanted to stay with C++ due to just these small features such as namespaces.

## The ABI

Probably the bigger reason I wanted to switch away from C++ to C was due to the unappealing state of C++'s ABI. The ABI, or Application Binary Interface, is this construct at the architectural low-level. It's purpose basically allows code compiled in one language to be used in another through the interface. For example let's say I have a function defined in C with the signature `int addNums(int a, int b);`, then when the C code is compiled and turned into a library, other programming languages and link the library with their code and use this function if they define the correct function signature that corresponds to the function.

So the problem is that C++ doesn't really have a defined ABI which means you can't really have any complex data types in the function signatures you want to export in your library such as, `std::vector<int> getSomeData(const std::string& str, int n);`. In this C++ function signature, there are a few problems, there is no standard ABI to define how a `std::vector` might be translated to other languages, or even `const std::string&` which is a const reference. In general, you would have to use primitive data types like ints and floats to support ABI and this can be done in C++, but that would also mean you would have to cut everything from the C++ STL such as data containers and even your own classes that have have their own inner logic if you want to include them in your library API.

## Fin
So at this point, I was really pretty much writing C already in C++, and after I wanted to support ABI for interface support between other languages, I decided to just switch to C. The transition itself wasn't really that hard since a lot of the code was already written in C-styled code.

That being said, this does not mean I have cut C++ entirely from the engine, just that the core parts of my engine are written in C. I'm still planning to include C++ but only for external use like in examples since it is more convenient to setup everything in C++ such as using std::vector and std::string.
